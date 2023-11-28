import styles from "./HomePageContent.module.css";
import { useState, useContext, useEffect } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as FolderIcon } from "../../assests/svg/folder.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import { ReactComponent as PlusIcon } from "../../assests/svg/plus.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import toast from "react-hot-toast";

const HomePageContent = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showFind, setShowFind] = useState(false);

  const handleCloseFind = () => setShowFind(false);
  const handleShowFind = () => setShowFind(true);


  const [searchInput, setSearchInput] = useState("");
  const classData = [1, 2, 3, 4, 1, 2, 3, 4];
  const colorForClass = [];
  for (let i = 0; i < classData.length; i++) {
    let randomColorNumber = Math.floor(Math.random() * 5);
    let randomColor;
    if (randomColorNumber === 0) randomColor = "blue";
    else if (randomColorNumber === 1) randomColor = "yellow";
    else if (randomColorNumber === 2) randomColor = "red";
    else if (randomColorNumber === 3) randomColor = "purple";
    else if (randomColorNumber === 4) randomColor = "green";
    colorForClass.push(randomColor);
  }

  const [idInput, setIdInput] = useState("");
  const [titleInput, setTitleInput] = useState('')
  const [contentInput, setContentInput] = useState('')
  const [topicInput, setTopicInput] = useState('')

  const [inviteCodeInput, setInviteCodeInput] = useState('')

  const [createEnable, setCreateEnable] = useState(true)
  const [joinEnable,setJoinEnable] = useState(true)

  const authCtx = useContext(AuthContext);

  const token = authCtx.token;
  const userData = authCtx.userData;
  const headers = { Authorization: `Bearer ${token}` };

  const [allClasses, setAllClasses] = useState([])

  const handleGetAllClasses = () => {
    const data = {
      _id: localStorage.getItem('_id')
    }

    axios.post(process.env.REACT_APP_API_HOST + "classes", data, { headers })
      .then(res => {
        if (res.data.status === 'success') {
          setAllClasses(res.data.value)
        }
        else {

        }
      })
      .catch(err => {

      })
  }

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);

  const color = ['#1C7ED6', '#0CA678', '#F08C00', '#F03E3E', '#5D5FEF',
    '#BE4BDB', '#E64980', '#E8590C', '#74B816', '#15AABF']

  const handleCreate = (event) => {
    // event.preventDefault();
    console.log(userData)
    const dataSubmit = {
      user: userData._id,
      title: titleInput,
      content: contentInput,
      topic: topicInput,
      inviteLink: "",
      color: color[Math.floor(Math.random() * 10)]
    }

    axios.post(process.env.REACT_APP_API_HOST + 'classes/create', dataSubmit, { headers }
    )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("Create class successfully", styleSuccess);
          handleGetAllClasses()
          setShow(false)
          setTitleInput('')
          setContentInput('')
          setTopicInput('')
        }
        else {
          toast.error(res.data.message, styleError);
        }
      });
  }


  const styleError = {
    style: {
      border: "2px solid red",
      padding: "10px",
      color: "red",
      fontWeight: "500",
    },
    duration: 4000,
  };

  const styleSuccess = {
    style: {
      border: "2px solid #28a745",
      padding: "5px",
      color: "#28a745",
      fontWeight: "500",
    },
    duration: 4000,
  };

  useEffect(() => {
    if (titleInput.length > 0) setCreateEnable(false)
    else setCreateEnable(true)
  }, [titleInput]);

  useEffect(()=>{
    if(inviteCodeInput.length > 0) setJoinEnable(false)
    else setJoinEnable(true)
  },[inviteCodeInput])

  const handleJoinCode = ()=>{
    const dataSubmit = {
      code: inviteCodeInput
    }

    axios.post(process.env.REACT_APP_API_HOST + 'classes/invite-code', dataSubmit, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          console.log(res.data.status)
          navigate(`/myclass/${res.data.value._id}/join`)
        }
        else {
          toast.error(res.data.message, styleError);
        }
      });
  }

  return (
    <div className={`${styles["total-container"]} w-75`}>
      <div
        className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}
      >
        <div className="d-flex">
          <Button
            onClick={handleShowFind}
            className={`${styles["find-classroom"]}`}
            type="submit"
          >
            Join classroom
          </Button>
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={showFind}
            onHide={handleCloseFind}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Join classroom</h4>
            </Modal.Header>
            <Modal.Body>
              <Form className="form-container">
                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Invite code</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setInviteCodeInput(event.target.value);
                    }}
                    value={inviteCodeInput}
                    className="form-control-container"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={handleCloseFind}
              >
                Close
              </Button>
              <Button
                className={`${styles["save-button"]}`}
                onClick={handleJoinCode}
                disabled={joinEnable}
              >
                Join
              </Button>
            </Modal.Footer>
          </Modal>

          {localStorage.getItem("role") === "teacher" && (
            <>
              <Button
                onClick={handleShow}
                className={`${styles["find-classroom"]}`}
                type="submit"
              >
                Create classroom
              </Button>
              <Modal
                className={styles["modal-container"]}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <h4 className={styles["modal-heading"]}>Create classroom</h4>
                </Modal.Header>
                <Modal.Body>
                  <Form className="form-container">
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        onChange={(event) => {
                          setTitleInput(event.target.value);
                        }}
                        value={titleInput}
                        className="form-control-container"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Label>Content</Form.Label>
                      <Form.Control
                        onChange={(event) => {
                          setContentInput(event.target.value);
                        }}
                        value={contentInput}
                        className="form-control-container"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Label>Topic</Form.Label>
                      <Form.Control
                        onChange={(event) => {
                          setTopicInput(event.target.value);
                        }}
                        value={topicInput}
                        className="form-control-container"
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    className={`${styles["close-button"]}`}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    className={`${styles["save-button"]}`}
                    onClick={handleCreate}
                    disabled={createEnable}
                  >
                    Create
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>

        <Form
          className={`${styles["form-container"]} d-flex align-items-center justify-content-between`}
        >
          <Form.Group
            className="position-relative"
            controlId="formGridAddress1"
          >
            <Form.Control
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              value={searchInput}
              className={`${styles["form-control-container"]}`}
            />
            <SearchIcon
              className={`${styles["search-icon-customize"]} position-absolute`}
            />
          </Form.Group>
          <div
            className={`${styles["filter-icon-customize"]} d-flex align-items-center justify-content-center`}
          >
            <FilterIcon />
          </div>
        </Form>
      </div>
      <div className="d-flex my-2 flex-wrap justify-content-between">
        {allClasses.map((data, index) => (
          <div
            onClick={() => {
              navigate(`/myclass/${data._id}`);
            }}
            className={`${styles["class-content-container"]} mt-4 rounded-3`}
            key={index}
          >
            <div
              style={{ backgroundColor: data.background }}
              className={`${styles["class-title-container"]} rounded-top-3`}
            >
              <h2 className={`${styles["class-title"]} px-3 pt-3`}>
                {data.title}
              </h2>
              <div className={`${styles["class-instructor"]} px-3 pt-0`}>
                {data.content}
              </div>
              <div className={`${styles["class-instructor"]} px-3 pt-2 pb-3`}>
                {data.owner}
              </div>
            </div>
            <div className={`${styles["class-mid-container"]} rounded-top-3`}>
              <h5 className={`${styles["class-assignment-title"]} px-3 pt-3`}>
                Assignment - Due in January
              </h5>
              <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                Infinite Scroll
              </div>
              <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                Midterm Project Authentication
              </div>
              <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                Final Project Classroom
              </div>
            </div>
            <div
              className={`${styles["class-footer-container"]} d-flex justify-content-end align-items-center px-4`}
            >
              <FolderIcon className={`${styles["size-icon"]} m-3`} />
              <LeaveIcon className={styles["size-icon"]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomePageContent;
