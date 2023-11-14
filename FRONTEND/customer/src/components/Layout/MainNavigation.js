import { useContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import "./MainNavigation.css";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import User from "../../assests/img/user.jpg";
import { ReactComponent as LogoutIcon } from "../../assests/svg/logout.svg";

import axios from 'axios';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = authCtx.isLoggedIn;

  const userData = authCtx.userData;

  const token = authCtx.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  useEffect(() => {
    if(authCtx.isLoggedIn){
      const headers = { 'Authorization': `Bearer ${token}` };
      axios.get(process.env.REACT_APP_API_HOST + 'auth/get-user', { headers })
          .then(res => authCtx.setUserDataContext(res.data.data));
    }
  }, []);

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/");
  };

  return (
    <Navbar className="justify-content-between nav-container">
      <h4
        onClick={() => {
          navigate("/");
        }}
      >
        Authentication
      </h4>

      {!authCtx.isLoggedIn ? (
        <div className="d-flex">
          <Button
            onClick={() => {
              navigate("/register");
            }}
            className="register px-3"
            type="submit"
          >
            Register
          </Button>
          <Button
            onClick={() => {
              navigate("/login");
            }}
            className="login px-3"
            type="submit"
          >
            Login
          </Button>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <div onClick={()=>{navigate('./profile')}} className="d-flex info-ava">
            <div className="info-container">
              <div className="role">Hello,</div>
              <div className="username">{userData.username}</div>
            </div>
            <img src={User} className="img-container"/>
          </div>
          <LogoutIcon onClick={logoutHandler} className="icon"/> 
        </div>
      )}
    </Navbar>
  );
};

export default MainNavigation;
