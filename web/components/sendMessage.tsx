import { useState, useEffect } from "react";
import { useApi } from "./../hooks/useApi";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";

export default function SendMessage({ errorHandler, userId }) {
  const { execApi } = useApi(errorHandler);
  const { handleSubmit, register } = useForm();

  const onSubmit = async ({ message }) => {
    await execApi({ message, userId }, "/api/1/message", "post");
    // @ts-ignore
    document.getElementById("messageForm").reset();
  };

  return (
    <>
      <Form id="messageForm" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            autoFocus
            name="message"
            required
            type="text"
            ref={register}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </>
  );
}
