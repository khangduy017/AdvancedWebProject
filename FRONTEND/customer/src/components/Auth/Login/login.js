import styles from './login.module.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import { useState, useRef, useContext } from 'react';
import axios from 'axios'
import { Link,useNavigate } from "react-router-dom";
import AuthContext from '../../../store/auth-context'

function Login() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "success",
    content: ""
  });

  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault()

    if (!isLoading) {
      setIsLoading(true)

      const data = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value
      };

      // console.log(data)

      axios.post(process.env.REACT_APP_API_HOST + "auth/login", data)
        .then(res => {
          setIsLoading(false)
          const expirationTime = new Date(
            new Date().getTime() + +res.data.expiresTime
          );
          authCtx.login(res.data.token, expirationTime.toISOString());
          navigate('/',{replace:true})
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

  const handleFocus = () => {
    setMessage({
      type: "success",
      content: ""
    });
  }

  return (
    <div className={`${styles.login} d-flex justify-content-center align-items-center`}>
      <Form onSubmit={submitHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
        <h2 className={`${styles['form-title']} display-7 `}>Login</h2>
        <p className={`${styles['form-text']}`}>Enter your credentials to access your account</p>

        <Form.Group className={`mb-3 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
          <Form.Label>Email address</Form.Label>
          <Form.Control ref={emailInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className={`mb-2 mt-4`} controlId="formBasicPassword" onFocus={handleFocus}>
          <Form.Label>Password</Form.Label>
          <Form.Control ref={passwordInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type="password" placeholder="Password" />
        </Form.Group>
        {message.type === 'error' ? <p className={`${styles['error-message']}`}>{message.content}</p>:<p className={`${styles['error-message']}`}>&nbsp;</p>}


        <Button className={`${styles['submit-button']} d-flex gap-1 align-items-center justify-content-center mt-4 w-100 shadow-sm`} type="submit">
          Login
          {isLoading && <Spinner size="sm" animation="border" />}
        </Button>

        <button type="button" className={`btn mt-3 d-flex gap-1 justify-content-center align-items-center shadow-sm btn-light w-100`}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Login with Google
        </button>

        <div className={`d-flex gap-1 align-item-center mt-5`}>
          <p className={`display-10`}>Don't have an account?</p>
          <Link to='/register'>Sign up</Link>
        </div>

      </Form>
    </div>
  );
}

export default Login;
