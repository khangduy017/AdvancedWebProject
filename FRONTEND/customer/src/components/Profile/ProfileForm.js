import { useRef, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import "./ProfileForm.css";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import axios from 'axios';

const ProfileForm = (props) => {
  const nagivate = useNavigate();

  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const token = authCtx.token;
  const headers = { 'Authorization': `Bearer ${token}` };
  useEffect(() => {
    if(authCtx.isLoggedIn){
      axios.get('http://127.0.0.1:3000/webAdvanced/api/v1/auth/get-user', { headers })
          .then(res => {
            setUserData(res.data.data);
            setFullname(res.data.data.fullname===undefined ? '' : res.data.data.fullname);
            setUsername(res.data.data.username);
            setDob(res.data.data.dob===undefined ? '' : res.data.data.dob);
            setPhone(res.data.data.phone===undefined ? '' : res.data.data.phone);
            setGender(res.data.data.gender===undefined ? '' : res.data.data.gender);
            setRole(res.data.data.role===undefined ? '' : res.data.data.role);
            setEmail(res.data.data.email);
            setAddress(res.data.data.address===undefined ? '' : res.data.data.address);
          });
    }
  }, []);

  
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
      dob: dob,
      phone: phone,
      gender: gender,
      role: role,
      email: email,
      address: address
    }

    // add validation
    axios.post('http://127.0.0.1:3000/webAdvanced/api/v1/auth/edit-profile', dataSubmit, { headers })
    .then(res => {
      if(res.data.status==='success'){
        console.log(res.data.data);
        toast.success("Update information successfully", styleSuccess);
      }
    });
  };

  return (
    // <div onClick={()=>{ toast.success("Tạo tài khoản thành công", styleSuccess);}}>profile</div>
    <div className="edit-profile-container">

      {props.mode==="General" && <div className="edit-profile-heading">General Information</div>}
      {props.mode==="EditProfile" && <div className="edit-profile-heading">Edit Profile</div>}
      {props.mode==="ChangePassword" && <div className="edit-profile-heading">Change Password</div>}

      <Form className="form-container">

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Fullname</Form.Label>
          <Form.Control onChange={(event)=>{setFullname(event.target.value)}} value={fullname} readOnly={props.mode==="General"} className="form-control-container" />
        </Form.Group> 

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={(event)=>{setUsername(event.target.value)}} value={username} readOnly={props.mode==="General"} className="form-control-container" />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Day of birth</Form.Label>
            <Form.Control onChange={(event)=>{setDob(event.target.value)}} value={dob} readOnly={props.mode==="General"} className="form-control-container" />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Phone</Form.Label>
            <Form.Control onChange={(event)=>{setPhone(event.target.value)}} value={phone} readOnly={props.mode==="General"} className="form-control-container"/>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Gender</Form.Label>
            <Form.Control onChange={(event)=>{setGender(event.target.value)}} value={gender} readOnly={props.mode==="General"} className="form-control-container"/>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Role</Form.Label>
            <Form.Control onChange={(event)=>{setRole(event.target.value)}} value={role} readOnly={props.mode==="General"} className="form-control-container"/>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Email</Form.Label>
          <Form.Control onChange={(event)=>{setEmail(event.target.value)}} value={email} readOnly={props.mode==="General"} type="email" className="form-control-container" />
        </Form.Group> 

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control onChange={(event)=>{setAddress(event.target.value)}} value={address} readOnly={props.mode==="General"} type="email" className="form-control-container" />
        </Form.Group> 

        {props.mode==="EditProfile" && <div className="multi-button-container">
          <Button onClick={submitHandler} className="edit-profile-update" type="submit">
              Update
          </Button>
        </div>}

      </Form>
    </div>
  );
};

export default ProfileForm;
