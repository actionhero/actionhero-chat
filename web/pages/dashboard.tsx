import { useState, useEffect } from "react";
import { Row, Col, Tab, ListGroup, Alert } from "react-bootstrap";
import { useApi } from "./../hooks/useApi";
import MessagesList from "./../components/messagesList";
import SendMessage from "./../components/sendMessage";
import { useChatStream } from "../hooks/useChatStream";

export default function Dashboard({ errorHandler }) {
  const { execApi } = useApi(errorHandler);
  const [conversations, setConversations] = useState<
    Array<{ userName: string; id: number }>
  >([]);
  const [user, setUser] = useState<{ id: number; userName: string }>({
    id: null,
    userName: null,
  });
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    loadUser();
    loadConversations();
    if (globalThis?.location?.hash.length === 0) setShowWelcome(true);
  }, []);

  useChatStream(user.id, handleMessage);

  async function loadConversations() {
    const response = await execApi(null, "/api/1/user/conversations", "get");
    setConversations(response?.conversations);
  }

  async function loadUser() {
    const response = await execApi(null, "/api/1/user", "get");
    setUser(response?.user);
  }

  function handleMessage({ message }) {
    const _messages = [...incomingMessages];
    _messages.push(message);
    setIncomingMessages(_messages);
  }

  return (
    <>
      <h1>{user.userName}'s Messages</h1>

      <Tab.Container
        id="list-group"
        defaultActiveKey={globalThis?.location?.hash}
        onSelect={() => setShowWelcome(false)}
      >
        <Row>
          <Col sm={3}>
            <ListGroup>
              {conversations.map((user) => (
                <ListGroup.Item
                  key={`tab-${user.id}`}
                  action
                  href={`#messages-${user.id}`}
                >
                  {user.userName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {conversations.map((user) => (
                <Tab.Pane
                  key={`#messages-${user.id}`}
                  eventKey={`#messages-${user.id}`}
                >
                  <MessagesList
                    errorHandler={errorHandler}
                    userId={user.id}
                    incomingMessages={incomingMessages}
                  />
                  <hr />
                  <SendMessage errorHandler={errorHandler} userId={user.id} />
                </Tab.Pane>
              ))}
            </Tab.Content>
            {showWelcome ? (
              <Alert variant="info">
                ◀️ Choose a Conversation to get Started!
              </Alert>
            ) : null}
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}
