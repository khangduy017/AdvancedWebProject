import React from 'react'
import styles from './ReviewDetail.module.css'
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import AuthContext from "../../../../store/auth-context";
import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { Button } from "react-bootstrap";
import fakeData from '../fakeData';



export default function ReviewDetail() {
  const { id } = useParams();


  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  console.log(fakeData.reviewHistoryData.find(review => review._id === id))

  const [reviewData, setReviewData] = useState(fakeData.reviewHistoryData.find(review => review._id === '1'))

  const [typingCmt, setTypingCmt] = useState("");

  const handleSubmitCreateComment = (postIdParam) => {
    const dataSubmit = {
      creator: authCtx.userData.username,
      postId: postIdParam,
      content: typingCmt,
      classId: id,
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "posts/create-comment", dataSubmit, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
        } else {
        }
      });
  };


  return (
    <div
      className={`${styles["content-container"]} py-3 w-100`}
    >
      <div className={`${styles["typing-container"]} py-3 px-4 w-100`}>
        <Form>
          <Form.Group
            className="mb-3 d-flex align-items-center justify-content-between"
            controlId="exampleForm.ControlTextarea1"
          >
            <div className="mb-1 d-flex align-items-center">
              <Form.Group style={{ width: '15rem' }} className="mb-1" controlId="formGridAddress1">
                <Form.Label>Grade Composition</Form.Label>
                <p>{reviewData.composition}</p>
              </Form.Group>
              <Form.Group style={{ width: '10rem', marginLeft: '2%' }} className="mb-1" controlId="formGridAddress1">
                <Form.Label>Current Grade</Form.Label>
                <p>{reviewData.current_grade}</p>
              </Form.Group>
            </div>
            <Form.Group style={{ width: '20%', marginLeft: '2%' }} className="d-flex align-items-center mb-1" controlId="formGridAddress1">
              <Form.Label className='m-0 p-0' style={{ fontSize: '1rem', fontWeight: 'bold', color: "#5D5FEF" }}>Expected Grade:</Form.Label>
              <p>{reviewData.expected_grade}</p>
            </Form.Group>

          </Form.Group>
          <Form.Group
            className="mb-3 mt-0"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Reason</Form.Label>
            <Form.Control
                  value={reviewData.reason}
                  disabled={true}
                  type="text"
                  className="form-control-container"
                  as="textarea"
                  rows={5}
                />
          </Form.Group>
        </Form>
        <div
          className={`${styles["button-typing-container"]} d-flex justify-content-end gap-2`}
        >
        </div>
      </div>


      {/* <div className={`${styles["horizontal-cmt"]}`}>
        {data.comment !== undefined &&
          data.comment.map((cmt, index) => (
            <div
              className={`${styles["more-margin-bottom"]} d-flex px-4`}
              key={index}
            >
              <div className={`${styles["cmt-title-container"]}`}>
                <h5 className={`${styles["cmt-title-creator"]}`}>
                  {cmt.creator}
                </h5>
                <div className={`${styles["cmt-title-content"]}`}>
                  {cmt.content}
                </div>
              </div>
            </div>
          ))}
        <div className={`d-flex px-4 w-100`} >
          <Form className={`${styles["more-w"]}`}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                onChange={(event) => {
                  setTypingCmt(event.target.value);
                }}
                placeholder="Add comment to this post..."
                type="text"
                className={`${styles["form-cmt"]} form-control-container w-100`}
                as="input"
                rows={1}
              />
            </Form.Group>
          </Form>
          <Button
            onClick={() => {
              handleSubmitCreateComment(data._id);
            }}
            className={`${styles["button-send"]} d-flex gap-2`}
            type="submit"
          >
            Send
          </Button>
        </div>
      </div> */}
    </div>
  )
}
