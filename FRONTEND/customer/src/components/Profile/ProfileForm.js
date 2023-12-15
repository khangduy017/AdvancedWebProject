import { useRef, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import "./ProfileForm.css";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import axios from "axios";

const ProfileForm = (props) => {
  const nagivate = useNavigate();

  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const token = authCtx.token;
  const userData = authCtx.userData;
  
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    if (authCtx.isLoggedIn) {
      setFullname(userData.fullname === undefined ? "" : userData.fullname);
      setUsername(userData.username === undefined ? "" : userData.username);
      setStudentId(userData.id === undefined ? "" : userData.id);
      setPhone(userData.phone === undefined ? "" : userData.phone);
      setGender(userData.gender === undefined ? "" : userData.gender);
      setRole(userData.role === undefined ? "" : userData.role);
      setEmail(userData.email === undefined ? "" : userData.email);
      setAddress(userData.address === undefined ? "" : userData.address);
    }
  }, [userData]);

  const styleSuccess = {
    style: {
      border: "2px solid #28a745",
      padding: "5px",
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

    const dataSubmit = {
      fullname: fullname,
      username: username,
      studentId: studentId,
      phone: phone,
      gender: gender,
      role: role,
      email: email,
      address: address,
    };

    if(username===''){
      toast.error('Username must not be empty', styleError);
    }

    else if(email===''){
      toast.error('Email must not be empty', styleError);
    }

    else{
      axios
        .post(
          process.env.REACT_APP_API_HOST + 'auth/edit-profile',
          dataSubmit,
          { headers }
        )
        .then((res) => {
          if (res.data.status === "success") {
            authCtx.setUserDataContext(res.data.data);
            toast.success("Update information successfully", styleSuccess);
          }
          else{
            toast.error(res.data.message, styleError);
          }
        });
    }
  };

  const changePasswordHandler = (event) => {
    event.preventDefault();

    const dataSubmit = {
      passwordCurrent: passwordCurrent,
      password: password,
      passwordConfirm: passwordConfirm,
    };

    if(password==='' || passwordCurrent==='' || passwordConfirm===''){
      toast.error('Password must not be empty', styleError);
    }
    else if(password<8 || passwordConfirm.length<8){
      toast.error('Password is too short', styleError);
    }
    else if(password!==passwordConfirm){
      toast.error('Password confirm is incorrect', styleError);
    }
    else if (password===passwordCurrent){
      toast.error('New password must be different', styleError);
    }
    else{
      axios
        .post(
          process.env.REACT_APP_API_HOST + 'auth/change-password',
          dataSubmit,
          { headers }
        )
        .then((res) => {
          if (res.data.status === "success") {
            const expirationTime = new Date(
              new Date().getTime() + +res.data.expiresTime
            );
            authCtx.login(res.data.token, expirationTime.toISOString());
            toast.success("Update password successfully", styleSuccess);
          }
          else{
            toast.error(res.data.message, styleError);
          }
        });
    }
  };

  return (
    // <div onClick={()=>{ toast.success("Tạo tài khoản thành công", styleSuccess);}}>profile</div>
    <div className="edit-profile-container">
      {props.mode === "General" && (
        <div className="edit-profile-heading">General Information</div>
      )}
      {props.mode === "EditProfile" && (
        <div className="edit-profile-heading">Edit Profile</div>
      )}
      {props.mode === "ChangePassword" && (
        <div className="edit-profile-heading">Change Password</div>
      )}

      {props.mode === "General" || props.mode === "EditProfile" ? (
        <Form className="form-container">
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Fullname</Form.Label>
            <Form.Control
              onChange={(event) => {
                setFullname(event.target.value);
              }}
              value={fullname}
              readOnly={props.mode === "General"}
              className="form-control-container"
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                value={username}
                readOnly={props.mode === "General"}
                className="form-control-container"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setStudentId(event.target.value);
                }}
                value={studentId}
                readOnly={props.mode === "General"}
                className="form-control-container"
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
                value={phone}
                readOnly={props.mode === "General"}
                className="form-control-container"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setGender(event.target.value);
                }}
                value={gender}
                readOnly={props.mode === "General"}
                className="form-control-container"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Role</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setRole(event.target.value);
                }}
                value={role}
                readOnly={props.mode === "General"}
                className="form-control-container"
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Email</Form.Label>
            <Form.Control
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
              readOnly={props.mode === "General"}
              type="email"
              className="form-control-container"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              value={address}
              readOnly={props.mode === "General"}
              type="email"
              className="form-control-container"
            />
          </Form.Group>

          {props.mode === "EditProfile" && (
            <div className="multi-button-container">
              <Button
                onClick={submitHandler}
                className="edit-profile-update"
                type="submit"
              >
                Update
              </Button>
            </div>
          )}
        </Form>
      ) : (
        <Form className="form-container">
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Current password</Form.Label>
            <Form.Control
              onChange={(event) => {
                setPasswordCurrent(event.target.value);
              }}
              type="password"
              value={passwordCurrent}
              className="form-control-container"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>New password</Form.Label>
            <Form.Control
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              type="password"
              value={password}
              className="form-control-container"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
              }}
              type="password"
              value={passwordConfirm}
              className="form-control-container"
            />
          </Form.Group>
          <div className="multi-button-container">
            <Button
              onClick={changePasswordHandler}
              className="edit-profile-update"
              type="submit"
            >
              Update
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ProfileForm;
