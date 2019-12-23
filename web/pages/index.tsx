import Layout from "./../components/layout/main";
import { SuccessHandler } from "./../utils/successHandler";
import { ErrorHandler } from "./../utils/errorHandler";

export default function hello(props) {
  const successHandler = new SuccessHandler();
  const errorHandler = new ErrorHandler();

  return (
    <Layout
      title="Actionhero Chat"
      successHandler={successHandler}
      errorHandler={errorHandler}
      {...props}
    >
      <h1>Hello World</h1>
    </Layout>
  );
}
