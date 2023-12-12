import { Fragment } from 'react';
import MainNavigation from './MainNavigation';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import styles from "./Layout.module.css";

const Layout = (props) => {
  return (
    <div>
      <MainNavigation />
      <div>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
