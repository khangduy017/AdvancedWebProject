import styles from './register.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'
import { useState, useRef, useContext } from 'react';
import axios from 'axios'
import AuthContext from '../../../store/auth-context'



function Register() {

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const verifyCodeRef = useRef()

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1)

  const navigate = useNavigate();

  const [emailMessage, setEmailMessage] = useState({
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

  const [data, setData] = useState();

  const submitHandler = (event) => {
    event.preventDefault()
    if (!isLoading) {

      setIsLoading(true)

      const data = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        passwordConfirm: passwordConfirmInputRef.current.value
      };

      axios.post(process.env.REACT_APP_API_HOST + "auth/register", data)
        .then(res => {
          setIsLoading(false)
          setData(data);
          // console.log(res)
          // const expirationTime = new Date(
          //   new Date().getTime() + +res.data.expiresTime
          // );
          // authCtx.login(res.data.token, expirationTime.toISOString());
          // alert('Register successfully!')
          // navigate('/', { replace: true })
          setStep(2)
        })
        .catch(err => {
          setIsLoading(false)
          const message = err.response.data.message
          if (message === 'Invalid email address' || message === 'The email already exist') {
            setEmailMessage({
              type: "error",
              content: message
            })
          } else if (message === 'Your password is too weak (minimum 8 characters)') {
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
    setEmailMessage({
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

  const submitVerifyCodeHandler = (event) => {
    event.preventDefault()
    if (!isLoading) {
      setIsLoading(true)
      // console.log(data)

      axios.post(process.env.REACT_APP_API_HOST + "auth/verify", { code: verifyCodeRef.current.value, data: data })
        .then(res => {
          setIsLoading(false)
          // console.log(res)
          const expirationTime = new Date(
            new Date().getTime() + +res.data.expiresTime
          );
          authCtx.login(res.data.token, expirationTime.toISOString());
          alert('Register successfully!')
          navigate('/', { replace: true })
        })
        .catch(err => {
          setIsLoading(false)
          const message = err.response.data.message
          setEmailMessage({ type: 'error', content: message })
        })
    }
  }

  return (
    <div className={`${styles.register} d-flex justify-content-center align-items-center`}>
      {step === 1 ? <Form onSubmit={submitHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
        <h2 className={`${styles['form-title']}  display-7`}>Sign Up</h2>
        <p className={`${styles['form-text']}`}>Please provide your details to create a new account</p>
        <Form.Group className={`mb-1 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
          <Form.Label>Email address</Form.Label>
          <Form.Control className={`form-control ${emailMessage.type === 'error' && 'is-invalid'}`} ref={emailInputRef} required type="email" placeholder="Enter email..." />
        </Form.Group>
        {emailMessage.type === 'error' ? <p className={`${styles['error-message']} mb-1`}>{emailMessage.content}</p> : <p className={`${styles['error-message']} mb-1`}>&nbsp;</p>}

        <Form.Group className={`mb-1`} controlId="formBasicPassword" onFocus={handleFocus}>
          <Form.Label>Password</Form.Label>
          <Form.Control className={`form-control ${passwordMessage.type === 'error' && 'is-invalid'}`} ref={passwordInputRef} required type="password" placeholder="Password..." />
        </Form.Group>
        {passwordMessage.type === 'error' ? <p className={`${styles['error-message']} mb-1`}>{passwordMessage.content}</p> : <p className={`${styles['error-message']} mb-1`}>&nbsp;</p>}

        <Form.Group className={`mb-1`} controlId="formBasicPassword" onFocus={handleFocus}>
          <Form.Label>Password Confirm</Form.Label>
          <Form.Control className={`form-control ${passwordConfirmMessage.type === 'error' && 'is-invalid'}`} ref={passwordConfirmInputRef} required type="password" placeholder="Confirm your password..." />
        </Form.Group>
        {passwordConfirmMessage.type === 'error' ? <p className={`${styles['error-message']}`}>{passwordConfirmMessage.content}</p> : <p className={`${styles['error-message']}`}>&nbsp;</p>}

        <Button className={`${styles['submit-button']} d-flex gap-1 align-items-center justify-content-center mt-4 w-100 shadow-sm`} type="submit">
          Sign up
          {isLoading && <Spinner size="sm" animation="border" />}
        </Button>
        <div className={`d-flex align-item-center gap-1 mt-5`}>
          <p className={`display-10`}>Already have an account?</p>
          <Link className={styles['login']} to={'/login'}>Login</Link>
        </div>
      </Form>
        :
        <Form onSubmit={submitVerifyCodeHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
          <h2 className={`${styles['form-title']}  display-7`}>Sign Up</h2>
          <div className={`d-flex align-items-center gap-1 mt-3 mb-0`}>
            <p className={`${styles['form-text']} mb-0`}>We emailed you the code to</p>
            <p className={`${styles.email} display-10 mb-0`}>{data.email}</p>
          </div>
          <p className={`${styles['form-text']} mt-0`}>Enter the code below to confirm your email address</p>
          <Form.Group className={`mb-0 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
            <Form.Label>Verify Code:</Form.Label>
            <div div className={`d-flex align-items-center justify-content-center`}>
              <Form.Control autoFocus maxLength={6} className={`form-control w-50 ${styles['input-verify']}`} ref={verifyCodeRef} required type="text" />
            </div>
          </Form.Group>
          <div className={`d-flex justify-content-center mt-1`}>
            {emailMessage.type === 'error' ? <p className={`${styles['error-message']} mb-1`}>{emailMessage.content}</p> : <p className={`${styles['error-message']} mb-1`}>&nbsp;</p>}
          </div>

          <Button className={`${styles['submit-button']} d-flex gap-1 align-items-center justify-content-center mt-4 w-100 shadow-sm`} type="submit">
            Confirm
            {isLoading && <Spinner size="sm" animation="border" />}
          </Button>

          <div className={`d-flex align-items-center justify-content-center gap-1 mt-2 mb-3`}>
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
  );
}

export default Register;
