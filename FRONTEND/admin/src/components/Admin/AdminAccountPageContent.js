import styles from "./AdminAccountPageContent.module.css";
import { useState, useContext, useEffect } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";

const AdminPageContent = () => {
  const navigate = useNavigate();

  //   const [idInput, setIdInput] = useState("");
  //   const [loading, setLoading] = useState(false);

  const [isAcs, setIsAcs] = useState(true);
  const authCtx = useContext(AuthContext);

  const token = authCtx.token;
  const userData = authCtx.userData;
  const headers = { Authorization: `Bearer ${token}` };

  const [listUser, setListUser] = useState(authCtx.listUser);

  const handleGetAllClasses = () => {
    axios
      .get(process.env.REACT_APP_API_HOST + "auth/get-all-user", { headers })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListUser(res.data.value);
          setListUser(res.data.value);
        } else {
        }
      })
      .catch((err) => {});
  };

  const handleChangeActive = (id) => {
    const data = {
      id: id,
      _id: localStorage.getItem("_id"),
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "auth/update-status", data, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListUser(res.data.value);
          setListUser(res.data.value);
          toast.success("Update status successfully", styleSuccess);
        } else {
        }
      })
      .catch((err) => {});
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

  const styleSuccess = {
    style: {
      border: "2px solid #28a745",
      padding: "5px",
      color: "#28a745",
      fontWeight: "500",
    },
    duration: 4000,
  };

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);

  return (
    <div className={`${styles["total-container"]} w-75`}>
      <h3>Manage account</h3>
      <div
        className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}
      >
        <div className="d-flex">
          <div className={`${styles["dropdown"]}`}>
            <Button
              onClick={() => {
                setListUser([...listUser.reverse()]);
                setIsAcs(!isAcs);
              }}
              className={`${styles["dropbtn"]}`}
            >
              {isAcs ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>

        <div
          className={`${styles["dropdown"]} ${styles["more-border-custom"]} d-flex justify-content-end`}
        >
          <FilterIcon />
          <div className={`${styles["dropdown-content"]}`}>
            <div
              onClick={() => {
                setListUser(
                  authCtx.listUser.filter((data) => data.active === true)
                );
              }}
            >
              Active account
            </div>
            <div
              onClick={() => {
                setListUser(
                  authCtx.listUser.filter((data) => data.active === false)
                );
              }}
            >
              Inactive account
            </div>
          </div>
        </div>
      </div>
      <Table striped bordered hover className="my-4 rounded-lg">
        <thead>
          <tr className={`${styles["bg-head"]}`}>
            <th>#</th>
            <th>Username</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {listUser.map((data, index) => (
            <tr
              className={`${styles["add-hover"]} ${
                !data.active && styles["inactive"]
              }}`}
              key={index}
              onClick={() => handleChangeActive(data._id.toString())}
            >
              <td>{index + 1}</td>
              <td>{data.username}</td>
              <td>{data.fullname}</td>
              <td>{data.email}</td>
              <td>{data.role}</td>
              <td>{data.active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default AdminPageContent;
