import { Form, Button } from "react-bootstrap";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { useApi } from "./../hooks/useApi";

export default function SignIn({
  errorHandler,
  successHandler,
  sessionHandler,
}) {
  const { handleSubmit, register } = useForm();
  const { loading, execApi, response } = useApi(errorHandler);

  const onSubmit = (data) => {
    execApi(data, "/api/1/session", "post", (response) => {
      if (response.user) {
        successHandler.set({
          message: "Session created",
        });
        window.localStorage.setItem("session:csrfToken", response.csrfToken);
        sessionHandler.set(response.user);
        Router.push("/dashboard");
      }
    });
  };

  return (
    <>
      <h1>Sign In</h1>

      <Form id="form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            autoFocus
            name="email"
            required
            type="email"
            ref={register}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" ref={register} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          Sign In
        </Button>
      </Form>
    </>
  );
}
