import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Head from "next/head";

import SuccessAlert from "../alerts/success";
import ErrorAlert from "../alerts/error";
import Navigation from "../navigation";
import Footer from "../footer";

interface Props {
  title: string;
  successHandler: any;
  errorHandler: any;
  sessionHandler: any;
}

class Layout extends Component<Props> {
  render() {
    const { children, successHandler, errorHandler, sessionHandler } =
      this.props;

    return (
      <>
        <Head>
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <title>Actionhero Chat</title>
          <meta name="application-name" content={`Actionhero Chat`} />{" "}
          <script src="/public/javascript/ActionheroWebsocketClient.min.js" />
        </Head>

        <Container>
          <Row>
            <Col>
              <br />
              <Navigation sessionHandler={sessionHandler} />
              <br />
              <SuccessAlert successHandler={successHandler} />
              <ErrorAlert errorHandler={errorHandler} />
              {children}
              <Footer errorHandler={errorHandler} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Layout;
