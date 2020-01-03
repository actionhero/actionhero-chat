import { useState, useEffect } from "react";
import { Jumbotron } from "react-bootstrap";
import { useApi } from "./../hooks/useApi";

export default function Dashboard({ errorHandler }) {
  const [user, setUser] = useState({ userName: null });
  const { execApi } = useApi(errorHandler);

  useEffect(() => {
    execApi(null, "/api/1/user", "get", response => {
      if (response.user) {
        setUser(response.user);
      }
    });
  }, []);

  return (
    <>
      <h1>Dashboard</h1>

      <Jumbotron>
        <p>Hi, {user.userName}</p>
      </Jumbotron>
    </>
  );
}
