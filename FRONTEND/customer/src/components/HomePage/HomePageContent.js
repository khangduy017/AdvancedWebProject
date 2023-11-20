import "./HomePageContent.css";
import { RingLoader } from "react-spinners";
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const HomePageContent = () => {

  // get information when login with social
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    const expiresTime = new URLSearchParams(location.search).get('expiresTime');
    const userData = new URLSearchParams(location.search).get('userData');
    if (token) {
      const expirationTime = new Date(
        new Date().getTime() + +expiresTime
      );
      authCtx.login(token, expirationTime.toISOString());
      console.log(userData)
    }
  }, [location.search]);


  return (
    <div className="spinner">
      <h3>Homepage</h3>
      <RingLoader color="#5D5FEF" size={400} />
    </div>
  );
};

export default HomePageContent;
