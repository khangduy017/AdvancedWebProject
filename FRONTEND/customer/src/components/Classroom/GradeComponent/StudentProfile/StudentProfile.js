import React from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./StudentProfile.css";


export default function StudentProfile(props) {
  return (
    <Form className="form-container p-3" >
      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Fullname</Form.Label>
        <Form.Control
        disabled={true}
          value={props.value.fullname}
          className="form-control-container"
        />
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
        disabled={true}
            value={props.value.username}
            className="form-control-container"
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Student ID</Form.Label>
          <Form.Control
        disabled={true}
            value={props.value.id}
            className="form-control-container"
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Phone</Form.Label>
          <Form.Control
        disabled={true}
            value={props.value.phone}
            className="form-control-container"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Gender</Form.Label>
          <Form.Control
        disabled={true}
            value={props.value.gender}
            className="form-control-container"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Role</Form.Label>
          <Form.Control
        disabled={true}
            value={props.value.role}
            className="form-control-container"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Email</Form.Label>
        <Form.Control
        disabled={true}
          value={props.value.email}
          className="form-control-container"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Address</Form.Label>
        <Form.Control
        disabled={true}
          value={props.value.address}
          className="form-control-container"
        />
      </Form.Group>
    </Form>
  )
}
