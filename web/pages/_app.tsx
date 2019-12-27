import App from "next/app";
import Layout from "./../components/layout/main";

import { ErrorHandler } from "./../utils/errorHandler";
import { SuccessHandler } from "./../utils/successHandler";

export default class GrouparooApp extends App {
  constructor(props) {
    super(props);

    const successHandler = new SuccessHandler();
    const errorHandler = new ErrorHandler();

    this.state = {
      successHandler,
      errorHandler
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
