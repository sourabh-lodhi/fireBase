import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

function NavBarToggle() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary bg-primary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/">Pages</Nav.Link>
            <Nav.Link href="/">Widgets</Nav.Link>

            <NavDropdown title="Authentication" id="basic-nav-dropdown">
              {/* <NavDropdown.Item href="/">Sign In</NavDropdown.Item> */}
              <Link className="btn" href="/">
                Sign In
              </Link>
              <br />
              <Link className="btn" href="/sign-up">
                Sign Up
              </Link>
              <br />
              <Link className="btn" href="/password-reset">
                Password Reset
              </Link>

              {/* <NavDropdown.Item href="/sign-up">Sign Up</NavDropdown.Item> */}
              {/* <NavDropdown.Item href="/password-reset">
                Password Reset
              </NavDropdown.Item> */}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBarToggle;
