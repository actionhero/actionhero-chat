import App from "next/app";
import Layout from "./../components/layout/main";

import { ErrorHandler } from "./../utils/errorHandler";
import { SuccessHandler } from "./../utils/successHandler";
import { SessionHandler } from "./../utils/sessionHandler";

import "swagger-ui/dist/swagger-ui.css";

export default class GrouparooApp extends App {
  constructor(props) {
    super(props);

    const successHandler = new SuccessHandler();
    const errorHandler = new ErrorHandler();
    const sessionHandler = new SessionHandler();

    this.state = {
      successHandler,
      errorHandler,
      sessionHandler,
    };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout {...this.state} {...pageProps}>
        <Component {...this.state} {...pageProps} />
      </Layout>
    );
  }
}
