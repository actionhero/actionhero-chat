import { Action, api } from "actionhero";
import { User } from "../models/User";

export class sessionCreate extends Action {
  constructor() {
    super();
    this.name = "session:create";
    this.description = "to create a session and sign in";
    this.inputs = {
      email: { required: true },
      password: { required: true }
    };
    this.outputExample = {};
  }

  async run({ connection, response, params }) {
    response.success = false;

    const user = await User.findOne({
      where: { email: params.email }
    });
    if (!user) {
      throw new Error("user not found");
    }

    const match = await user.checkPassword(params.password);
    if (!match) {
      throw new Error("password does not match");
    }

    const sessionData = await api.session.create(connection, user);
    response.user = await user.apiData();
    response.success = true;
    response.csrfToken = sessionData.csrfToken;
  }
}

export class sessionView extends Action {
  constructor() {
    super();
    this.name = "session:view";
    this.description = "to view session information";
    this.middleware = ["authenticated-user"];
    this.outputExample = {};
  }

  async run({ connection, response, session: { user } }) {
    const sessionData = await api.session.load(connection);
    response.csrfToken = sessionData.csrfToken;
    response.user = await user.apiData();
  }
}

export class sessionDestroy extends Action {
  constructor() {
    super();
    this.name = "session:destroy";
    this.description = "to destroy a session and sign out";
    this.outputExample = {};
  }

  async run({ connection, response }) {
    response.success = false;
    await api.session.destroy(connection);
    response.success = true;
  }
}
