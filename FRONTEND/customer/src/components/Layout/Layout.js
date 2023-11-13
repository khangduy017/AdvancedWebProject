import { Fragment } from 'react';
import MainNavigation from './MainNavigation';
import { Outlet } from 'react-router-dom';

const Layout = (props) => {
  return (
    <div>
      <MainNavigation />
      <Outlet />
    </div>
  );
};

export default Layout;
