import { useContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import "./MainNavigation.css";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import User from "../../assests/img/user.jpg";
import { ReactComponent as LogoutIcon } from "../../assests/svg/logout.svg";

import axios from "axios";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const [active, setActive] = useState("myclass");

  const navigate = useNavigate();
  const isLoggedIn = authCtx.isLoggedIn;

  const userData = authCtx.userData;

  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    if (authCtx.isLoggedIn) {
      const headers = { Authorization: `Bearer ${token}` };
      axios
        .get(process.env.REACT_APP_API_HOST + "auth/get-user", { headers })
        .then((res) => authCtx.setUserDataContext(res.data.data));
    } else {
      navigate("/login");
    }
  }, [authCtx.isLoggedIn]);

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/login");
  };

  return (
    <Navbar
      className="justify-content-between nav-container"
      data-bs-theme="dark"
    >
      <Container className="sub-nav-container p-0 m-0">
        <Navbar.Brand href="/" className="nav-brand-container">
          AWClassroom
        </Navbar.Brand>
        {/* <Nav
          className="me-auto"
          activeKey={active}
          onSelect={(selectedKey) => setActive(selectedKey)}
        >
          <Nav.Link href="/" eventKey="myclass">
            My class
          </Nav.Link>
          <Nav.Link href="/" eventKey="todo">
            To do
          </Nav.Link>
          <Nav.Link href="/" eventKey="schedule">
            Schedule
          </Nav.Link>
        </Nav> */}
      </Container>

      <div className="d-flex align-items-center">
        <div
          onClick={() => {
            navigate("./profile");
          }}
          className="d-flex justify-content-end info-ava"
        >
          <div className="info-container">
            <div className="role">Hello,</div>
            <div className="username">{userData.username}</div>
          </div>
          <img src={User} className="img-container" />
        </div>
        <LogoutIcon onClick={logoutHandler} className="icon" />
      </div>
    </Navbar>
  );
};

export default MainNavigation;
