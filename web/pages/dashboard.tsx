import { useState, useEffect } from "react";
import { Row, Col, Tab, ListGroup } from "react-bootstrap";
import { useApi } from "./../hooks/useApi";
import MessagesList from "./../components/messagesList";

export default function Dashboard({ errorHandler }) {
  const [conversations, setConversations] = useState<
    Array<{ userName: string; id: number }>
  >([]);
  const { execApi } = useApi(errorHandler);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    const response = await execApi(null, "/api/1/user/conversations", "get");
    setConversations(response?.conversations);
  }

  return (
    <>
      <h1>Dashboard</h1>

      <Tab.Container
        id="list-group"
        defaultActiveKey={globalThis?.location?.hash}
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
                  <MessagesList errorHandler={errorHandler} userId={user.id} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}
