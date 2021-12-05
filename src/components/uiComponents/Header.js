import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './uiComponents.css';

function Header() {
    return (
        <div>
            <Navbar bg="dark" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Naksh logo</Nav.Link>
                            <Nav.Link href="#home">SEARCH</Nav.Link>
                            <Nav.Link href="#home">BROWSE</Nav.Link>
                            <Nav.Link href="#link">ABOUT</Nav.Link>
                            <Nav.Link href="#link">RESOURCES</Nav.Link>
                            <Nav.Link href="#link">NEAR BTN</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Header
