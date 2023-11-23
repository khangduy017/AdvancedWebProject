import styles from "./Classroom.module.css";
import { RingLoader } from "react-spinners";
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ClassroomBanner from "../../assests/img/class-banner.jpg";

const Classroom = () => {
  // get information when login with social

  return (
    <div className={`${styles["classroom-container"]}`}>
      <div className={`${styles["banner-container"]} w-100`}>
        <img
          className={`${styles["classroom-banner"]} w-100 h-100`}
          src={ClassroomBanner}
        />
        <h2 className={`${styles["classroom-name"]}`}>2310-CLC-AWP-20KTPM2</h2>
        <p className={`${styles["classroom-note"]}`}>
          Advanced Web Programming
        </p>
      </div>
    </div>
  );
};

export default Classroom;
