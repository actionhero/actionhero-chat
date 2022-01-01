import { Action, api, chatRoom, Connection, ParamsFrom } from "actionhero";
import { User } from "../models/User";

export class SessionCreate extends Action {
  constructor() {
    super();
    this.name = "session:create";
    this.description = "to create a session and sign in";
    this.inputs = {
      email: { required: true },
      password: { required: true },
    };
    this.outputExample = {};
  }

  async run({
    connection,
    params,
  }: {
    connection: Connection;
    params: ParamsFrom<SessionCreate>;
  }) {
    const user = await User.findOne({
      where: { email: params.email },
    });
    if (!user) {
      throw new Error("user not found");
    }

    const match = await user.checkPassword(params.password);
    if (!match) {
      throw new Error("password does not match");
    }

    const sessionData = await api.session.create(connection, user);

    const room = `user:${user.id}`;
    if (!(await chatRoom.exists(room))) chatRoom.add(room);

    return {
      user: await user.apiData(),
      success: true,
      csrfToken: sessionData.csrfToken,
    };
  }
}

export class SessionView extends Action {
  constructor() {
    super();
    this.name = "session:view";
    this.description = "to view session information";
    this.middleware = ["authenticated-user"];
    this.outputExample = {};
  }

  async run({
    connection,
    session,
  }: {
    connection: Connection;
    session: { user: User };
  }) {
    const sessionData = await api.session.load(connection);
    return {
      csrfToken: sessionData.csrfToken,
      user: await session.user.apiData(),
    };
  }
}

export class SessionDestroy extends Action {
  constructor() {
    super();
    this.name = "session:destroy";
    this.description = "to destroy a session and sign out";
    this.outputExample = {};
  }

  async run({ connection }: { connection: Connection }) {
    await api.session.destroy(connection);
    return { success: true };
  }
}
