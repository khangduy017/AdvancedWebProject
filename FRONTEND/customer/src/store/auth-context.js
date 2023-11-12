import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});


export const AuthContextProvider = (props) => {

  const logoutHandler = useCallback(() => {
    //
  }, []);

  const loginHandler = (token, expirationTime) => {
    ///
  };

  const contextValue = {
    token: '',
    isLoggedIn: '',
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
