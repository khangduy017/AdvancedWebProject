import React from 'react'
import styles from './ReviewComponent.module.css'
import { useEffect, useState, useContext, useRef } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import AuthContext from "../../../store/auth-context";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import toast, { useToaster } from "react-hot-toast";
import { Outlet, useLocation, useParams, NavLink, useNavigate } from "react-router-dom";



export default function ReviewComponent() {
  const { grade_id } = useParams();
  const { id } = useParams();


  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [loading, setLoading] = useState(true)

  const [typing, setTyping] = useState(false);
  const [typingContent, setTypingContent] = useState("");
  const [typingTitle, setTypingTitle] = useState("");

  const expectedGradeInputRef = useRef();

  const [gradeComposition, setGradeComposition] = useState()
  const [studentGrade, setStudentGrade] = useState({})
  const [studentGradeStructure, setStudentGradeStructure] = useState([])

  const navigate = useNavigate()

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

  const [reviewHistory, setReviewHistory] = useState([])

  useEffect(() => {
    if (localStorage.getItem('role') === 'student') {
      const data = {
        id: localStorage.getItem('_id'),
        grade_id: grade_id
      }

      axios.post(process.env.REACT_APP_API_HOST + 'grade/get-grade-by-student-id', data, { headers })
        .then((res) => {
          if (res.data.status === "success") {
            setStudentGrade(res.data.grade)
            setStudentGradeStructure(res.data.gradeStructure)
            if (res.data.gradeStructure.length > 0) {
              setGradeComposition(res.data.gradeStructure[0].name)
            }
          }
          else {
          }
        });

      const _data = {
        _id: localStorage.getItem('_id'),
        id
      }

      axios.post(process.env.REACT_APP_API_HOST + 'review/review-history', _data, { headers })
        .then((res) => {
          if (res.data.status === "success") {
            console.log(res.data.value)
            setReviewHistory(res.data.value)
          }
          else {
          }
          setLoading(false)
        });
    }

    if (localStorage.getItem('role') === 'teacher') {
      const _data = { id }

      axios.post(process.env.REACT_APP_API_HOST + 'review/send-review-in-class', _data, { headers })
        .then((res) => {
          if (res.data.status === "success") {
            setReviewHistory(res.data.value)
          }
          else {
          }
          setLoading(false)
        });
    }
  }, [])

  const handleSelectGradeComposition = (e) => {
    setGradeComposition(e.target.value)
  }

  const handleSubmitRequestReview = (e) => {
    e.preventDefault()

    const data = {
      _id: localStorage.getItem('_id'),
      class_id: id,
      grade_id,
      composition: gradeComposition,
      current_grade: studentGrade.grade[gradeComposition],
      expected_grade: expectedGradeInputRef.current.value,
      reason: typingContent
    }

    axios.post(process.env.REACT_APP_API_HOST + 'review/create', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          expectedGradeInputRef.current.value = ''
          setTypingContent('')
          toast.success('Request review successfully!', styleSuccess);
          setReviewHistory(res.data.value)
        }
        else {
          toast.error(res.data.value, styleError);
        }
      });
  };

  return (
    <>
      {localStorage.getItem('role') === 'student' && <div className={`${styles['review-container']}`}>
        {loading ?
          <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
            <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          :
          <>
            <h3 className={`${styles['grade-structure-title']} mt-4 mb-3`}>Review form</h3>
            {studentGradeStructure.length > 0 ? <div className={`${styles["typing-container"]} py-3 px-4 w-100`}>
              <Form onSubmit={handleSubmitRequestReview}>
                <Form.Group
                  className="mb-3 d-flex align-items-center justify-content-between"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <div className="mb-1 d-flex align-items-center">
                    <Form.Group style={{ width: '15rem' }} className="mb-1" controlId="formGridAddress1">
                      <Form.Label>Grade Composition</Form.Label>
                      <Form.Select onChange={handleSelectGradeComposition}>
                        {studentGradeStructure.map((value, index) => <option value={value.name}>{value.name}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group style={{ width: '10rem', marginLeft: '2%' }} className="mb-1" controlId="formGridAddress1">
                      <Form.Label>Current Grade</Form.Label>
                      <Form.Control value={studentGrade.grade[gradeComposition]} className={`form-control w-50`} type="text" disabled={true} />
                    </Form.Group>
                  </div>
                  <Form.Group style={{ width: '20%', marginLeft: '2%' }} className="d-flex align-items-center mb-1" controlId="formGridAddress1">
                    <Form.Label className='m-0 p-0' style={{ fontSize: '1rem', fontWeight: 'bold', color: "#5D5FEF" }}>Expected Grade:</Form.Label>
                    <Form.Control style={{ width: '30%' }} maxLength={2} ref={expectedGradeInputRef} required className={`form-control`} type="text" />
                  </Form.Group>

                </Form.Group>
                <Form.Group
                  className="mb-3 mt-0"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setTypingContent(event.target.value);
                    }}
                    value={typingContent}
                    type="text"
                    className="form-control-container"
                    as="textarea"
                    rows={5}
                    required={true}
                  />
                </Form.Group>
                <div
                  className={`${styles["button-typing-container"]} d-flex justify-content-end gap-2`}
                >
                  <Button
                    className={`${styles["button-post"]} d-flex gap-2`}
                    type="submit"
                  >
                    Request
                  </Button>
                </div>
              </Form>
            </div> : <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
              <p className="p-0 m-0">No composition are public</p>
            </div>}
            <h3 className={`${styles['grade-structure-title']} mt-5 mb-3`}>Review history</h3>
            {/* =============== REVIEW HISTORY =============== */}
            {reviewHistory.length > 0 ? reviewHistory.map((value, index) =>
              <Card style={{ display: 'flex', flexDirection: 'row', color: '#2C2C66', padding: '0.7rem 0rem 0.7rem 1.2rem' }} key={value._id} className='mt-2 align-items-center'>
                <p style={{ width: '5%' }} className='p-0 m-0'>#{index + 1}</p>
                <p style={{ width: '35%', margin: 0, fontStyle: 'italic' }} className='p-0'>Review request at {value.time}</p>
                <p style={{ width: '30%', margin: 0 }}>Composition:
                  <span style={{ fontWeight: 'bold', color: '#5D5FEF' }} > {value.composition}</span>
                </p>
                <p style={{ width: '20%', margin: 0 }}>Status:
                  <span style={{ fontWeight: 'bold', color: `${value.final_grade.length > 0 ? '#0CA678' : '#F08C00'}` }} > {value.final_grade.length > 0 ? 'Done' : 'Waiting'}</span>
                </p>
                <NavLink
                  to={`/myclass/${id}/review/${grade_id}/${value._id}`}
                  className={`${styles["button-post"]} rounded-2`}
                >
                  Detail
                </NavLink>
              </Card>) :
              <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
                <p className="p-0 m-0">There have been no review requests before</p>
              </div>}
          </>}
      </div>}
      {/* TEACHER */}
      {localStorage.getItem('role') === 'teacher' &&
        <div className={`${styles['review-container']}`}>
          {loading ?
            <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
              <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            :
            <>
              <h3 className={`${styles['grade-structure-title']} mt-5 mb-3`}>Review requests</h3>
              {reviewHistory.length > 0 ? reviewHistory.map((value, index) =>
                <Card style={{ display: 'flex', flexDirection: 'row', color: '#2C2C66', padding: '0.7rem 0rem 0.7rem 1.2rem' }} key={value._id} className='mt-2 align-items-center'>
                  <p style={{ width: '5%' }} className='p-0 m-0'>#{index + 1}</p>
                  <p style={{ width: '40%', margin: 0, fontStyle: 'italic' }} className='p-0'>Review request at {value.time}</p>
                  <p style={{ width: '25%', margin: 0 }}>Student Id:
                    <span style={{ fontWeight: 'bold', color: '#5D5FEF' }} > {value.student_id}</span>
                  </p>
                  <p style={{ width: '20%', margin: 0 }}>Status:
                    <span style={{ fontWeight: 'bold', color: `${value.final_grade.length > 0 ? '#0CA678' : '#F08C00'}` }} > {value.final_grade.length > 0 ? 'Done' : 'Waiting'}</span>
                  </p>
                  <NavLink
                    to={`/myclass/${id}/review/${grade_id}/${value._id}`}
                    className={`${styles["button-post"]} rounded-2`}
                  >
                    Detail
                  </NavLink>
                </Card>) :
                <div className={`${styles['grade-empty']} d-flex align-items-center justify-content-center p-4`}>
                  <p className="p-0 m-0">There have been no review requests</p>
                </div>}
            </>}
        </div>}
    </>

  )
}
