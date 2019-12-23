import { Navbar, Nav } from "react-bootstrap";
import Link from "next/link";

export default function navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Link href="/" passHref>
        <Navbar.Brand>Actionhero Chat</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
