import { Component } from "react";
import ReactMarkdown from "react-markdown";
import Layout from "./../components/layout/main";

interface Props {
  content: string;
}

export default class IndexPage extends Component<Props> {
  static async getInitialProps() {
    const content = await require("./../../README.md");
    return {
      content: content.default
    };
  }

  render() {
    const { content } = this.props;

    return (
      <Layout title="Actionhero Chat">
        <ReactMarkdown source={content} />
      </Layout>
    );
  }
}
