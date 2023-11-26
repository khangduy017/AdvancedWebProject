import styles from "./HomePageContent.module.css";
import { useState } from "react";
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

const HomePageContent = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


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

  return (
    <div className={`${styles["total-container"]} w-75`}>
      <div
        className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}
      >
        <div className="d-flex">
          <Button
            onClick={handleShow}
            className={`${styles["find-classroom"]}`}
            type="submit"
          >
            Join classroom
          </Button>
          <Modal
            className={styles["modal-container"]}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={handleClose}
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
                      setIdInput(event.target.value);
                    }}
                    value={idInput}
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
                onClick={handleClose}
              >
                Join
              </Button>
            </Modal.Footer>
          </Modal>

          {/* <Button
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
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setIdInput(event.target.value);
                    }}
                    value={idInput}
                    className="form-control-container"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setIdInput(event.target.value);
                    }}
                    value={idInput}
                    className="form-control-container"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Topic</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setIdInput(event.target.value);
                    }}
                    value={idInput}
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
                onClick={handleClose}
              >
                Create
              </Button>
            </Modal.Footer>
          </Modal> */}
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
        {classData.map((data, index) => (
          <div
            onClick={() => {
              navigate("/myclass/1");
            }}
            className={`${styles["class-content-container"]} mt-4 rounded-3`}
            key={index}
          >
            <div
              className={`${styles["class-title-container"]} ${
                styles[colorForClass[index]]
              } rounded-top-3`}
            >
              <h2 className={`${styles["class-title"]} px-3 pt-3`}>
                2310-CLC-AWP-20KTPM2
              </h2>
              <div className={`${styles["class-instructor"]} px-3 pt-0`}>
                Advanced Web Programming
              </div>
              <div className={`${styles["class-instructor"]} px-3 pt-2 pb-3`}>
                Gia Huy
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
