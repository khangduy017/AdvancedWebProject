import styles from "./JoinClass.module.css";
import { Button } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import AuthContext from "../../../store/auth-context";
import { useState, useContext, useEffect } from "react";

const JoinClass = () => {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const navigate = useNavigate()

  const headers = { Authorization: `Bearer ${token}` };
  const [loading, setLoading] = useState(true)
  const { id } = useParams();

  const [classInfor, setClassInfo] = useState({})

  useEffect(() => {
    const data = {
      id,
      user_id: localStorage.getItem('_id')
    }

    axios.post(process.env.REACT_APP_API_HOST + 'classes/get-class-by-id', data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setClassInfo(res.data.value)
          setLoading(false)
          if (res.data.already_in_class) navigate(`/myclass/${res.data.value._id}/`, { replace: true })
        }
        else {
        }
      });
  }, [])

  const handleGetAllClasses = () => {
    const data = {
      _id: localStorage.getItem("_id"),
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "classes", data, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setClasses(res.data.value);
        } else {
        }
        setLoading(false);
      })
      .catch((err) => { });
  };

  const joinClass = () => {
    const dataSubmit = {
      classId: id,
      userId: localStorage.getItem('_id')
    }

    axios.post(process.env.REACT_APP_API_HOST + 'classes/join-class', dataSubmit, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          navigate(`/myclass/${res.data.value}/`)
          handleGetAllClasses()
        }
        else { }
      });
  }

  return (
    <div className={`${styles["JoinClass"]}`}>
      {loading ?
        <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
          <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div> :
        <>
          <div
            style={{ backgroundColor: `${classInfor.background}` }}
            className={`${styles["banner-container"]} rounded-4 w-100`}
          >
            <h2 className={`${styles["classroom-name"]}`}>{classInfor.title}</h2>
            <p className={`${styles["classroom-note"]}`}>{classInfor.content}</p>
            <p className={`${styles["classroom-owner"]}`}>{classInfor.owner}</p>

          </div>
          <div className="mt-4">
            <p>Do you want to join the class?</p>
            <div className="d-flex align-items-center justify-content-center">
              <Button
                variant="secondary"
                className={`${styles["close-button"]}`}
                onClick={() => { navigate('/') }}
              >
                Cancel
              </Button>
              <Button
                className={`${styles["save-button"]}`}
                onClick={joinClass}
              >
                Join
              </Button>
            </div>
          </div>
        </>}
    </div>
  );
};

export default JoinClass;