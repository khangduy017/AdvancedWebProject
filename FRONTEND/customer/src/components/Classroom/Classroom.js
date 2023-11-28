import styles from "./Classroom.module.css";
import { useEffect, useState,useContext } from "react";
import ClassroomBanner from "../../assests/img/class-banner.jpg";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { useParams,useNavigate } from 'react-router-dom';

const Classroom = () => {

  const { id } = useParams();


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [inviteEnable, setInviteEnable] = useState(true)
  
  
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };



  const [emailInput, setEmailInput] = useState('')
  const handleSubmitInvite = () => {
    const dataSubmit = {
      email: emailInput,
      link: `http://localhost:3001/myclass/${id}/join`,
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

  return (
    <div className={`${styles["classroom-container"]}`}>
      <Button
        onClick={handleShow}
        className={`${styles["find-classroom"]}`}
        type="submit"
      >Invite</Button>

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

      <div className={`${styles["banner-container"]} w-100`}>
        <img
          className={`${styles["classroom-banner"]} w-100 h-100`}
          src={ClassroomBanner}
          alt=""
        />
        <h2 className={`${styles["classroom-name"]}`}>2310-CLC-AWP-20KTPM2</h2>
        <p className={`${styles["classroom-note"]}`}>
          Advanced Web Programming
        </p>
      </div>
    </div>
  );
};

export default Classroom;
