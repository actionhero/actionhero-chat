import Layout from "./../components/layout/main";
import ReactMarkdown from "react-markdown";

const { default: markdown } = require("./../../README.md");

export default function hello(props) {
  return (
    <Layout title="Actionhero Chat">
      <ReactMarkdown source={markdown} />
    </Layout>
  );
}
