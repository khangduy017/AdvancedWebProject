import styles from "./HomePageContent.module.css";
import { RingLoader } from "react-spinners";
import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { ReactComponent as LeaveIcon } from "../../assests/svg/leave.svg";
import { ReactComponent as FolderIcon } from "../../assests/svg/folder.svg";
import { ReactComponent as SearchIcon } from "../../assests/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assests/svg/filter.svg";
import { ReactComponent as PlusIcon } from "../../assests/svg/plus.svg";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";

const HomePageContent = () => {
  // get information when login with social
  const navigate = useNavigate();
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

  const [searchInput, setSearchInput] = useState("");
  const classData = [1, 2, 3, 4, 1, 2, 3, 4];
  const colorForClass = [];
  for( let i=0; i<classData.length; i++){
    let randomColorNumber = Math.floor(Math.random() * 5);
    let randomColor;
    if(randomColorNumber===0) randomColor='blue';
    else if(randomColorNumber===1) randomColor='yellow';
    else if(randomColorNumber===2) randomColor='red';
    else if(randomColorNumber===3) randomColor='purple';
    else if(randomColorNumber===4) randomColor='green';
    colorForClass.push(randomColor);
  }

  const submitHandler = (event) => {
    console.log(searchInput);
  };

  return (
    <div className="w-75 mx-auto">
      <h3>My class</h3>
      <div className={`${styles["search-container"]} d-flex mt-4 p-0 align-items-center justify-content-between`}>
        <div className="d-flex">
          <Button
            onClick={submitHandler}
            className={`${styles["find-classroom"]}`}
            type="submit"
          >
            Join classroom
          </Button>
          {/* <Button
            onClick={submitHandler}
            className={`${styles["create-classroom"]}`}
            type="submit"
          >
            Create class
          </Button> */}
        </div>
        <Form className={`${styles["form-container"]} d-flex align-items-center justify-content-between`}>
          <Form.Group className="position-relative" controlId="formGridAddress1">
            <Form.Control
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              value={searchInput}
              className={`${styles["form-control-container"]}`}
            />
            <SearchIcon
              className={`${styles["search-icon-customize"]} position-absolute`}
            />
          </Form.Group>
          <div className={`${styles["filter-icon-customize"]} d-flex align-items-center justify-content-center`}>
            <FilterIcon />
          </div>
        </Form>
      </div>
      <div className="d-flex my-2 flex-wrap justify-content-between">
        {classData.map((data, index) => (
          <div
            onClick={() => {
              navigate("/myclass/1");
            }}
            className={`${styles["class-content-container"]} mt-4 rounded-3`}
            key={index}
          >
            <div className={`${styles["class-title-container"]} ${styles[colorForClass[index]]} rounded-top-3`}>
              <h2 className={`${styles["class-title"]} px-3 pt-3`}>
                2310-CLC-AWP-20KTPM2
              </h2>
              <div className={`${styles["class-instructor"]} px-3 pt-0`}>
                Advanced Web Programming
              </div>
              <div className={`${styles["class-instructor"]} px-3 pt-2 pb-3`}>
                Gia Huy
              </div>
            </div>
            <div className={`${styles["class-mid-container"]} rounded-top-3`}>
              <h5 className={`${styles["class-assignment-title"]} px-3 pt-3`}>
                Assignment - Due in January
              </h5>
              <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                Infinite Scroll
              </div>
              <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                Midterm Project Authentication
              </div>
              <div className={`${styles["class-instructor"]} px-3 pb-1`}>
                Final Project Classroom
              </div>
            </div>
            <div
              className={`${styles["class-footer-container"]} d-flex justify-content-end align-items-center px-4`}
            >
              <FolderIcon className={`${styles["size-icon"]} m-3`} />
              <LeaveIcon className={styles["size-icon"]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageContent;
