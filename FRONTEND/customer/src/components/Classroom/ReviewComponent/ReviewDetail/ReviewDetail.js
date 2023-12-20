import React from 'react'
import styles from './ReviewDetail.module.css'
import Form from "react-bootstrap/Form";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import AuthContext from "../../../../store/auth-context";
import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { Button, Card } from "react-bootstrap";
import member_image from '../../../../assests/img/member_avatar.png'
import Modal from "react-bootstrap/Modal";
import toast, { useToaster } from "react-hot-toast";



export default function ReviewDetail() {
  const { id } = useParams();
  const { grade_id } = useParams();
  const { review_id } = useParams();

  const navigate = useNavigate()

  const [reviewData, setReviewData] = useState({})
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname)
    if(!loading){
      setLoading(true)
      const data = {
        _id: review_id
      }
  
      axios.post(process.env.REACT_APP_API_HOST + 'review/get-review', data, { headers })
        .then((res) => {
          if (res.data.status === "success") {
            setReviewData(res.data.review)
            setComments(res.data.comments)
            setLoading(false)
          }
          else {
          }
        });
    }
  }, [location.pathname]);


  useEffect(() => {
    const data = {
      _id: review_id
    }

    axios.post(process.env.REACT_APP_API_HOST + 'review/get-review', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setReviewData(res.data.review)
          setComments(res.data.comments)
          setLoading(false)
        }
        else {
        }
      });
  }, [])

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };


  const [typingCmt, setTypingCmt] = useState("");

  const handleSendComment = (e) => {
    e.preventDefault()

    const data = {
      _id: localStorage.getItem('_id'),
      content: typingCmt,
      review_id,
      grade_id,
      class_id: id,
      fromName: localStorage.getItem('role') === 'teacher' ? authCtx.userData.username : authCtx.userData.id
    }

    setTypingCmt('')

    axios.post(process.env.REACT_APP_API_HOST + 'review/send-comment', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setComments(res.data.comments)
        }
        else {
        }
      });
  }

  const styleSuccess = {
    style: {
      border: "2px solid #28a745",
      padding: "5px",
      color: "#28a745",
      fontWeight: "500",
    },
    duration: 4000,
  };

  const styleError = {
    style: {
      border: "2px solid red",
      padding: "10px",
      color: "red",
      fontWeight: "500",
    },
    duration: 4000,
  };

  const [finalReview, setFinalReview] = useState('')

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
  };

  const [disableFinal, setDisableFinal] = useState(true)

  useEffect(() => {
    if (finalReview.length > 0) setDisableFinal(false)
    else setDisableFinal(true)
  }, [finalReview])

  const markFinalDecision = () => {
    const data = {
      review_id,
      final_grade: finalReview,
      final_decision_by: authCtx.userData.username,
      grade_id,
      class_id: id,
      fromName: authCtx.userData.username
    }

    axios.post(process.env.REACT_APP_API_HOST + 'review/mark-final-decision', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          handleClose()
          toast.success('Mark final review successfully!', styleSuccess);
          setReviewData(res.data.review)
        }
        else {
          toast.error(res.data.value, styleError);
        }
      });
  }

  return (
    <>
      {loading ?
        <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
          <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        :
        <>
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={handleClose}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Confirm Review</h4>
            </Modal.Header>
            <Modal.Body>
              <Form className="form-container">
                <Form.Label style={{ fontSize: '1rem' }}>Will <span style={{ fontWeight: 'bold' }}>{finalReview}</span> points be your final decision?</Form.Label>
                <p className='mb-0 mt-4' style={{ fontStyle: 'italic', color: '#F03E3E' }}>Please note that after confirmation, changes cannot be made.</p>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className={`${styles["save-button"]}`}
                onClick={markFinalDecision}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          <div className='d-flex align-items-center mt-5 mb-1 gap-4'>
            <svg style={{ cursor: 'pointer' }} onClick={() => { navigate(-1) }} xmlns="http://www.w3.org/2000/svg" height="28" width="36" viewBox="0 0 448 512">
              <path fill="#2c2c66" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            {
              localStorage.getItem('role') === 'teacher' ?
                <h3 className={`${styles['grade-structure-title']} m-0 p-0`}>
                  Review request at {reviewData.time} by <span style={{ color: '#5D5FEF' }}>{reviewData.student_id}</span>
                </h3>
                :
                <h3 className={`${styles['grade-structure-title']} m-0 p-0`}>Review request at {reviewData.time}</h3>
            }
          </div>
          <div className={`${styles["review-detail-container"]} d-flex`}>
            <div
              className={`${styles["content-container"]} py-3 w-100`}
            >
              <div style={{ minHeight: '11rem' }} className={`${styles["typing-container"]} py-3 px-4 w-100`}>
                <Form>
                  <div className='d-flex w-100 align-items-center justify-content-between'>
                    <p className={`m-0 ${styles['review-item']}`}>Grade Composition: <span>{reviewData.composition}</span></p>
                    <p className={`m-0 ${styles['review-item']}`}>Current Grade: <span>{reviewData.current_grade}</span></p>
                    <p className={`m-0 ${styles['review-item']}`}>Expected Grade: <span>{reviewData.expected_grade}</span></p>
                    <div className='p-2 rounded-2' style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold', backgroundColor: `${reviewData.final_grade.length > 0 ? '#0CA678' : '#F08C00'}` }} >
                      {reviewData.final_grade.length > 0 ? 'Done' : 'Waiting'}
                    </div>

                  </div>

                  <Form.Group
                    className="mb-3 mt-4"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <p className={`${styles['review-item']} mb-1`}>Reason</p>
                    <p>{reviewData.reason}</p>
                  </Form.Group>
                </Form>
              </div>
              {/* COMMENT */}
              <div className={`${styles["horizontal-cmt"]} px-4`}>
                <Form.Label className='mb-3 p-0' style={{ fontSize: '1rem', fontWeight: 'bold', color: "#5D5FEF" }}>Comments</Form.Label>
                <Form onSubmit={handleSendComment} className={`d-flex w-100 mb-4`}>
                  <Form.Group className={`${styles['more-w']}`} controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                      onChange={(event) => {
                        setTypingCmt(event.target.value);
                      }}
                      value={typingCmt}
                      placeholder="Enter your comment..."
                      type="text"
                      className={`${styles["form-cmt"]} form-control-container w-100`}
                      as="input"
                      rows={1}
                      disabled={reviewData.final_grade.length > 0}
                    />
                  </Form.Group>
                  <Button
                    className={`${styles["button-send"]} d-flex gap-2`}
                    type="submit"
                    disabled={reviewData.final_grade.length > 0}
                  >
                    Send
                  </Button>
                </Form>

                {comments.map((cmt, index) => (
                  <div className={`${styles["more-margin-bottom"]} d-flex p-2 mt-2 gap-2`}
                    key={index}
                  >
                    <img src={member_image} alt='' />
                    <div style={{ flexDirection: 'column' }} className='d-flex gap-0'>
                      <h5 className={`${styles["cmt-title-creator"]} p-0 m-0 `}>{cmt.name}</h5>
                      <small style={{ fontStyle: 'italic' }}>{cmt.time}</small>
                      <div className={`${styles["cmt-title-content"]}  p-0 mt-1 mb-0`}>{cmt.content}</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
            <div className={`${styles["finalized-container"]} `}>
              <div className={`${styles["overall"]} d-flex p-3`}>
                <p className='mb-1' style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }} >Overall</p>
                {(localStorage.getItem('role') === 'student' || reviewData.final_grade.length > 0) ?
                  <p className='p-0 m-0' style={{ fontSize: '6rem', fontWeight: 'bold', textAlign: 'center', color: 'white' }} > {reviewData.final_grade.length > 0 ? reviewData.final_grade : '-'}</p>
                  :
                  <input className='rounded-2 mt-3' style={{ width: '80%', fontSize: '5rem', fontWeight: 'bold', textAlign: 'center' }} onChange={(e) => { setFinalReview(e.target.value) }} value={finalReview} maxLength={2} />
                }
              </div>
              {localStorage.getItem('role') === 'teacher' && !(reviewData.final_grade.length > 0) && <Button
                onClick={() => { setShow(true) }}
                className={`${styles['grade-structure-done-button']} p-0`}
                type="submit"
                disabled={disableFinal}
              >
                Done
              </Button>}
              {reviewData.final_grade.length > 0 &&
                <small style={{ fontStyle: 'italic' }}>Mark the final decision by <span style={{ fontWeight: 'bold' }}>{reviewData.final_decision_by}</span>
                </small>
              }
            </div>
          </div>
        </>}
    </>

  )
}
