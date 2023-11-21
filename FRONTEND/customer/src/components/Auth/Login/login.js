import styles from './login.module.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import { useState, useRef, useContext } from 'react';
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
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
          navigate('/', { replace: true })
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

        <Form.Group className={`mb-0 mt-4`} controlId="formBasicPassword" onFocus={handleFocus}>
          <Form.Label>Password</Form.Label>
          <Form.Control ref={passwordInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type="password" placeholder="Password" />
        </Form.Group>
        {message.type === 'error' ? <p className={`${styles['error-message']}`}>{message.content}</p> : <p className={`${styles['error-message']}`}>&nbsp;</p>}

        <div className={` d-flex justify-content-end align-item-center`}>
          <Link className={styles['forget-password']} to='/forget-password'>Forget password ?</Link>
        </div>

        <Button className={`${styles['submit-button']} p-2 d-flex gap-1 align-items-center justify-content-center mt-3 w-100 shadow-sm`} type="submit">
          Login
          {isLoading && <Spinner size="sm" animation="border" />}
        </Button>

        <div className={`d-flex justify-content-center mt-3 mb-0`}>
          <p>Orther</p>
        </div>

        <a href={`${process.env.REACT_APP_API_HOST}auth/google`} type="button" className={`${styles['social-button']} btn d-flex gap-2 justify-content-center align-items-center btn-light w-100 p-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Login with Google
        </a>

        <a href={`${process.env.REACT_APP_API_HOST}auth/facebook`} type="button" className={`${styles['social-button']} btn mt-3 d-flex p-2 gap-2 justify-content-center align-items-center btn-light w-100`}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
            <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
          </svg>
          Login with Facebook
        </a>


        <div className={`d-flex gap-1 mt-4 justify-content-center`}>
          <p className={`display-10`}>Don't have an account?</p>
          <Link className={styles['forget-password']} to='/register'>Sign up</Link>
        </div>

      </Form>
    </div>
  );
}

export default Login;
