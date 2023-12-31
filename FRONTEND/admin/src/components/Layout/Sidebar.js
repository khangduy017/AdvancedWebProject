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
              to="/account"
              style={({ isActive }) => ({
                color: isActive ? "#5D5FEF" : "#A5A6F6",
                fontWeight: isActive ? "700" : "",
              })}
            >
              <CDBSidebarMenuItem icon="user">Account</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/student"
              style={({ isActive }) => ({
                color: isActive ? "#5D5FEF" : "#A5A6F6",
                fontWeight: isActive ? "700" : "",
              })}
            >
              <CDBSidebarMenuItem icon="map">Student mapping</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
