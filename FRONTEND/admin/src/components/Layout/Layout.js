import { Fragment } from 'react';
import MainNavigation from './MainNavigation';
import Footer from '../Footer/Footer';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import styles from "./Layout.module.css";

const Layout = (props) => {
  return (
    <div>
      <MainNavigation />
      <div >
        <Sidebar />
        <Outlet />
      </div>
      {/* <Footer />   */}
    </div>
  );
};

export default Layout;
