import { Component } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { SuccessHandler } from "../../utils/successHandler";

interface Props {
  successHandler: SuccessHandler;
}

interface State {
  show: boolean;
  message: string;
  timer: NodeJS.Timeout;
  secondsToShow: number;
}

class SuccessAlert extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      message: null,
      timer: null,
      secondsToShow: 1000 * 5,
    };
  }

  componentDidMount() {
    const { successHandler } = this.props;
    successHandler.subscribe("success-alert", this.subscription.bind(this));
  }

  componentWillUnmount() {
    const { successHandler } = this.props;
    const { timer } = this.state;
    successHandler.unsubscribe("success-alert");
    clearTimeout(timer);
  }

  subscription({ message }) {
    const { secondsToShow } = this.state;
    const timer = setTimeout(() => {
      this.setState({ show: false });
    }, secondsToShow);

    this.setState({
      message,
      timer,
      show: true,
    });
  }

  format(message) {
    return message.toString();
  }

  handleHide() {
    this.setState({ show: false, message: null });
  }

  render() {
    const message = this.state.message;
    if (!message) {
      return null;
    }

    const formattedMessage = this.format(message);

    return (
      <Row>
        <Col>
          <Alert
            show={this.state.show}
            onClose={this.handleHide.bind(this)}
            dismissible
            variant="success"
          >
            {formattedMessage}
          </Alert>
        </Col>
      </Row>
    );
  }
}

export default SuccessAlert;
