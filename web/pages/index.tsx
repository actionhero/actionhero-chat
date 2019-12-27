import { Component } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export default class Index extends Component<Props> {
  static async getInitialProps() {
    const content = await require("./../../README.md");
    return {
      content: content.default
    };
  }

  render() {
    const { content } = this.props;
    return <ReactMarkdown source={content} />;
  }
}
