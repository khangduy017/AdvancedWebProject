import styles from './forgetPassword.module.css'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import { useState, useRef, useContext } from 'react';
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const emailInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const verifyCodeRef = useRef()

  const [message, setMessage] = useState({
    type: "success",
    content: ""
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const submitHandler = (event) => {
    event.preventDefault()
  }

  const handleFocus = () => {

  }

  const submitVerifyCodeHandler = (event) => {
    event.preventDefault()
    if (!isLoading) {
      setIsLoading(true)
      // console.log(data)

      axios.post(process.env.REACT_APP_API_HOST + "auth/verify", {})
        .then(res => {
          setIsLoading(false)

        })
        .catch(err => {
          setIsLoading(false)
          const message = err.response.data.message
          console.log(message)
        })
    }
  }

  return <div className={`${styles.forget} d-flex justify-content-center align-items-center`}>
    {step === 0 && <Form onSubmit={submitHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
      <h2 className={`${styles['form-title']} display-7 `}>Forget password</h2>
      <p className={`${styles['form-text']}`}>No worries, we will send you reset instructions</p>

      <Form.Group className={`mb-3 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
        <Form.Label>Email address</Form.Label>
        <Form.Control ref={emailInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type="email" placeholder="Enter email" />
      </Form.Group>

      <Button className={`${styles['submit-button']} p-2 d-flex gap-1 align-items-center justify-content-center mt-5 w-100 shadow-sm`} type="submit">
        Reset password
        {isLoading && <Spinner size="sm" animation="border" />}
      </Button>

      <div onClick={() => { navigate('/login') }} className={`${styles['back-button']} mt-3 rounded-2 p-1 d-flex gap-1 align-items-center justify-content-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5D5FEF" viewBox="0 0 448 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        Back
      </div>
    </Form>}
    {step === 0 && <Form onSubmit={submitVerifyCodeHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
      <h2 className={`${styles['form-title']}  display-7`}>Forget password</h2>
      <div className={`d-flex align-items-center gap-1 mt-3 mb-0`}>
        <p className={`${styles['form-text']} mb-0`}>We emailed you the code to</p>
        <p className={`${styles.email} display-10 mb-0`}>{email}</p>
      </div>
      <p className={`${styles['form-text']} mt-0`}>Enter the code below to reset password</p>
      <Form.Group className={`mb-0 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
        <Form.Label>Verify Code:</Form.Label>
        <div div className={`d-flex align-items-center justify-content-center`}>
          <Form.Control autoFocus maxLength={6} className={`form-control w-50 ${styles['input-verify']} ${message.type === 'error' && 'is-invalid'}`} ref={verifyCodeRef} required type="text" />
        </div>
      </Form.Group>
      <div className={`d-flex justify-content-center mt-1`}>
        {message.type === 'error' ? <p className={`${styles['error-message']} mb-1`}>Your code is incorrect</p> : <p className={`${styles['error-message']} mb-1`}>&nbsp;</p>}
      </div>

      <Button className={`${styles['submit-button']} d-flex gap-1 align-items-center justify-content-center mt-4 w-100 shadow-sm`} type="submit">
        Confirm
        {isLoading && <Spinner size="sm" animation="border" />}
      </Button>
      <div className={`d-flex align-items-center justify-content-center gap-1 mt-3 mb-3`}>
        <p className={`display-10`}>Didn't receive the code?</p>
        <p className={`${styles.resend} display-10`}>Resend</p>
      </div>
      <div onClick={() => { setStep(1) }} className={`${styles['back-button']} rounded-2 p-1 d-flex gap-1 align-items-center justify-content-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5D5FEF" viewBox="0 0 448 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        Back
      </div>

    </Form>}
  </div>
}