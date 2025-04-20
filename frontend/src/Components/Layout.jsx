/* components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const MainContent = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
`;

const Layout = () => {
  return (
    <>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

export default Layout;
