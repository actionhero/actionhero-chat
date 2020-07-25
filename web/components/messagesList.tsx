import { useState, useEffect } from "react";
import { useApi } from "./../hooks/useApi";
import { ListGroup, Image } from "react-bootstrap";

export default function MessagesList({ errorHandler, userId }) {
  const { execApi } = useApi(errorHandler);
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      createdAt: string;
      message: string;
      fromId: number;
      toId: number;
    }>
  >([]);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const response = await execApi({ userId }, "/api/1/user/messages", "get");
    setMessages(response?.messages);
  }

  function renderMessage(message: string) {
    if (message.match(/^http.*\.\D{3}$/)) {
      return (
        <Image
          style={{
            maxWidth: 200,
            maxHeight: 200,
            marginBottom: 20,
          }}
          src={message}
        />
      );
    } else {
      return message;
    }
  }

  return (
    <ListGroup variant="flush">
      {messages.map((message) => (
        <ListGroup.Item
          key={`message-${message.id}`}
          variant={message.fromId === userId ? "success" : "info"}
        >
          <strong>{renderMessage(message.message)}</strong>
          <br /> <em>{new Date(message.createdAt).toLocaleString()}</em>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
