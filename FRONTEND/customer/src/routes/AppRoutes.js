import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import AuthContext from "../store/auth-context";
import LoginPage from "../pages/LoginPage";
import Register from "../components/Auth/Register/register";

const AppRoutes = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Routes>
      {!authCtx.isLoggedIn && (
        <Route path="/login" element={<LoginPage />} />
      )}
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
