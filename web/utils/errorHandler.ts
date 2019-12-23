export class ErrorHandler {
  error: Error | string;
  subscriptions: {
    [key: string]: any;
  };

  constructor() {
    this.error = null;
    this.subscriptions = {};
  }

  set(error) {
    this.error = error;
    this.publish(error);
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
