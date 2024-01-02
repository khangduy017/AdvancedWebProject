import styles from "./AdminPageContent.module.css";
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

  const authCtx = useContext(AuthContext);
  const [isAcs, setIsAcs] = useState(true);
  const token = authCtx.token;
  const userData = authCtx.userData;
  const headers = { Authorization: `Bearer ${token}` };

  const [classes, setClasses] = useState(authCtx.classes);

  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch((err) => {});
  };

  const handleChangeActive = (id) => {
    loadingToast();
    const data = {
      id: id,
      _id: localStorage.getItem("_id"),
    };

    axios
      .post(process.env.REACT_APP_API_HOST + "classes/update-status", data, {
        headers,
      })
      .then((res) => {
        dismissToast();
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
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);

  let toastId;
  const loadingToast = () => {
    toastId = toast(
      (t) => (
        <div className="notification-up w-100 p-0 d-flex align-items-center gap-1">
          <div
            style={{
              width: "1.6rem",
              height: "1.6rem",
              color: "#5D5FEF",
              marginRight: "1rem",
            }}
            className="spinner-border"
            role="status"
          ></div>
          <p className="p-0 m-0" style={{ color: "#5D5FEF" }}>
            Loading...
          </p>
        </div>
      ),
      {
        duration: 600000,
        style: {
          cursor: "pointer",
          width: "10rem",
          border: "2px solid #5D5FEF",
          padding: "5px",
        },
      }
    );
  };
  const dismissToast = () => {
    toast.dismiss(toastId);
  };

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
              placeholder="Search for classes...."
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
