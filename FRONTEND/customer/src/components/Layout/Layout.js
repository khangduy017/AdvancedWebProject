import { Fragment } from 'react';
import MainNavigation from './MainNavigation';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";


const Layout = (props) => {
  return (
    <div>
      <Toaster position="top-right" />
      <MainNavigation />
      <div>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
