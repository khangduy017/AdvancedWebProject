import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import AuthContext from "../../store/auth-context";
import { useState, useContext, useEffect } from "react";

const Sidebar = () => {
  // const activeLink = ({ isActive }) => isActive ? `${styles['active-custom']}`: ''};
  const authCtx = useContext(AuthContext);
  return (
    <div className={`${styles["sidebar-container"]} d-flex`}>
      <CDBSidebar textColor="#5D5FEF" backgroundColor="white">
        <CDBSidebarHeader>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Administrative
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
                to={`/myclass/${data._id}`}
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
