import { Component } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { ErrorHandler } from "../../utils/errorHandler";

interface Props {
  errorHandler: ErrorHandler;
}

interface State {
  show: boolean;
  error: Error | string;
  timer: NodeJS.Timeout;
  secondsToShow: number;
}

class ErrorAlert extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      error: null,
      timer: null,
      secondsToShow: 1000 * 5
    };
  }

  componentDidMount() {
    const { errorHandler } = this.props;
    errorHandler.subscribe("error-alert", this.subscription.bind(this));
  }

  componentWillUnmount() {
    const { errorHandler } = this.props;
    const { timer } = this.state;
    errorHandler.unsubscribe("error-alert");
    clearTimeout(timer);
  }

  subscription({ error }) {
    const { secondsToShow } = this.state;
    const timer = setTimeout(() => {
      this.setState({ show: false });
    }, secondsToShow);

    this.setState({
      error,
      timer,
      show: true
    });
  }

  format(error) {
    return error.toString();
  }

  handleHide() {
    this.setState({ show: false, error: null });
  }

  render() {
    const error = this.state.error;
    if (!error) {
      return null;
    }

    const formattedError = this.format(error);

    return (
      <Row>
        <Col>
          <Alert
            show={this.state.show}
            onClose={this.handleHide.bind(this)}
            dismissible
            variant="danger"
          >
            {formattedError}
          </Alert>
        </Col>
      </Row>
    );
  }
}

export default ErrorAlert;
