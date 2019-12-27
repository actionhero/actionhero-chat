import { Action } from "actionhero";
import { User } from "./../models/User";

export class UserCreate extends Action {
  constructor() {
    super();
    this.name = "user:create";
    this.description = "create a user";
    this.outputExample = {};
    this.inputs = {
      email: { required: true },
      password: { required: true },
      userName: { required: true }
    };
  }

  async run({ connection, params, response }) {
    const existingUserByEmail = await User.findOne({
      where: { email: params.email }
    });
    if (existingUserByEmail) {
      throw new Error(
        connection.localize("Email already registered. Sign in?")
      );
    }

    const existingUserByUserName = await User.findOne({
      where: { userName: params.userName }
    });
    if (existingUserByUserName) {
      throw new Error(connection.localize("User Name already registered."));
    }

    const user = await User.create({
      email: params.email,
      userName: params.userName
    });

    await user.updatePassword(params.password);
    response.user = await user.apiData();
  }
}

export class UserView extends Action {
  constructor() {
    super();
    this.name = "user:view";
    this.description = "view your user information";
    this.outputExample = {};
    this.inputs = {};
    this.middleware = ["authenticated-user"];
  }

  async run({ session, response }) {
    const { user } = session;
    response.user = await user.apiData();
  }
}

export class UserEdit extends Action {
  constructor() {
    super();
    this.name = "user:edit";
    this.description = "edit your user information";
    this.outputExample = {};
    this.inputs = {};
    this.middleware = ["authenticated-user"];
    this.inputs = {
      email: { required: false },
      password: { required: false },
      userName: { required: false }
    };
  }

  async run({ params, session, response }) {
    const { user } = session;
    await user.update(params);

    if (params.password) {
      await user.updatePassword(params.password);
    }

    response.user = await user.apiData();
  }
}
