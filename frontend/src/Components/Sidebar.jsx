import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'react-feather';

const lightTheme = {
  background: '#f9f9f9',
  sidebar: '#ffffff',
  linkBg: '#a50044',
  linkColor: '#ffcb05',
  text: '#000000',
};

const darkTheme = {
  background: '#0e1a30',
  sidebar: '#0e1a30',
  linkBg: '#a50044',
  linkColor: '#ffcb05',
  text: '#ffffff',
};

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.linkColor};
  padding: 25px;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  box-shadow: ${({ open }) => (open ? '4px 0 12px rgba(0,0,0,0.4)' : 'none')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
`;

const ToggleButton = styled.div`
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  cursor: pointer;
  color: ${({ theme }) => theme.linkColor};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
`;

const StyledLink = styled(NavLink)`
  display: block;
  padding: 12px 20px;
  margin: 10px 0;
  text-decoration: none;
  background: ${({ theme }) => theme.linkBg};
  color: ${({ theme }) => theme.linkColor};
  border-radius: 5px;
  transition: 0.3s ease;

  &.active {
    font-weight: bold;
    box-shadow: 0 0 8px ${({ theme }) => theme.linkColor};
  }

  &:hover {
    background: ${({ theme }) => theme.linkColor};
    color: ${({ theme }) => theme.sidebar};
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const ThemeToggle = styled.div`
  position: absolute;
  bottom: 25px;
  left: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.linkColor};
`;

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const closeSidebar = () => setOpen(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored === 'true') setOpen(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', open);
  }, [open]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ToggleButton onClick={() => setOpen(!open)}>
        {open ? <X size={28} /> : <Menu size={28} />}
      </ToggleButton>
      <Overlay open={open} onClick={closeSidebar} />
      <SidebarWrapper open={open}>
        <h2>Quizzer</h2>
        <StyledLink to="/" onClick={closeSidebar}>Home</StyledLink>
        <StyledLink to="/my-quizzes" onClick={closeSidebar}>My Quizzes</StyledLink>
        <StyledLink to="/create-quiz" onClick={closeSidebar}>Create Quiz</StyledLink>
        <StyledLink to="/Flashcards" onClick={closeSidebar}>Flashcards</StyledLink>
        <StyledLink to="/collections" onClick={closeSidebar}>My Collections</StyledLink>

        <ThemeToggle onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </ThemeToggle>
      </SidebarWrapper>
    </ThemeProvider>
  );
};

export default Sidebar;
