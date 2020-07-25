import { Form, Button } from "react-bootstrap";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { useApi } from "./../hooks/useApi";

export default function SignUp({ errorHandler, successHandler }) {
  const { handleSubmit, register } = useForm();
  const { loading, execApi, response } = useApi(errorHandler);

  const onSubmit = (data) => {
    execApi(data, "/api/1/user", "post", (response) => {
      if (response.user) {
        successHandler.set({ message: "User created" });
        Router.push("/sign-in");
      }
    });
  };

  return (
    <>
      <h1>Sign Up</h1>

      <Form id="form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>User Name (will be public)</Form.Label>
          <Form.Control
            autoFocus
            name="userName"
            required
            type="text"
            ref={register}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <Form.Control name="email" required type="email" ref={register} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" ref={register} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          Sign Up
        </Button>
      </Form>
    </>
  );
}
