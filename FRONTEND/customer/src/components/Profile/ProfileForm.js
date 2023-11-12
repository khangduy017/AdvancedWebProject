import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import toast from "react-hot-toast";

const ProfileForm = () => {
  const nagivate = useNavigate();

  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);


  const styleSuccess = {
    style: {
      border: "2px solid #28a745",
      padding: "10px",
      color: "#28a745",
      fontWeight: "500",
    },
    duration: 4000,
  };

  const styleError = {
    style: {
      border: "2px solid red",
      padding: "10px",
      color: "red",
      fontWeight: "500",
    },
    duration: 4000,
  };


  const submitHandler = (event) => {
    event.preventDefault();

    toast.success("Tạo tài khoản thành công", styleSuccess);
    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBZhsabDexE9BhcJbGxnZ4DiRlrCN9xe24', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // assumption: Always succeeds!

      nagivate('/');
    });
  };

  return (
    <div onClick={()=>{ toast.success("Tạo tài khoản thành công", styleSuccess);}}>profile</div>
  );
};

export default ProfileForm;
