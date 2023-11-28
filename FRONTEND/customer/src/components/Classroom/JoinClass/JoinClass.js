import styles from "./JoinClass.module.css";
import { Button } from "react-bootstrap";
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import AuthContext from "../../../store/auth-context";
import { useState, useContext, useEffect } from "react";

const JoinClass = () => {

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const navigate = useNavigate()

  const headers = { Authorization: `Bearer ${token}` };

  const { id } = useParams();
  const joinClass = () => {
    const dataSubmit = {
      classId: id,
      userId: localStorage.getItem('_id')
    }

    axios.post(process.env.REACT_APP_API_HOST + 'classes/join-class', dataSubmit, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          navigate(`/myclass/${res.data.value}`)
        }
        else { }
      });
  }

  useEffect(()=>{
    const dataSubmit = {
      classId: id,
      userId: localStorage.getItem('_id')
    }


    axios.post(process.env.REACT_APP_API_HOST + 'classes/already-in-class', dataSubmit, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          if(res.data.value){
            navigate(`/myclass/${res.data.value}/already`)
          }
        }
        else { }
      });
  },[])

  return (
    <div className={`${styles["JoinClass"]}`}>
      <Button
        onClick={joinClass}
        className={`${styles["find-classroom"]}`}
        type="submit"
      >
        Join classroom
      </Button>
    </div>
  );
};

export default JoinClass;
