import { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Head from "next/head";
import { SuccessHandler } from "../../utils/successHandler";
import { ErrorHandler } from "../../utils/errorHandler";

import SuccessAlert from "../alerts/success";
import ErrorAlert from "../alerts/error";
import Navigation from "../navigation";

interface Props {
  title: string;
  successHandler: SuccessHandler;
  errorHandler: ErrorHandler;
}

class Layout extends Component<Props> {
  render() {
    const { children, title, successHandler, errorHandler } = this.props;

    return (
      <>
        <Head>
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <title>{title}</title>
          <meta name="application-name" content="Actionhero Chat" />
        </Head>

        <Container>
          <SuccessAlert successHandler={successHandler} />
          <ErrorAlert errorHandler={errorHandler} />
          <Row>
            <Col>
              <Navigation />
              {children}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Layout;
