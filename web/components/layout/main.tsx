import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Head from "next/head";
import { SuccessHandler } from "../../utils/successHandler";
import { ErrorHandler } from "../../utils/errorHandler";

import SuccessAlert from "../alerts/success";
import ErrorAlert from "../alerts/error";
import Navigation from "../navigation";
import Footer from "../footer";

interface Props {
  title: string;
}

interface State {
  successHandler: SuccessHandler;
  errorHandler: ErrorHandler;
}

class Layout extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      successHandler: new SuccessHandler(),
      errorHandler: new ErrorHandler()
    };
  }

  render() {
    const { children, title } = this.props;
    const { successHandler, errorHandler } = this.state;

    return (
      <>
        <Head>
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <title>{title}</title>
          <meta
            name="application-name"
            content={`Actionhero Chat - ${title}`}
          />
        </Head>

        <Container>
          <SuccessAlert successHandler={successHandler} />
          <ErrorAlert errorHandler={errorHandler} />
          <Row>
            <Col>
              <br />
              <Navigation />
              <br />
              {React.Children.map(children, child =>
                //@ts-ignore
                React.cloneElement(child, { successHandler, errorHandler })
              )}
              <Footer errorHandler={errorHandler} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Layout;
