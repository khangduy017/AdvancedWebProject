import styles from "./HomePageContent.module.css";
import { RingLoader } from "react-spinners";
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as FolderIcon } from "../../assests/svg/folder.svg";

const HomePageContent = () => {
  // get information when login with social
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    const expiresTime = new URLSearchParams(location.search).get("expiresTime");
    const userData = new URLSearchParams(location.search).get("userData");
    if (token) {
      const expirationTime = new Date(new Date().getTime() + +expiresTime);
      authCtx.login(token, expirationTime.toISOString());
      console.log(userData);
    }
  }, [location.search]);

  const classData = [1, 2, 3, 4, 1, 2, 3, 4];

  return (
    <div className="w-75 mx-auto">
      <h3>My class</h3>
      <div className="d-flex my-3 flex-wrap justify-content-between">
        {classData.map((data) => (
          <div className={`${styles["class-content-container"]} mt-4 rounded-3`}>
            <div className={`${styles["class-title-container"]} rounded-top-3`}> 
              <h2 className={`${styles['class-title']} px-3 pt-3`}>2310-CLC-AWP-20KTPM2</h2>
              <div className={`${styles['class-instructor']} px-3 pt-0`}>Advanced Web Programming</div>
              <div className={`${styles['class-instructor']} px-3 pt-2 pb-3`}>Gia Huy</div>
            </div>
            <div className={`${styles["class-mid-container"]} rounded-top-3`}>
              <h5 className={`${styles['class-assignment-title']} px-3 pt-3`}>Assignment - Due in January</h5>
              <div className={`${styles['class-instructor']} px-3 pb-1`}>Infinite Scroll</div>
              <div className={`${styles['class-instructor']} px-3 pb-1`}>Midterm Project Authentication</div>
              <div className={`${styles['class-instructor']} px-3 pb-1`}>Final Project Classroom</div>
            </div>
            <div className={`${styles["class-footer-container"]} d-flex justify-content-end align-items-center px-4`}>
              <FolderIcon className={`${styles["size-icon"]} m-3`}/>
              <LeaveIcon className={styles["size-icon"]}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageContent;
