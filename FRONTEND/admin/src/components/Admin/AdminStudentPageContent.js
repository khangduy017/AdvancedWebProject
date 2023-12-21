import styles from "./AdminStudentPageContent.module.css";
import { useState, useContext, useEffect, useRef } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import { ReactComponent as ImportIcon } from "../../assests/svg/import.svg";
import { ReactComponent as SortIcon } from "../../assests/svg/sort.svg";
import { ReactComponent as AddIcon } from "../../assests/svg/plus.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";

const AdminPageContent = () => {
  const navigate = useNavigate();

  //   const [idInput, setIdInput] = useState("");
  //   const [loading, setLoading] = useState(false);

  const [isAcs, setIsAcs] = useState(true);
  const authCtx = useContext(AuthContext);

  const [studentIDInput, setStudentIDInput] = useState("");

  const [addStudentIDInput, setAddStudentIDInput] = useState("");
  const [addFullnameInput, setAddFullnameInput] = useState("");

  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [listStudent, setListStudent] = useState(authCtx.listStudent);

  const [studentIdMongoose, setStudentIdMongoose] = useState("");
  const [isVerify, setIsVerify] = useState(true);

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

  const handleChangeStudentID = (id, isVerify) => {
    const data = {
      id: id,
      isVerify: isVerify,
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

  const submitStudentID = (event) => {
    event.preventDefault();
    handleChangeStudentID(studentIdMongoose, isVerify);
    handleClose();
  };

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

  const fileInputRef = useRef(null);

  const _handleUploadStudentList = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadStudentList = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          let jsonData = XLSX.utils.sheet_to_json(worksheet);

          const containsStudentId = jsonData.every(
            (row) => row.StudentId !== undefined
          );
          const containsFullName = jsonData.every(
            (row) => row.FullName !== undefined && row.FullName.length > 0
          );

          if (containsStudentId && containsFullName) {
            jsonData = jsonData.map((item) => {
              return {
                studentId: item.StudentId.toString(),
                fullname: item.FullName.toString(),
              };
            });

            const data = {
              jsonData,
              isFile: true,
            };

            axios
              .post(
                process.env.REACT_APP_API_HOST + "auth/create-student",
                data,
                { headers }
              )
              .then((res) => {
                if (res.data.status === "success") {
                  authCtx.setListStudent(res.data.value);
                  setListStudent(res.data.value);
                  toast.success(
                    "Upload data is success (Not include duplicate and null values)",
                    styleSuccess
                  );
                } else {
                  toast.error(res.data.value, styleError);
                }
              });
          } else {
            toast.error(
              "The uploaded file is not in the correct format (StudentId, FullName)",
              styleError
            );
          }

          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
        } catch (error) {
          console.error("Lỗi khi chuyển đổi file Excel:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const submitAddStudentID = (event) => {
    event.preventDefault();

    const jsonData = [
      {
        studentId: addStudentIDInput,
        fullname: addFullnameInput,
      },
    ];

    const data = {
      jsonData,
      isFile: false,
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "auth/create-student", data, {
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
      });

    handleCloseAdd();
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
        <div className="d-flex gap-2">
          <div className={`${styles["dropdown"]}`}>
            <Button
              onClick={() => {
                setListStudent([...listStudent.reverse()]);
                setIsAcs(!isAcs);
              }}
              className={`${styles["dropbtn"]} d-flex align-items-center justify-content-center`}
            >
              <SortIcon />
              {isAcs ? "Ascending" : "Descending"}
            </Button>
          </div>
          <div>
            <Button
              onClick={_handleUploadStudentList}
              className={`${styles["import-student"]} d-flex align-items-center justify-content-center`}
            >
              <ImportIcon />
              <div>Import student</div>
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleUploadStudentList}
              />
            </Button>
          </div>
          <div>
            <Button
              onClick={handleShowAdd}
              className={`${styles["add-student"]} d-flex align-items-center justify-content-center`}
            >
              <AddIcon />
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
              placeholder="Search for students...."
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
            <th>Fullname</th>
            <th>Username</th>
            <th>Email</th>
            <th>Account</th>
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
                setIsVerify(data.email !== undefined);
                setStudentIDInput(data.id);
                handleShow();
              }}
            >
              <td>{index + 1}</td>
              <td>{data.id}</td>
              <td>{data.fullname}</td>
              <td>{data.username}</td>
              <td>{data.email}</td>
              <td
                className={`${styles["spec-col"]}`}
                // onClick={() => handleChangeActive(data._id.toString())}
              >
                {data.email !== undefined ? (
                  <div className={`${styles["active-button"]}`}>Verified</div>
                ) : (
                  <div className={`${styles["inactive-button"]}`}>
                    Unverified{" "}
                  </div>
                )}
              </td>
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
              <div className="d-flex w-100 mt-4 justify-content-end">
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
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          className={styles["modal-container"]}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showAdd}
          onHide={handleCloseAdd}
        >
          <Modal.Header closeButton>
            <h4 className={styles["modal-heading"]}>Add student</h4>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitAddStudentID} className="form-container">
              <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  required
                  onChange={(event) => {
                    setAddStudentIDInput(event.target.value);
                  }}
                  value={addStudentIDInput}
                  className="form-control-container"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Fullname</Form.Label>
                <Form.Control
                  required
                  onChange={(event) => {
                    setAddFullnameInput(event.target.value);
                  }}
                  value={addFullnameInput}
                  className="form-control-container"
                />
              </Form.Group>
              <div className="d-flex w-100 mt-4 justify-content-end">
                <Button
                  variant="secondary"
                  className={`${styles["close-button"]}`}
                  onClick={handleCloseAdd}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className={`${styles["save-button"]}`}
                  onClick={submitAddStudentID}
                >
                  Add
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Table>
    </div>
  );
};
export default AdminPageContent;
