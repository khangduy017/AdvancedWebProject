import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import AuthContext from "../../store/auth-context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

const Sidebar = () => {
  // const activeLink = ({ isActive }) => isActive ? `${styles['active-custom']}`: ''};
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const headers = { Authorization: `Bearer ${token}` };

  const navigate = useNavigate()

  const handleGetAllClasses = () => {
    const data = {
      _id: localStorage.getItem('_id')
    }

    axios.post(process.env.REACT_APP_API_HOST + "classes", data, { headers })
      .then(res => {
        if (res.data.status === 'success') {
          authCtx.setClasses(res.data.value)
        }
        else {

        }
      })
      .catch(err => {

      })
  }

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      handleGetAllClasses();
    }
  }, []);
  return (
    <div className={`${styles["sidebar-container"]} d-flex`}>
      <CDBSidebar textColor="#5D5FEF" backgroundColor="white">
        <CDBSidebarHeader>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Homepage
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? "#5D5FEF" : "#A5A6F6",
                fontWeight: isActive ? "700" : "",
              })}
            >
              <CDBSidebarMenuItem icon="list">All classes</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/deadline"
              style={({ isActive }) => ({
                color: isActive ? "#5D5FEF" : "#A5A6F6",
                fontWeight: isActive ? "700" : "",
              })}
            >
              <CDBSidebarMenuItem icon="clock">Deadline</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? "#5D5FEF" : "#A5A6F6",
                fontWeight: isActive ? "700" : "",
              })}
            >
              <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
            </NavLink>
            <div className={`${styles["middle-line"]}`}></div>
            {authCtx.classes.map((data, index) => (
              <NavLink
                key={index}
                to={`/myclass/${data._id}/`}
                style={({ isActive }) => ({
                  color: isActive ? "#5D5FEF" : "#A5A6F6",
                  fontWeight: isActive ? "700" : "",
                })}
              >
                <CDBSidebarMenuItem icon="book">
                  {data.title}
                </CDBSidebarMenuItem>
              </NavLink>
            ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div
            style={{
              padding: "20px 5px",
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
