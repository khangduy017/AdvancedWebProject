import styles from "./AdminAccountPageContent.module.css";
import { useState, useContext, useEffect } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import { ReactComponent as SortIcon } from "../../assests/svg/sort.svg";
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

  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);

  const handleGetAllUsers = () => {
    axios
      .get(process.env.REACT_APP_API_HOST + "auth/get-all-user", { headers })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListUser(res.data.value);
          setListUser(res.data.value);
        } else {
        }
        setLoading(false);
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

  const submitSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      searchInput: searchInput,
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "auth/search-user", data, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setListUser(res.data.value);
          setListUser(res.data.value);
        } else {
        }
        setLoading(false);
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
      handleGetAllUsers();
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
              className={`${styles["dropbtn"]} d-flex align-items-center justify-content-center`}
            >
              <SortIcon />
              {isAcs ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>
        <Form
          className={`${styles["form-container"]} d-flex align-items-center justify-content-between`}
          onSubmit={submitSearch}
        >
          <Form.Group
            className="position-relative"
            controlId="formGridAddress1"
          >
            <Form.Control
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              value={searchInput}
              className={`${styles["form-control-container"]}`}
              placeholder="Search for users...."
            />
            <SearchIcon
              className={`${styles["search-icon-customize"]} position-absolute`}
            />
          </Form.Group>
          <div
            className={`${styles["dropdown"]} ${styles["more-border-custom"]} d-flex justify-content-end`}
          >
            <FilterIcon />
            <div className={`${styles["dropdown-content"]}`}>
              <div
                onClick={() => {
                  setListUser(authCtx.listUser);
                }}
              >
                All accounts
              </div>
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
        </Form>
      </div>
      {loading ? (
        <div
          style={{ marginTop: "10rem" }}
          className="d-flex justify-content-center"
        >
          <div
            style={{ width: "3rem", height: "3rem", color: "#5D5FEF" }}
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.username}</td>
                <td>{data.fullname}</td>
                <td>{data.email}</td>
                <td>{data.role}</td>
                <td
                  className={`${styles["spec-col"]}`}
                  onClick={() => handleChangeActive(data._id.toString())}
                >
                  {data.active ? (
                    <div className={`${styles["active-button"]}`}>Active</div>
                  ) : (
                    <div className={`${styles["inactive-button"]}`}>
                      Inactive
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};
export default AdminPageContent;
