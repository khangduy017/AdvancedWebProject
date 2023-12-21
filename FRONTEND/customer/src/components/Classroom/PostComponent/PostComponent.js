import React from 'react'
import styles from './PostComponent.module.css'
import { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AuthContext from "../../../store/auth-context";
import { useParams } from "react-router-dom";
import User from "../../../assests/img/user.jpg";


export default function PostComponent() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true)

  const [typing, setTyping] = useState(false);
  const [typingContent, setTypingContent] = useState("");
  const [typingTitle, setTypingTitle] = useState("");
  const [typingCmt, setTypingCmt] = useState("");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [postData, setPostData] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_HOST + "posts/get-all-posts/" + id, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          setPostData(res.data.value);
          setLoading(false);
        } else {
        }
      });
  }, [])

  const handleSubmitCreatePost = () => {
    const dataSubmit = {
      username: authCtx.userData.username,
      classId: id,
      title: typingTitle,
      content: typingContent,
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "posts/create-post", dataSubmit, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          setPostData(res.data.value);
          setTyping(!typing);
        } else {
        }
      });
  };

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
          setPostData(res.data.value);
        } else {
        }
      });
  };


  return (
    loading ?
      <div>
        <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
          <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div> : <>
        <div
          className={`${styles["flex-allpart-container"]} d-flex gap-4 my-4`}
        >
          <div className={`${styles["deadline-container"]} w-25`}>
            <h5 className={`${styles["deadline-title"]}`}>
              Due date is coming
            </h5>
            <div className={`${styles["deadline-content"]}`}>
              Congratulations, you don't have any assignments due!
            </div>
            <h5 className={`${styles["deadline-more"]}`}>More</h5>
          </div>
          <div className={`${styles["classroom-detail-container"]} w-75`}>
            {!typing ? (
              <div
                onClick={() => {
                  setTyping(!typing);
                }}
                className={`${styles["untyping-container"]} px-4 w-100 d-flex align-items-center`}
              >
                <img className={`${styles["untyping-img"]}`} src={User} alt='' />
                <div>Announce something to your class</div>
              </div>
            ) : (
              <div
                className={`${styles["typing-container"]} py-3 px-4 w-100`}
              >
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        setTypingTitle(event.target.value);
                      }}
                      value={typingTitle}
                      type="text"
                      className="form-control-container"
                      as="textarea"
                      rows={1}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        setTypingContent(event.target.value);
                      }}
                      value={typingContent}
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
                  <Button
                    onClick={() => {
                      setTyping(!typing);
                    }}
                    className={`${styles["button-cancel"]} d-flex gap-2`}
                    type="submit"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitCreatePost}
                    className={`${styles["button-post"]} d-flex gap-2`}
                    type="submit"
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
            {postData.map((data, index) => (
              <div
                className={`${styles["content-container"]} py-3 w-100`}
                key={index}
              >
                <div className={`d-flex px-4 align-items-center`}>
                  <img className={`${styles["untyping-img"]}`} src={User} alt='' />
                  <div className={`${styles["content-title-container"]}`}>
                    <h5 className={`${styles["content-title-creator"]}`}>
                      {data.creator}
                    </h5>
                    <div className={`${styles["content-title-time"]}`}>
                      December 1, 2023
                    </div>
                  </div>
                </div>
                <h5 className={`${styles["title-body-container"]} px-4`}>
                  {data.title}
                </h5>
                <div className={`${styles["content-body-container"]} px-4`}>
                  {data.content}
                </div>

                <div className={`${styles["horizontal-cmt"]}`}>
                  {data.comment !== undefined &&
                    data.comment.map((cmt, index) => (
                      <div
                        className={`${styles["more-margin-bottom"]} d-flex px-4`}
                        key={index}
                      >
                        <img
                          className={`${styles["cmt-img"]}`}
                          src={User}
                          alt=''
                        />
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
                  <div className={`d-flex px-4 w-100`} key={index}>
                    <img className={`${styles["cmt-img"]}`} src={User} alt="" />
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
  )
}