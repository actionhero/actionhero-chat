export class SuccessHandler {
  message: string;
  subscriptions: {
    [key: string]: any;
  };

  constructor() {
    this.message = null;
    this.subscriptions = {};
  }

  set(message) {
    this.message = message;
    this.publish(message);
  }

  async publish(data) {
    const subscriptionKeys = Object.keys(this.subscriptions);
    for (const i in subscriptionKeys) {
      const key = subscriptionKeys[i];
      await this.subscriptions[key](data);
    }
  }

  subscribe(name, handler) {
    this.subscriptions[name] = handler;
  }

  unsubscribe(name) {
    delete this.subscriptions[name];
  }
}
