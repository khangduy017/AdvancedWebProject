import ProfileForm from "./ProfileForm";
import User from "../../assests/img/user.jpg";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useRef, useContext, useState, useEffect } from "react";
import AuthContext from "../../store/auth-context";
import axios from 'axios';

import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [mode, setMode] = useState("General");
  const token = authCtx.token;
  const userData = authCtx.userData;
  
  useEffect(() => {
    if(!authCtx.isLoggedIn){
      navigate('/login');
    }
  }, []);

  return (
    <div className="user-profile-container">
      <div className="d-flex info-container-content">
        <div className="profile-option-container">
          <div className="ava-content-container">
            <img src={User} className="img-option" />
            <div className="content-option">
              <div className="username-option">{userData.username}</div>
              <div className="role-option">{userData.role}</div>
            </div>
          </div>
          <div className="line-content-container"></div>
          <Button
            onClick={() => {
              setMode('General')
            }}
            className="edit-profile-option"
            type="submit"
          >
            General
          </Button>
          <Button
            onClick={() => {
              setMode('EditProfile')
            }}
            className="edit-profile-option"
            type="submit"
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => {
              setMode('ChangePassword')
            }}
            className="edit-profile-option"
            type="submit"
          >
            Change Password
          </Button>
        </div>
        <ProfileForm mode={mode}/>
      </div>
    </div>
  );
};

export default UserProfile;
