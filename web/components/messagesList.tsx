import { useState, useEffect, useRef } from "react";
import { useApi } from "./../hooks/useApi";
import { ListGroup, Image } from "react-bootstrap";

export default function MessagesList({
  errorHandler,
  userId,
  incomingMessages,
}) {
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
  const messagesEndRef = useRef(null);

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

  const combinedMessages = messages.concat(
    incomingMessages.filter((m) => m.toId === userId || m.fromId === userId)
  );

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, combinedMessages.length]);

  return (
    <div style={{ maxHeight: 700, overflow: "auto" }}>
      <ListGroup variant="flush">
        {combinedMessages.map((message) => (
          <ListGroup.Item
            key={`message-${message.id}`}
            variant={message.fromId === userId ? "success" : "info"}
          >
            <strong>{renderMessage(message.message)}</strong>
            <br /> <em>{new Date(message.createdAt).toLocaleString()}</em>
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
    </div>
  );
}
