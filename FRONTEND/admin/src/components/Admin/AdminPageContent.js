import styles from "./AdminPageContent.module.css";
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

  const authCtx = useContext(AuthContext);
  const [isAcs, setIsAcs] = useState(true);
  const token = authCtx.token;
  const userData = authCtx.userData;
  const headers = { Authorization: `Bearer ${token}` };

  const [classes, setClasses] = useState(authCtx.classes);

  const [searchInput, setSearchInput] = useState("");

  const handleGetAllClasses = () => {
    axios
      .get(process.env.REACT_APP_API_HOST + "classes/all-class-all-account", {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setClasses(res.data.value);
          setClasses(res.data.value);
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
      .post(process.env.REACT_APP_API_HOST + "classes/update-status", data, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setClasses(res.data.value);
          setClasses(res.data.value);
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

  const submitSearch = (event) => {
    event.preventDefault();
    const data = {
      searchInput: searchInput,
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "classes/search-class", data, {
        headers,
      })
      .then((res) => {
        if (res.data.status === "success") {
          authCtx.setClasses(res.data.value);
          setClasses(res.data.value);
        } else {
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);

  return (
    <div className={`${styles["total-container"]} w-75`}>
      <h3>Manage classroom</h3>
      <div
        className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}
      >
        <div className="d-flex">
          <div className={`${styles["dropdown"]}`}>
            <Button
              onClick={() => {
                setClasses([...classes.reverse()]);
                setIsAcs(!isAcs);
              }}
              className={`${styles["dropbtn"]}`}
            >
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
                  setClasses(authCtx.classes);
                }}
              >
                All classes
              </div>
              <div
                onClick={() => {
                  setClasses(
                    authCtx.classes.filter((data) => data.active === true)
                  );
                }}
              >
                Active classes
              </div>
              <div
                onClick={() => {
                  setClasses(
                    authCtx.classes.filter((data) => data.active === false)
                  );
                }}
              >
                Inactive classes
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Table striped bordered hover className="my-4 rounded-lg">
        <thead>
          <tr className={`${styles["bg-head"]}`}>
            <th>#</th>
            <th>Title</th>
            <th>Content</th>
            <th>Owner</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data.title}</td>
              <td>{data.content}</td>
              <td>{data.owner}</td>
              <td
                className={`${styles["spec-col"]}`}
                onClick={() => handleChangeActive(data._id.toString())}
              >
                {data.active ? (
                  <div className={`${styles["active-button"]}`}>Active</div>
                ) : (
                  <div className={`${styles["inactive-button"]}`}>Inactive</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default AdminPageContent;
