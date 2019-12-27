import { Navbar, Nav } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isBrowser } from "../utils/isBrowser";

export default function navigation() {
  const [signedIn, setSignedIn] = useState(false);

  // this is calculated in an effect so it doesn't look like the client and server have different values
  useEffect(() => {
    const _signedIn = isBrowser()
      ? window.localStorage.getItem("session:csrfToken")
        ? true
        : false
      : false;

    setSignedIn(_signedIn);
  }, []);

  const loggedInLinks = (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Link href="/dashboard" passHref>
          <Nav.Link>Dashboard</Nav.Link>
        </Link>

        <Link href="/account" passHref>
          <Nav.Link>Account</Nav.Link>
        </Link>

        <Link href="/sign-out" passHref>
          <Nav.Link>Sign Out</Nav.Link>
        </Link>
      </Nav>
    </Navbar.Collapse>
  );

  const loggedOutLinks = (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Link href="/" passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>

        <Link href="/sign-up" passHref>
          <Nav.Link>Sign Up</Nav.Link>
        </Link>

        <Link href="/sign-in" passHref>
          <Nav.Link>Sign In</Nav.Link>
        </Link>
      </Nav>
    </Navbar.Collapse>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Link href={signedIn ? "/dashboard" : "/"} passHref>
        <Navbar.Brand>Actionhero Chat</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {signedIn ? loggedInLinks : loggedOutLinks}
    </Navbar>
  );
}
