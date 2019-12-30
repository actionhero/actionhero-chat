import { useState, useEffect } from "react";
import { useApi } from "./../hooks/useApi";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";

export default function Dashboard({ successHandler, errorHandler }) {
  const [user, setUser] = useState({ id: null, userName: null, email: null });
  const { handleSubmit, register } = useForm();
  const { loading: userLoading, execApi: getAccount } = useApi(
    errorHandler,
    "/api/1/user",
    "get"
  );
  const { loading: updateLoading, execApi: setAccount } = useApi(
    errorHandler,
    "/api/1/user",
    "put"
  );

  useEffect(() => {
    getAccount(null, setUser, "user");
  }, []);

  const onSubmit = async data => {
    if (data.password === "") {
      delete data.password;
    }

    const success = await setAccount(data, setUser, "user");
    if (success) {
      successHandler.set({ message: "Updated!" });
    }
  };

  return (
    <>
      <h1>Account</h1>

      <Form id="form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>User Name</Form.Label>
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

        <Button
          variant="primary"
          type="submit"
          disabled={userLoading || updateLoading}
        >
          Update
        </Button>
      </Form>
    </>
  );
}
