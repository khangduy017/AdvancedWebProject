import styles from "./Classroom.module.css";
import { useEffect, useState, useContext } from "react";
import ClassroomBanner from "../../assests/img/class-banner.jpg";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { useParams } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import GradeComponent from "./GradeComponent/GradeComponent";

const Classroom = () => {

  const { id } = useParams();
  const linkInvite = `http://localhost:3001/myclass/${id}/join`


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [inviteEnable, setInviteEnable] = useState(true)
  const [currentTab, setCurrentTab] = useState(3)
  const [loading, setLoading] = useState(true)


  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [classData, setClassData] = useState()

  useEffect(() => {
    axios.post(process.env.REACT_APP_API_HOST + 'classes/' + id, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setClassData(res.data.value)
          setLoading(false)
        }
        else { }
      });
  }, [])


  const [emailInput, setEmailInput] = useState('')
  const handleSubmitInvite = () => {
    const dataSubmit = {
      email: emailInput,
      link: linkInvite,
    }

    axios.post(process.env.REACT_APP_API_HOST + 'classes/invite-email', dataSubmit, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          handleClose()
        }
        else { }
      });
  }

  useEffect(() => {
    if (emailInput.length > 0) setInviteEnable(false)
    else setInviteEnable(true)
  }, [emailInput])

  const handleSwitchTab = (tab) => {
    setCurrentTab(tab)
    if (tab === 1) {

    }
    else if (tab === 2) {

    } else {

    }
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(linkInvite);
    } catch (err) {
      console.error(
        "Unable to copy to clipboard.",
        err
      );
      alert("Copy to clipboard failed.");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(classData.inviteCode);
    } catch (err) {
      console.error(
        "Unable to copy to clipboard.",
        err
      );
      alert("Copy to clipboard failed.");
    }
  }

  return (
    <div className={`${styles["classroom-container"]}`}>
      <Modal
        className={styles["modal-container"]}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h4 className={styles["modal-heading"]}>Invite</h4>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: '.9rem' }} className={`mb-0`}>{linkInvite}</p>
          <Button
            onClick={handleCopyClick}
            className={`${styles["copy-email"]} mt-1 mb-4 d-flex gap-1 align-items-center justify-content-center`}
            type="submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="11" viewBox="0 0 448 512">
              <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" /></svg>

            Copy
          </Button>

          <Form className="form-container">
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setEmailInput(event.target.value);
                }}
                value={emailInput}
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
            onClick={handleSubmitInvite}
            disabled={inviteEnable}
          >
            Invite
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={`${styles['sub-nav']} d-flex align-items-center justify-content-between`}>
        <div className={`${styles['tab-layout']} d-flex gap-0`}>
          <Button onClick={() => handleSwitchTab(1)} className={`rounded-0 ${styles['tab-button']} ${currentTab === 1 && styles['tab-button-active']}`} variant="light">Posts</Button>
          <Button onClick={() => handleSwitchTab(2)} className={`rounded-0 ${styles['tab-button']} ${currentTab === 2 && styles['tab-button-active']}`} variant="light">Members</Button>
          <Button onClick={() => handleSwitchTab(3)} className={`rounded-0 ${styles['tab-button']} ${currentTab === 3 && styles['tab-button-active']}`} variant="light">Grade</Button>
        </div>
        <Button
          onClick={handleShow}
          className={`${styles["invite-email"]}`}
          type="submit"
        >Invite</Button>
      </div>

      {loading ? <div style={{ marginTop: '10rem' }} class="d-flex justify-content-center">
        <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
        :
        <div className={`${styles['content']}`}>
          <div
            style={{ backgroundColor: classData.background }}
            className={`${styles["banner-container"]} rounded-4 w-100`}>
            <h2 className={`${styles["classroom-name"]}`}>{classData.title}</h2>
            <p className={`${styles["classroom-note"]}`}>{classData.content}</p>
            <p className={`${styles["classroom-owner"]}`}>{classData.owner}</p>

            <div className={`${styles['classroom-code']} d-flex align-items-center gap-2`}>
              <h4 className={`${styles["text-cote"]}`}>#{classData.inviteCode}</h4>
              <svg onClick={handleCopyCode} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" height="26" width="18" viewBox="0 0 448 512">
                <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" /></svg>
            </div>

          </div>
          {currentTab === 1 && <div >
            POST....
          </div>}
          {currentTab === 2 && <div >
            MEMBERS
          </div>}
          {currentTab === 3 && <div className={`${styles['grade']}`}>
            <GradeComponent />
          </div>}
        </div>}

    </div>
  );
};

export default Classroom;
