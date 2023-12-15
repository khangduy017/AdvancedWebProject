import styles from "./GradeItem.module.css";
import { useEffect, useRef, useState, useContext } from "react";
import { Button } from "react-bootstrap";

import React from 'react'

export default function GradeItem(props) {


  const calTotal = () => {
    let total = 0
    for (let i of props.structure) {
      total += Number(props.value.grade[i.name]) * Number(i.scale) * 0.01
    }
    return Number(total.toFixed(2))
  }

  const [inputState, setInputState] = useState({})

  useEffect(() => {
    setInputState(props.value.grade)
  }, [props.edit])

  const handleEdit = (e, structure) => {
    setInputState({ ...inputState, [structure]: e.target.value })
    props.onChangeEdit({ ...props.value, grade: { ...inputState, [structure]: e.target.value } }, props.index)
  }

  const handleShowProfile=()=>{
    if(props.value._id.length>0){
      props.onShowProfile(props.value._id)
    }
  }

  return (
    <div
      key={props.value.studentId}
      className={
        `${styles['grade-item']} d-flex align-items-center card p-2 mt-2`
      }
    >
      <p className={`mb-0`}>{props.index + 1}</p>
      <p style={{ width: `18%` }} className={`mb-0 ml-0`}>
        <small onClick={handleShowProfile} style={{ textDecoration: `${props.value._id.length > 0 ? 'underline' : ''}`, cursor: `${props.value._id.length > 0 ? 'pointer' : ''}` }}>
          {props.value.studentId}
        </small>
      </p>
      <div style={{ width: '75%' }} className={`d-flex align-items-center`}>
        {props.structure.map((value, index) => (
          !props.edit ? <small style={{ width: `${75 / props.structure.length + 1}%` }} className={`mb-0 p-0`}>{props.value.grade[value.name]}</small> :
            <input type="text" onChange={(e) => { handleEdit(e, value.name) }} value={inputState[value.name]} style={{ width: `${75 / props.structure.length + 1}%`, padding: '0.1rem 0.2rem' }} className={`${styles['']} form-control rounded-1`} ></input>
        ))}
        <p style={{ width: `${75 / props.structure.length + 1}%`, fontWeight: 'bold' }} className={`p-0 mb-0`}>
          {calTotal()}
        </p>
      </div>
    </div>
  )
}
