import styles from './login.module.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../../../store/auth-context'
import { useLocation } from "react-router-dom";


function Login() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)

  const [message, setMessage] = useState({
    type: "success",
    content: ""
  });

  const [role, setRole] = useState('student')

  const navigate = useNavigate();

  const submitRole = (event) => {
    event.preventDefault()
    setStep(2)
  }

  const submitHandler = (event) => {
    event.preventDefault()

    if (!isLoading) {
      setIsLoading(true)

      const data = {
        role,
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
          authCtx.login(res.data.token, expirationTime.toISOString(), res.data.data.user.role);
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

  const onRoleOption = (event) => {
    setRole(event.target.value)
  }

  // get information when login with social
  const location = useLocation();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    const expiresTime = new URLSearchParams(location.search).get("expiresTime");
    const userData = new URLSearchParams(location.search).get("userData");
    if (token) {
      const expirationTime = new Date(new Date().getTime() + +expiresTime);
      authCtx.login(token, expirationTime.toISOString(), JSON.parse(userData).role);
      navigate('/', { replace: true })
    }
  }, [location.search]);

  return (
    <div className={`${styles.login} d-flex justify-content-center align-items-center`}>
      {step === 1 ? <Form onSubmit={submitRole} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
        <h2 className={`${styles['form-title']} display-7 `}>Login</h2>
        <p className={`${styles['form-text']}`}>Enter your credentials to access your account</p>

        <Form.Label className={`mb-2 mt-5`}>Choose your role</Form.Label>
        <select class="form-select" aria-label="Choose your role" onChange={onRoleOption}>
          <option value="student">Student</option>
          <option value='teacher'>Teacher</option>
        </select>

        <Button className={`${styles['submit-button']} p-2 d-flex gap-1 align-items-center justify-content-center mt-5 w-100`} type="submit">
          Continue
          {isLoading && <Spinner size="sm" animation="border" />}
        </Button>

      </Form>
        :
        <Form onSubmit={submitHandler} className={`${styles['form-size']} shadow rouded p-5 bg-white rounded-3`}>
          <h2 className={`${styles['form-title']} display-7 `}>Login</h2>
          <p className={`${styles['form-text']}`}>Enter your credentials to access your account</p>

          <Form.Group className={`mb-3 mt-5`} controlId="formBasicEmail" onFocus={handleFocus}>
            <Form.Label>Email address</Form.Label>
            <Form.Control ref={emailInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className={`mb-0 mt-4`} controlId="formBasicPassword" onFocus={handleFocus}>
            <Form.Label>Password</Form.Label>
            <div className={` d-flex justify-content-end align-item-center ${styles.password}`}>
              <Form.Control ref={passwordInputRef} required className={`form-control ${message.type === 'error' && 'is-invalid'}`} type={showPassword ? "text" : "password"} placeholder="Password" />
              {!showPassword ?
                <svg className={styles['show-icon']} xmlns="http://www.w3.org/2000/svg" onClick={() => setShowPassword(!showPassword)} fill='#495057' height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                : <svg className={styles['hide-icon']} xmlns="http://www.w3.org/2000/svg" onClick={() => setShowPassword(!showPassword)} fill='#495057' height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
              }
            </div>
          </Form.Group>

          {message.type === 'error' ? <p className={`${styles['error-message']} mb-0 mt-2`}>{message.content}</p> : <p className={`${styles['error-message']} mb-0 mt-2`}>&nbsp;</p>}

          <div className={` d-flex justify-content-end align-item-center mt-3`}>
            <Link className={styles['forget-password']} to='/forget-password'>Forget password ?</Link>
          </div>

          <Button className={`${styles['submit-button']} p-2 d-flex gap-1 align-items-center justify-content-center mt-3 w-100`} type="submit">
            Login
            {isLoading && <Spinner size="sm" animation="border" />}
          </Button>

          <div className={`d-flex justify-content-center mt-3 mb-0`}>
            <p>Orther</p>
          </div>

          <a href={`${process.env.REACT_APP_API_HOST}auth/google?role=${role}`} type="button" className={`${styles['social-button']} btn d-flex gap-2 justify-content-center align-items-center btn-light w-100 p-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Login with Google
          </a>

          <a href={`${process.env.REACT_APP_API_HOST}auth/facebook?role=${role}`} type="button" className={`${styles['social-button']} btn mt-2 d-flex p-2 gap-2 justify-content-center align-items-center btn-light w-100`}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
              <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
            </svg>
            Login with Facebook
          </a>


          <div className={`d-flex gap-1 mt-4 mb-0 justify-content-center`}>
            <p className={`display-10`}>Don't have an account?</p>
            <Link className={styles['forget-password']} to='/register'>Sign up</Link>
          </div>
          <div onClick={() => { setStep(1) }} className={`${styles['back-button']} mt-0 rounded-2 p-1 d-flex gap-1 align-items-center justify-content-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5D5FEF" viewBox="0 0 448 512">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            Back to role selection
          </div>
        </Form>}
    </div>
  );
}

export default Login;
