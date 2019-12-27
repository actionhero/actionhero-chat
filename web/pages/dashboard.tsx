import { useState, useEffect } from "react";
import { useApi } from "./../hooks/useApi";

export default function Dashboard({ errorHandler }) {
  const [user, setUser] = useState({ userName: null });
  const [loading, execApi] = useApi(errorHandler, "/api/1/user");

  useEffect(() => {
    execApi(null, setUser, "user");
  }, []);

  return (
    <>
      <h1>Dashboard</h1>

      <p>Hi, {user.userName}</p>
    </>
  );
}
