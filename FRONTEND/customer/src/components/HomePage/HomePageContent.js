import styles from "./HomePageContent.module.css";
import { useState, useContext, useEffect } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as FolderIcon } from "../../assests/svg/folder.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import { ReactComponent as JoinIcon } from "../../assests/svg/join.svg";
import { ReactComponent as CreateIcon } from "../../assests/svg/create.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import toast from "react-hot-toast";
import { Toast } from "react-bootstrap";

const HomePageContent = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showFind, setShowFind] = useState(false);

  const handleCloseFind = () => {
    setShowFind(false);
    setInviteCodeInput("");
  };
  const handleShowFind = () => setShowFind(true);

  const [searchInput, setSearchInput] = useState("");

  const [idInput, setIdInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");

  const [inviteCodeInput, setInviteCodeInput] = useState("");

  const [createEnable, setCreateEnable] = useState(true);
  const [joinEnable, setJoinEnable] = useState(true);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState([]);

  let toastId;
  const loadingToast = () => {
    toastId = toast(
      (t) => (
        <div className="notification-up w-100 p-0">
          <div
            style={{
              width: "1.6rem",
              height: "1.6rem",
              color: "#5D5FEF",
              marginRight: "1rem",
            }}
            className="spinner-border"
            role="status"
          ></div>
          <p className="p-0 m-0" style={{ color: "#5D5FEF" }}>
            Loading...
          </p>
        </div>
      ),
      {
        duration: 600000,
        style: {
          cursor: "pointer",
          width: "10rem",
          border: "2px solid #5D5FEF",
          padding: "5px",
        },
      }
    );
  };
  const dismissToast = () => {
    toast.dismiss(toastId);
  };

  const authCtx = useContext(AuthContext);

  const token = authCtx.token;
  const userData = authCtx.userData;
  const headers = { Authorization: `Bearer ${token}` };

  const handleGetAllClasses = () => {
    const data = {
      _id: localStorage.getItem("_id"),
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "classes", data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setClasses(res.data.value);
          setClasses(res.data.value);
        } else {
        }
        setLoading(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);

  const color = [
    "#1C7ED6",
    "#0CA678",
    "#F08C00",
    "#F03E3E",
    "#5D5FEF",
    "#BE4BDB",
    "#E64980",
    "#E8590C",
    "#74B816",
    "#15AABF",
  ];

  const handleCreate = (event) => {
    loadingToast();
    event.preventDefault();
    const dataSubmit = {
      user: userData._id,
      title: titleInput,
      content: contentInput,
      inviteLink: "",
      color: color[Math.floor(Math.random() * 10)],
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "classes/create", dataSubmit, {
        headers,
      })
      .then((res) => {
        dismissToast();
        if (res.data.status === "success") {
          toast.success("Create class successfully", styleSuccess);
          handleGetAllClasses();
          setShow(false);
          setTitleInput("");
          setContentInput("");
        } else {
          toast.error(res.data.message, styleError);
        }
      });
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
    if (titleInput.length > 0) setCreateEnable(false);
    else setCreateEnable(true);
  }, [titleInput]);

  useEffect(() => {
    if (inviteCodeInput.length > 0) setJoinEnable(false);
    else setJoinEnable(true);
  }, [inviteCodeInput]);

  const [showClassModal, setShowClassModal] = useState(false);
  const [classInfo, setClassInfo] = useState({});

  const handleJoinCode = (e) => {
    loadingToast();
    e.preventDefault();
    const dataSubmit = {
      code:
        inviteCodeInput[0] === "#" ? inviteCodeInput.slice(1) : inviteCodeInput,
      id: localStorage.getItem("_id"),
    };

    axios
      .post(
        process.env.REACT_APP_API_HOST + "classes/invite-code",
        dataSubmit,
        { headers }
      )
      .then((res) => {
        dismissToast();
        if (res.data.status === "success") {
          if (res.data.already_in_class) {
            navigate(`/myclass/${res.data.value._id}/`);
          } else {
            setClassInfo(res.data.value);
            handleCloseFind();
            setShowClassModal(true);
          }
        } else {
          toast.error(res.data.value, styleError);
        }
      });
  };

  const joinClass = () => {
    loadingToast();
    const dataSubmit = {
      classId: classInfo._id,
      userId: localStorage.getItem("_id"),
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "classes/join-class", dataSubmit, {
        headers,
      })
      .then((res) => {
        dismissToast();
        if (res.data.status === "success") {
          navigate(`/myclass/${res.data.value}/`);
          handleGetAllClasses();
        } else {
        }
      });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      searchInput: searchInput,
      _id: localStorage.getItem("_id"),
    };

    axios
      .post(
        process.env.REACT_APP_API_HOST + "classes/search-class-customer",
        data,
        {
          headers,
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          setClasses(res.data.value);
        } else {
        }
        setLoading(false);
      })
      .catch((err) => {});
  };

  return (
    <div className={`${styles["total-container"]} w-75`}>
      <div
        className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}
      >
        <div className="d-flex">
          <Button
            onClick={handleShowFind}
            className={`${styles["find-classroom"]} d-flex align-items-center justify-content-center`}
            type="submit"
          >
            <JoinIcon />
            <div>Join class</div>
          </Button>
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={showFind}
            onHide={handleCloseFind}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Join class</h4>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleJoinCode} className="form-container">
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
                <div className="mt-4 d-flex justify-content-end align-items-center">
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
                    Find
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
          {/* class modal */}
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={showClassModal}
            onHide={() => {
              setShowClassModal(false);
            }}
          >
            <Modal.Header closeButton>
              <h4 className={styles["modal-heading"]}>Join class</h4>
            </Modal.Header>
            <Modal.Body>
              <div
                style={{ backgroundColor: `${classInfo.background}` }}
                className={`${styles["banner-container"]} rounded-4 w-100`}
              >
                <h2 className={`${styles["classroom-name"]}`}>
                  {classInfo.title}
                </h2>
                <p className={`${styles["classroom-note"]}`}>
                  {classInfo.content}
                </p>
                <p className={`${styles["classroom-owner"]}`}>
                  {classInfo.owner}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={() => {
                  setShowClassModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className={`${styles["save-button"]}`}
                onClick={joinClass}
                type="submit"
              >
                Join
              </Button>
            </Modal.Footer>
          </Modal>

          {localStorage.getItem("role") === "teacher" && (
            <>
              <Button
                onClick={handleShow}
                className={`${styles["find-classroom"]} d-flex align-items-center justify-content-center`}
                type="submit"
              >
                <CreateIcon />
                <div>Create class</div>
              </Button>
              <Modal
                className={styles["modal-container"]}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <h4 className={styles["modal-heading"]}>Create class</h4>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleCreate} className="form-container">
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
                    <div className="mt-4 d-flex justify-content-end align-items-center">
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
                        type="submit"
                      >
                        Create
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </>
          )}
        </div>

        <Form
          className={`${styles["form-container"]} d-flex align-items-center justify-content-between`}
          submit={submitSearch}
        >
          <Form.Group
            className="position-relative"
            controlId="formGridAddress1"
          >
            <SearchIcon
              className={`${styles["search-icon-customize"]} position-absolute`}
            />
            <Form.Control
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              value={searchInput}
              className={`${styles["form-control-container"]}`}
              placeholder="Search for classes..."
            />
          </Form.Group>

          <Button
            onClick={submitSearch}
            className={`${styles["find-classroom"]} d-flex align-items-center justify-content-center`}
            type="submit"
          >
            <div>Search</div>
          </Button>
        </Form>
      </div>
      {loading ? (
        <div
          style={{ marginTop: "10rem" }}
          className="d-flex justify-content-center"
        >
          <div
            style={{ width: "3rem", height: "3rem", color: "#5D5FEF" }}
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className={`${styles["more-gap"]} d-flex my-2 flex-wrap`}>
          {classes.map((data, index) => (
            <div
              onClick={() => {
                navigate(`/myclass/${data._id}/`);
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
                  Posts
                </h5>
                {data.recentTitleTopic.map((el, index) => (
                  <div
                    className={`${styles["class-instructor"]} px-3 pb-1`}
                    key={index}
                  >
                    {el.title}
                  </div>
                ))}

                {data.recentTitleTopic.length === 0 && (
                  <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                    Nothing
                  </div>
                )}
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
      )}
      {!loading && classes.length === 0 && (
        <div class="d-flex justify-content-start">
          <h3>No results</h3>
        </div>
      )}
    </div>
  );
};
export default HomePageContent;
