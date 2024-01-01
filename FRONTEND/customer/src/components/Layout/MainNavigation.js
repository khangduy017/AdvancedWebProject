import { useContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SplitButton from "react-bootstrap/SplitButton";

import AuthContext from "../../store/auth-context";
import "./MainNavigation.css";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import member_image from '../../assests/img/member_avatar.png'
import User from "../../assests/img/user.jpg";
import { ReactComponent as LogoutIcon } from "../../assests/svg/logout.svg";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { duration } from "moment";

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
  }, []);

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/login");
  };

  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (isOpen) {
      const data = {
        _id: localStorage.getItem("_id"),
      };

      axios
        .post(process.env.REACT_APP_API_HOST + "notification/get-all", data, {
          headers,
        })
        .then((res) => {
          if (res.data.status === "success") {
            setNotifications(res.data.value);
          } else {
          }
        });
    }
  }, [isOpen]);

  const [newNotify, setNewNotify] = useState(false);

  // socket
  const socket = io(process.env.REACT_APP_ipAddress);
  useEffect(() => {
    socket.on("notification", (data) => {
      toast((t) => (
        <div className="notification-up w-100 p-0"
          onClick={() => {
            console.log(t)
            handleItemClick(data)
            toast.dismiss(t.id)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="22" width="20" viewBox="0 0 448 512">
            <path fill="#fcc419" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>
          <div className="w-100" style={{ marginLeft: '1rem' }}>
            <div style={{ color: '#2C2C66', fontSize: '1rem' }} className="d-flex justify-content-between mb-1">
              <small style={{ fontWeight: 'bold', width: '18rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{data.class}</small>
            </div>
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          cursor: "pointer",
          width: "25rem",
          border: "2px solid #fcc419",
          padding: "5px",
        }}
      );

      console.log('notification')
      setNotifications(prev => [data, ...prev])
      setNewNotify(true)
    });
    socket.emit("register", localStorage.getItem("_id"));
  }, []);

  const handleItemClick = (value) => {
    if (!value.seen) {
      socket.emit("seen", value._id);
    }
    setNewNotify(false);
    navigate(value.direction);
    setIsOpen(false);
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

      <div style={{}} className="d-flex align-items-center gap-3">
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
        <Dropdown drop="down" style={{ zIndex: "11" }} show={isOpen}>
          <Dropdown.Toggle
            onClick={() => setIsOpen(!isOpen)}
            style={{ backgroundColor: "#ffffff", padding: "0.3rem 0.5rem" }}
            className="dropdown-custom-1"
            id="dropdown-custom-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22"
              width="20"
              viewBox="0 0 448 512"
            >
              <path
                fill="#5d5fef"
                d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
              />
            </svg>
            {newNotify && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="11"
                width="11"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#F03E3E"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
                />
              </svg>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="drop-down-menu"
            style={{
              maxHeight: "28rem",
              overflowY: "scroll",
              padding: "0.5rem 0rem",
              width: "24rem",
              backgroundColor: "#ffffff",
              border: "1px solid #b8b8c2",
              zIndex: "100",
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((value, index) => (
                <div
                  style={{
                    backgroundColor: `${!value.seen ? "#f6f6ff" : "#ffffff"}`,
                  }}
                  className="notification-item w-100"
                  eventKey={index}
                  onClick={() => {
                    handleItemClick(value);
                  }}
                >
                  {!value.seen && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="9"
                      width="9"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#5D5FEF"
                        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
                      />
                    </svg>
                  )}
                  <img src={member_image} alt="" />
                  <div className="w-100">
                    <div
                      style={{ color: "#2C2C66", fontSize: "1rem" }}
                      className="d-flex justify-content-between mb-1"
                    >
                      <small
                        style={{
                          fontWeight: "bold",
                          width: "10rem",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {value.class}
                      </small>
                      <small style={{ fontSize: "0.8rem" }}>{value.time}</small>
                    </div>
                    <p
                      className="p-0 m-0"
                      style={{
                        color: "#333333",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {value.fromName}
                      </span>
                      {value.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p
                className=" m-0 p-0 p-2"
                style={{
                  fontStyle: "italic",
                  color: "#2C2C66",
                  textAlign: "center",
                }}
              >
                There have been no notifications yet
              </p>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <LogoutIcon onClick={logoutHandler} className="icon" />
      </div>
    </Navbar>
  );
};

export default MainNavigation;
