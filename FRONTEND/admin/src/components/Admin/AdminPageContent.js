import styles from "./AdminPageContent.module.css";
import { useState, useContext, useEffect } from "react";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import toast from "react-hot-toast";

const AdminPageContent = () => {
//   const navigate = useNavigate();

//   const [idInput, setIdInput] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   const authCtx = useContext(AuthContext);

//   const token = authCtx.token;
//   const userData = authCtx.userData;
//   const headers = { Authorization: `Bearer ${token}` };

//   const handleGetAllClasses = () => {
//     const data = {
//       _id: localStorage.getItem('_id')
//     }

//     axios.post(process.env.REACT_APP_API_HOST + "classes", data, { headers })
//       .then(res => {
//         if (res.data.status === 'success') {
//           authCtx.setClasses(res.data.value)
//           setLoading(false)
//         }
//         else {

//         }
//       })
//       .catch(err => {

//       })
//   }

//   useEffect(() => {
//     if (authCtx.isLoggedIn) {
//       handleGetAllClasses();
//     }
//   }, []);

// //   const handleCreate = (event) => {
// //     // event.preventDefault();
// //     const dataSubmit = {
// //       user: userData._id,
// //       title: titleInput,
// //       content: contentInput,
// //       topic: topicInput,
// //       inviteLink: "",
// //       color: color[Math.floor(Math.random() * 10)]
// //     }

// //     axios.post(process.env.REACT_APP_API_HOST + 'classes/create', dataSubmit, { headers }
// //     )
// //       .then((res) => {
// //         if (res.data.status === "success") {
// //           toast.success("Create class successfully", styleSuccess);
// //           handleGetAllClasses()
// //           setShow(false)
// //         }
// //         else {
// //           toast.error(res.data.message, styleError);
// //         }
// //       });
// //   }


//   const styleError = {
//     style: {
//       border: "2px solid red",
//       padding: "10px",
//       color: "red",
//       fontWeight: "500",
//     },
//     duration: 4000,
//   };

//   const styleSuccess = {
//     style: {
//       border: "2px solid #28a745",
//       padding: "5px",
//       color: "#28a745",
//       fontWeight: "500",
//     },
//     duration: 4000,
//   };

  return (
    <div className={`${styles["total-container"]}`}>
        testtt
    </div>
  );
};
export default AdminPageContent;
