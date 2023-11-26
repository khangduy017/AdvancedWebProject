import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ProfilePage from "../pages/ProfilePage";
import ClassroomPage from "../pages/ClassroomPage";
import HomePage from "../pages/HomePage";
import AuthContext from "../store/auth-context";
import LoginPage from "../pages/LoginPage";
import Register from "../components/Auth/Register/register";
import ForgetPassword from "../components/Auth/ForgetPassword/forgetPassword";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import {useState,useEffect  } from "react";
import { useLocation } from "react-router-dom";


const AppRoutes = () => {
    // get information when login with social
    const authCtx = useContext(AuthContext);
    const location = useLocation();
    
    useEffect(() => {
      const token = new URLSearchParams(location.search).get("token");
      const expiresTime = new URLSearchParams(location.search).get("expiresTime");
      const userData = new URLSearchParams(location.search).get("userData");
      if (token) {
        const expirationTime = new Date(new Date().getTime() + +expiresTime);
        authCtx.login(token, expirationTime.toISOString(),JSON.parse(userData).role);
      }
    }, [location.search]);

  return (
    <Routes>
      {!authCtx.isLoggedIn && (
        <Route path="/login" element={<LoginPage />} />
      )}
      {!authCtx.isLoggedIn && (
        <Route path="/register" element={<Register />} />
      )}
      {!authCtx.isLoggedIn && (
        <Route path="/forget-password" element={<ForgetPassword />} />
      )}

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/myclass/:id" element={<ClassroomPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
