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

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

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

  const submitHandler = (event) => {
    event.preventDefault()
    if (!isLoading) {

      setIsLoading(true)

      const data = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        passwordConfirm: passwordConfirmInputRef.current.value
      };

      // console.log(data)

      axios.post(process.env.REACT_APP_API_HOST + "auth/register", data)
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

  return (
    <div className={`${styles.register} d-flex justify-content-center align-items-center`}>
      <Form onSubmit={submitHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
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
          <Link to={'/login'}>Login</Link>
        </div>

      </Form>
    </div>
  );
}

export default Register;
