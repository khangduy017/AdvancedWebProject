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
import JoinClassPage from "../pages/JoinClassPage";
import GradeComponent from "../components/Classroom/GradeComponent/GradeComponent";
import MemberComponent from "../components/Classroom/MemberComponent/MemberComponent";
import ReviewComponent from "../components/Classroom/ReviewComponent/ReviewComponent";
import PostComponent from "../components/Classroom/PostComponent/PostComponent";
import ReviewDetail from "../components/Classroom/ReviewComponent/ReviewDetail/ReviewDetail";


const AppRoutes = () => {
  const authCtx = useContext(AuthContext);

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
        <Route path="/myclass/:id" element={<ClassroomPage />} >
          <Route index element={<PostComponent />} />
          <Route path='members' element={<MemberComponent />} />
          <Route path='grade/:grade_id' element={<GradeComponent />} />
          <Route path='review/:grade_id' element={<ReviewComponent />} />
          <Route path='review/:grade_id/:review_id' element={<ReviewDetail />} />
        </Route>
        <Route path="/myclass/:id/join" element={<JoinClassPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
