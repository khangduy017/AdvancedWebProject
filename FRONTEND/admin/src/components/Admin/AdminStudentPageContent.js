import styles from "./AdminStudentPageContent.module.css";
import { useState, useContext, useEffect } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";

const AdminPageContent = () => {
  const navigate = useNavigate();

  //   const [idInput, setIdInput] = useState("");
  //   const [loading, setLoading] = useState(false);

  const [isAcs, setIsAcs] = useState(true);
  const authCtx = useContext(AuthContext);
  const [studentIDInput, setStudentIDInput] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [listStudent, setListStudent] = useState(authCtx.listStudent);

  const [studentIdMongoose, setStudentIdMongoose] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const handleGetAllClasses = () => {
    axios
      .get(process.env.REACT_APP_API_HOST + "auth/get-all-student", { headers })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListStudent(res.data.value);
          setListStudent(res.data.value);
        } else {
        }
      })
      .catch((err) => {});
  };

  const handleChangeStudentID = (id) => {
    const data = {
      id: id,
      studentID: studentIDInput,
      _id: localStorage.getItem("_id"),
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "auth/update-student-id", data, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListStudent(res.data.value);
          setListStudent(res.data.value);
          toast.success("Update information successfully", styleSuccess);
        } else {
          toast.error(res.data.message, styleError);
        }
      })
      .catch((err) => {});
  };

  const submitStudentID = (event) =>{
    event.preventDefault();
    handleChangeStudentID(studentIdMongoose);
    handleClose();
  }
  const submitSearch = (event) => {
    event.preventDefault();
    const data = {
      searchInput: searchInput,
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "auth/search-student", data, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListStudent(res.data.value);
          setListStudent(res.data.value);
        } else {
        }
      })
      .catch((err) => {});
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
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);

  return (
    <div className={`${styles["total-container"]} w-75`}>
      <h3>Manage student</h3>
      <div
        className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}
      >
        <div className="d-flex">
          <div className={`${styles["dropdown"]}`}>
            <Button
              onClick={() => {
                setListStudent([...listStudent.reverse()]);
                setIsAcs(!isAcs);
              }}
              className={`${styles["dropbtn"]}`}
            >
              {isAcs ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>

        <Form
          className={`${styles["form-container"]} d-flex align-items-center justify-content-between`}
          onSubmit={submitSearch}
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
            <SearchIcon className={`${styles["search-icon-customize"]}`} />
          </Form.Group>
          <div
            className={`${styles["dropdown"]} ${styles["more-border-custom"]} d-flex justify-content-end`}
          >
            <FilterIcon />
            <div className={`${styles["dropdown-content"]}`}>
              <div
                onClick={() => {
                  setListStudent(authCtx.listStudent);
                }}
              >
                All students
              </div>
              <div
                onClick={() => {
                  setListStudent(
                    authCtx.listStudent.filter((student) => student.id !== "")
                  );
                }}
              >
                ID assigned
              </div>
              <div
                onClick={() => {
                  setListStudent(
                    authCtx.listStudent.filter((student) => student.id === "")
                  );
                }}
              >
                None ID
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Table striped bordered hover className="my-4 rounded-lg">
        <thead>
          <tr className={`${styles["bg-head"]}`}>
            <th>#</th>
            <th>Student ID</th>
            <th>Username</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {listStudent.map((data, index) => (
            <tr
              className={`${styles["add-hover"]} ${
                !data.active && styles["inactive"]
              }}`}
              key={index}
              onClick={() => {
                setStudentIdMongoose(data._id.toString());
                setStudentIDInput(data.id);
                handleShow();
              }}
            >
              <td>{index + 1}</td>
              <td>{data.id}</td>
              <td>{data.username}</td>
              <td>{data.fullname}</td>
              <td>{data.email}</td>
              <td>{data.role}</td>
            </tr>
          ))}
        </tbody>
        <Modal
          className={styles["modal-container"]}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <h4 className={styles["modal-heading"]}>Assign Student ID</h4>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitStudentID} className="form-container">
              <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  onChange={(event) => {
                    setStudentIDInput(event.target.value);
                  }}
                  value={studentIDInput}
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
              onClick={submitStudentID}
            >
              Join
            </Button>
          </Modal.Footer>
        </Modal>
      </Table>
    </div>
  );
};
export default AdminPageContent;
