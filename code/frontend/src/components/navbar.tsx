import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown, Offcanvas } from 'react-bootstrap';
import { useTheme } from '../context/themeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { NavbarProps } from '../types';

const AppNavbar = ({ isLoggedIn, onLogout}: NavbarProps) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  return (
    <Navbar 
        bg={isDarkMode ? 'dark' : 'light'} 
        data-bs-theme={isDarkMode ? 'dark' : 'light'} 
        expand="lg" 
        className="py-3 sticky-top"
    >
      <Container>
        <Row className="w-100">
          <Col xs={6} sm={6} md={4}>
            <Navbar.Brand href="/" className="text-primary fw-bold">
              Rakshak
            </Navbar.Brand>
          </Col>

          <Col xs={6} sm={6} md={8} className="d-flex justify-content-end">
            {/* Desktop Nav */}
            <Nav className="d-none d-lg-flex align-items-center">
              {isLoggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
              <Nav.Link href="/aboutUs">About Us</Nav.Link>
              <Nav.Link href="/contact">Contact Us</Nav.Link>
              <NavDropdown title="Account" id="nav-dropdown">
                {isLoggedIn ? (
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item href="/login">Sign In</NavDropdown.Item>
                    <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
              <Button variant="outline-primary" onClick={toggleTheme} className="ms-2">
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </Button>
            </Nav>

            {/* Hamburger for Mobile */}
            <Button
              variant="outline-primary"
              className="d-lg-none"
              onClick={toggleOffcanvas}
              aria-label="Toggle navigation"
            >
              ☰
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas} placement="end" bg={isDarkMode ? 'dark' : 'light'} data-bs-theme={isDarkMode ? 'dark' : 'light'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Rakshak</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {isLoggedIn && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
            <Nav.Link href="/aboutUs">About Us</Nav.Link>
            <Nav.Link href="/contact">Contact Us</Nav.Link>
            <NavDropdown title="Account" id="offcanvas-nav-dropdown">
              {isLoggedIn ? (
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              ) : (
                <>
                  <NavDropdown.Item href="/login">Sign In</NavDropdown.Item>
                  <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
                </>
              )}
            </NavDropdown>

            <Button 
                variant="outline-primary" 
                onClick={toggleTheme} 
                className="mt-2"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </Button>

          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
};

export default AppNavbar;
