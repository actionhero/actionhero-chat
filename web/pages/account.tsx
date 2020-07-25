import { useState, useEffect } from "react";
import { useApi } from "./../hooks/useApi";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";

export default function Dashboard({ successHandler, errorHandler }) {
  const [user, setUser] = useState({ id: null, userName: null, email: null });
  const { loading, execApi } = useApi(errorHandler);
  const { handleSubmit, register } = useForm();

  useEffect(() => {
    execApi(null, "/api/1/user", "get", (response) => {
      setUser(response.user);
    });
  }, []);

  const onSubmit = async (data) => {
    if (data.password === "") {
      delete data.password;
    }

    // const success = await setAccount(data, setUser, "user");
    execApi(data, "/api/1/user", "put", (response) => {
      if (response.user) {
        successHandler.set({ message: "Updated!" });
      }
    });
  };

  return (
    <>
      <h1>Account</h1>

      <Form id="form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>User Name (public)</Form.Label>
          <Form.Control
            name="userName"
            required
            type="text"
            ref={register}
            defaultValue={user.userName}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            name="email"
            required
            type="email"
            ref={register}
            defaultValue={user.email}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" ref={register} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          Update
        </Button>
      </Form>
    </>
  );
}
