import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import logo from '../assets/MegaWrite-logo.jpeg';

function CustomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
    setRole(localStorage.getItem('role') || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUsername('');
    setRole('');
    navigate('/');
  };

  const activeStyle = {
    fontWeight: 'bold',
    color: '#FFD700', 
    textDecoration: 'underline'
  };

  return (
    <Navbar bg="secondary" variant="dark" expand="lg" className="shadow-sm fixed-top">
      <Container>
        {/* Left side: Logo/Name */}
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-white d-flex align-items-center">
          <img
            src={logo}
            alt="MegaWrite Logo"
            width="50"
            height="50"
            className="d-inline-block align-top me-1 rounded-circle"
          />
          MegaWrite-BlogApp
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Right side: Navigation Links */}
          <Nav className="ms-auto d-flex align-items-center">
            {!username ? (
              <>
                <Nav.Link as={NavLink} to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/user/auth" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  User Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/author/auth" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  Author Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about-us" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  About Us
                </Nav.Link>
              </>
            ) : role === 'user' ? (
              <>
                <Nav.Link as={NavLink} to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about-us" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  About Us
                </Nav.Link>
                <Nav.Item className="d-flex align-items-center text-white fw-bold mx-3">
                  Welcome, {username}
                </Nav.Item>
                <Button variant="outline-light" onClick={handleLogout} className="fw-bold mx-3">Logout</Button>
              </>
            ) : role === 'author' ? (
              <>
                <Nav.Link as={NavLink} to="/author/articles" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/author/create" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  Create Article
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about-us" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="fw-bold text-white mx-3">
                  About Us
                </Nav.Link>
                <Nav.Item className="d-flex align-items-center text-white fw-bold mx-3">
                  Welcome, {username}
                </Nav.Item>
                <Button variant="outline-light" onClick={handleLogout} className="fw-bold mx-3">Logout</Button>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
