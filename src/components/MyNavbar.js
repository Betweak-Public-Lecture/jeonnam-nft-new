import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function MyNavbar({ ethAccount, requestAccount }) {
  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          NFT-Market
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/market">
              Market
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/mytoken">
              My Token
            </Nav.Link>
            <Nav.Link as={Link} to="/minting">
              Mint
            </Nav.Link>
            {ethAccount ? (
              <Nav.Link>
                <small>{ethAccount}</small>
              </Nav.Link>
            ) : (
              <Nav.Link
                onClick={(e) => {
                  e.preventDefault();
                  requestAccount();
                }}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
