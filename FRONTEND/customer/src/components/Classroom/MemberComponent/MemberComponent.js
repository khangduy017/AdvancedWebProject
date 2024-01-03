import styles from './MemberComponent.module.css'
import member_image from '../../../assests/img/member_avatar.png'
import React, { useEffect, useState, useContext } from 'react'
import AuthContext from "../../../store/auth-context";
import axios from 'axios'
import { Outlet, useLocation, useParams, NavLink } from "react-router-dom";


export default function MemberComponent() {
  const { id } = useParams();


  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    axios.post(process.env.REACT_APP_API_HOST + 'classes/get-members', { id: id }, { headers })
      .then((res) => {
        if (res.data.status === "success") {
          setTeachers(res.data.teachers)
          setStudents(res.data.students)
        }
        else { }
      });
  }, [])

  return (
    <div className={`${styles['member-component-container']}`}>
      {!teachers.length > 0 ?
        <div>
          <div style={{ marginTop: '10rem' }} className="d-flex justify-content-center">
            <div style={{ width: '3rem', height: '3rem', color: '#5D5FEF' }} className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        : <>
          <h3 className={`${styles['teacher-title']} mt-5 mb-3`}>Teachers</h3>
          {teachers.map((value, index) =>
            <div className={`${styles['member-item']} d-flex align-items-center gap-4`}>
              <img src={member_image} alt='' />
              <small className={`m-0 p-0`}>{value.username ? value.username : value.email}</small>
            </div>
          )}
          <div className={` mt-5 mb-3 d-flex align-items-end justify-content-between`}>
            <h3 className={`${styles['teacher-title']} m-0`}>Students</h3>
            <small style={{ color: '#2C2C66' }}>{students.length} members</small>
          </div>
          {students.map((value, index) =>
            <div className={`${styles['member-item']} d-flex align-items-center gap-4`}>
              <img src={member_image} alt='' />
              <small className={`m-0 p-0`}>{value.username ? value.username : value.email}</small>
            </div>
          )}
        </>}
    </div>
  )
}
