import UserProfile from "../components/Profile/UserProfile";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../store/auth-context";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";

const ProfilePage = () => {
  // const nagivate = useNavigate();
  // const authCtx = useContext(AuthContext);
  // if(!authCtx.isLoggedIn){
  //   nagivate('/auth');
  // }
  // else{
    return (
      <div>
        <UserProfile />
        <Toaster position="top-right" />
      </div>
    );
  // }
};

export default ProfilePage;
