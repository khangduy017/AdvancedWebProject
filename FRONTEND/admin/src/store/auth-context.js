import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userData: {},
  classes: [],
  listUser: [],
  listStudent: [],
  setUserDataContext: (userDataParam) => {},
  setClasses: (classesParam) => {},
  setListUser: (listUserParam) => {},
  setListStudent: (listStudentParam) => {},
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const [userData, setUserData] = useState({});
  const [classes, setClasses] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listStudent, setListStudent] = useState([]);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('role');
    localStorage.removeItem('_id');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime, role,_id) => {

    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);
    localStorage.setItem('role',role)
    localStorage.setItem('_id',_id)

    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const setUserDataHandler = (userDataParam) =>{
    setUserData(userDataParam);
  }

  const classesHandler = (classesParam) =>{
    setClasses(classesParam);
  }

  const listUserHandler = (listUserParam) =>{
    setListUser(listUserParam);
  }

  const listStudentHandler = (listStudentParam) =>{
    setListStudent(listStudentParam);
  }


  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    userData: userData,
    isLoggedIn: userIsLoggedIn,
    setUserDataContext: setUserDataHandler,
    login: loginHandler,
    logout: logoutHandler,
    setClasses: classesHandler,
    classes: classes,
    setListUser: listUserHandler,
    listUser: listUser,
    setListStudent: listStudentHandler,
    listStudent: listStudent,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
