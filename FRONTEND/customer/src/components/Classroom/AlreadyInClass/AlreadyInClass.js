import styles from "./AlreadyInClass.module.css";
import { Button } from "react-bootstrap";
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import AuthContext from "../../../store/auth-context";
import { useState, useContext, useEffect } from "react";

const AlreadyInClass = () => {


  const { id } = useParams();

  return (
    <div className={`${styles["AlreadyInClass"]}`}>
    Already in class
      <Button
        onClick={()=>{}}
        className={`${styles["find-classroom"]}`}
        type="submit"
      >
        Ok
      </Button>
    </div>
  );
};

export default AlreadyInClass;
