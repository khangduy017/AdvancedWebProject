import styles from './forgetPassword.module.css'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import { useState, useRef } from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const verifyCodeRef = useRef()

  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const navigate = useNavigate();

  const [message, setMessage] = useState({
    type: "success",
    content: ""
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "success",
    content: ""
  });

  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState({
    type: "success",
    content: ""
  });

  const [step, setStep] = useState(1);
  const [showPassword,setShowPassword] = useState(false)
  const [showPasswordConfirm,setShowPasswordConfirm] = useState(false)

  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('')

  const submitEmailHandler = (event) => {
    event.preventDefault()
    if (!isLoading) {
      setIsLoading(true)

      const data = {
        step,
        email: emailInputRef.current.value
      };

      axios.post(process.env.REACT_APP_API_HOST + "auth/forget-password", data)
        .then(res => {
          setIsLoading(false)
          setStep(2)
          setEmail(data.email)
        })
        .catch(err => {
          setIsLoading(false)
          setMessage({
            type: "error",
            content: err.response.data.message
          })
        })
    }
  }



  const submitVerifyCodeHandler = (event) => {
    event.preventDefault()
    const data = {
      step,
      code: verifyCodeRef.current.value
    };
    if (!isLoading && !isResendLoading) {
      setIsLoading(true)

      axios.post(process.env.REACT_APP_API_HOST + "auth/forget-password", data)
        .then(res => {
          setIsLoading(false)
          setStep(3)
          setVerifyCode(res.data.code)
        })
        .catch(err => {
          setIsLoading(false)
          setMessage({
            type: "error",
            content: err.response.data.message
          })
          // const message = err.response.data.message
          // console.log(message)
        })
    }
  }

  const submitPasswordHandler = (event) => {
    event.preventDefault()
    if (!isLoading) {
      setIsLoading(true)

      const data = {
        code: verifyCode,
        email,
        password: passwordInputRef.current.value,
        passwordConfirm: passwordConfirmInputRef.current.value,
      }
      // console.log(data)

      axios.post(process.env.REACT_APP_API_HOST + "auth/forget-password", data)
        .then(res => {
          setIsLoading(false)
          alert('Reset password successfully!')
          navigate('/login')
        })
        .catch(err => {
          setIsLoading(false)
          const message = err.response.data.message
          if (message === 'Your password is too weak (minimum 8 characters)') {
            setPasswordMessage({
              type: 'error',
              content: message
            })
          } else if (message === 'Your passwords do not match') {
            setPasswordConfirmMessage({
              type: 'error',
              content: message
            })
          }
        })
    }
  }

  const handleFocus = () => {
    setMessage({
      type: "success",
      content: ""
    });
    setPasswordMessage({
      type: "success",
      content: ""
    });
    setPasswordConfirmMessage({
      type: "success",
      content: ""
    });
  }

  const handleResend = () => {
    if (!isResendLoading) {
      setIsResendLoading(true)

      const data = {
        step: 1,
        email: email
      };

      axios.post(process.env.REACT_APP_API_HOST + "auth/forget-password", data)
        .then(res => {
          setIsResendLoading(false)
          setStep(2)
        })
        .catch(err => {
          setIsResendLoading(false)
          console.log(err)
        })
    }
  }

  return <div className={`${styles.forget} d-flex justify-content-center align-items-center`}>
    {/* step 1 */}
    {step === 1 && <Form onSubmit={submitEmailHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
      <h2 className={`${styles['form-title']} display-7 `}>Forget password</h2>
      <p className={`${styles['form-text']}`}>No worries, we will send you reset instructions</p>

      <Form.Group className={`mb-1 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
        <Form.Label>Email address</Form.Label>
        <Form.Control ref={emailInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type="email" placeholder="Enter email" />
      </Form.Group>
      {message.type === 'error' ? <p className={`${styles['error-message']} mb-0`}>{message.content}</p> : <p className={`${styles['error-message']} mb-1`}>&nbsp;</p>}


      <Button className={`${styles['submit-button']} p-2 d-flex gap-1 align-items-center justify-content-center mt-4 w-100 shadow-sm`} type="submit">
        Confirm
        {isLoading && <Spinner size="sm" animation="border" />}
      </Button>

      <div onClick={() => { navigate('/login') }} className={`${styles['back-button']} mt-3 rounded-2 p-1 d-flex gap-1 align-items-center justify-content-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5D5FEF" viewBox="0 0 448 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        Back
      </div>
    </Form>}
    {/* step 2 */}
    {step === 2 && <Form onSubmit={submitVerifyCodeHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
      <h2 className={`${styles['form-title']}  display-7`}>Forget password</h2>
      <div className={`d-flex align-items-center gap-1 mt-3 mb-0`}>
        <p className={`${styles['form-text']} mb-0`}>We emailed you the code to</p>
        <p className={`${styles.email} display-10 mb-0`}>{email}</p>
      </div>
      <p className={`${styles['form-text']} mt-0`}>Enter the code below to reset password</p>
      <Form.Group className={`mb-0 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
        <Form.Label>Verify Code:</Form.Label>
        <div div className={`d-flex align-items-center justify-content-center`}>
          <Form.Control autoFocus maxLength={6} className={`form-control w-50 ${styles['input-verify']}`} ref={verifyCodeRef} required type="text" />
        </div>
      </Form.Group>
      <div className={`d-flex justify-content-center mt-1`}>
        {message.type === 'error' ? <p className={`${styles['error-message']} mb-1`}>{message.content}</p> : <p className={`${styles['error-message']} mb-1`}>&nbsp;</p>}
      </div>

      <Button className={`${styles['submit-button']} d-flex gap-1 align-items-center justify-content-center mt-3 w-100 shadow-sm`} type="submit">
        Confirm
        {isLoading && <Spinner size="sm" animation="border" />}
      </Button>
      <div className={`d-flex align-items-center justify-content-center gap-1 mt-3 mb-3`}>
        <p className={`display-10 mb-0`}>Didn't receive the code?</p>
        {isResendLoading ? <Spinner size="sm" animation="border" color="#5D5FEF" /> : <p onClick={handleResend} className={`${styles.resend} display-10 mb-0`}>Resend</p>}
      </div>
      <div onClick={() => { setStep(1) }} className={`${styles['back-button']} rounded-2 p-1 d-flex gap-1 align-items-center justify-content-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5D5FEF" viewBox="0 0 448 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        Back
      </div>
    </Form>}
    {/* step 3 */}
    {step === 3 && <Form onSubmit={submitPasswordHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
      <h2 className={`${styles['form-title']} display-7 `}>Forget password</h2>
      <p className={`${styles['form-text']}`}>Enter your new password to reset password</p>

      <Form.Group className={`mb-0 mt-5`} controlId="formBasicPassword" onFocus={handleFocus}>
        <Form.Label>Password</Form.Label>
        <div className={` d-flex justify-content-end align-item-center ${styles.password}`}>
        <Form.Control autoFocus ref={passwordInputRef} required className={`form-control ${passwordMessage.type === 'error' && 'is-invalid'}`} type={showPassword ? "text" : "password"} placeholder="Enter password" />
              {!showPassword ?
                <svg className={styles['show-password-icon']} xmlns="http://www.w3.org/2000/svg" onClick={()=>setShowPassword(!showPassword)} fill='#495057' height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                :<svg className={styles['hide-password-icon']} xmlns="http://www.w3.org/2000/svg" onClick={()=>setShowPassword(!showPassword)} fill='#495057' height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
              }
            </div>
      </Form.Group>
      {passwordMessage.type === 'error' ? <p className={`${styles['error-message']}`}>{passwordMessage.content}</p> : <p className={`${styles['error-message']}`}>&nbsp;</p>}

      <Form.Group className={`mb-0 mt-0`} controlId="formBasicPassword" onFocus={handleFocus}>
        <Form.Label>Password confirm</Form.Label>
        <div className={` d-flex justify-content-end align-item-center ${styles['password-confirm']}`}>
        <Form.Control ref={passwordConfirmInputRef} required className={`form-control ${passwordConfirmMessage.type === 'error' && 'is-invalid'}`} type={showPasswordConfirm ? "text" : "password"} placeholder="Enter password confirm" />
              {!showPasswordConfirm ?
                <svg className={styles['show-password-confirm-icon']} xmlns="http://www.w3.org/2000/svg" onClick={()=>setShowPasswordConfirm(!showPasswordConfirm)} fill='#495057' height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                :<svg className={styles['hide-password-confirm-icon']} xmlns="http://www.w3.org/2000/svg" onClick={()=>setShowPasswordConfirm(!showPasswordConfirm)} fill='#495057' height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
              }
            </div>
      </Form.Group>
      {passwordConfirmMessage.type === 'error' ? <p className={`${styles['error-message']}`}>{passwordConfirmMessage.content}</p> : <p className={`${styles['error-message']}`}>&nbsp;</p>}


      <Button className={`${styles['submit-button']} mb-3 p-2 d-flex gap-1 align-items-center justify-content-center mt-4 w-100 shadow-sm`} type="submit">
        Reset password
        {isLoading && <Spinner size="sm" animation="border" />}
      </Button>

      <div onClick={() => { setStep(2) }} className={`${styles['back-button']} rounded-2 p-1 d-flex gap-1 align-items-center justify-content-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5D5FEF" viewBox="0 0 448 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        Back
      </div>

    </Form>}
  </div>
}