import { Action, api } from "actionhero";
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
      userName: { required: true },
    };
  }

  async run({ connection, params }) {
    const existingUserByEmail = await User.findOne({
      where: { email: params.email },
    });
    if (existingUserByEmail) {
      throw new Error("Email already registered. Sign in?");
    }

    const existingUserByUserName = await User.findOne({
      where: { userName: params.userName },
    });
    if (existingUserByUserName) {
      throw new Error("User Name already registered.");
    }

    const user = await User.create({
      email: params.email,
      userName: params.userName,
    });

    await user.updatePassword(params.password);

    await api.bot.welcome(user);

    return { user: await user.apiData(true) };
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

  async run({ session }) {
    const { user }: { user: User } = session;
    return { user: await user.apiData(true) };
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
      userName: { required: false },
    };
  }

  async run({ params, session }) {
    const { user }: { user: User } = session;
    await user.update(params);

    if (params.password) {
      await user.updatePassword(params.password);
    }

    return { user: await user.apiData(true) };
  }
}

export class UserConversations extends Action {
  constructor() {
    super();
    this.name = "user:conversations";
    this.description = "get the list of other users you are chatting with";
    this.outputExample = {};
    this.inputs = {};
    this.middleware = ["authenticated-user"];
    this.inputs = {};
  }

  async run({ session }) {
    const { user }: { user: User } = session;
    const conversations = await user.conversations();

    return {
      conversations: await Promise.all(
        conversations.map((user) => user.apiData())
      ),
      unreadConversations: await user.unreadConversations(),
    };
  }
}

export class UserMessages extends Action {
  constructor() {
    super();
    this.name = "user:messages";
    this.description = "get the messages between you and another user";
    this.outputExample = {};
    this.inputs = {};
    this.middleware = ["authenticated-user"];
    this.inputs = {
      userId: { required: true },
      limit: { required: false, default: 1000 },
      offset: { required: false, default: 0 },
    };
  }

  async run({ params, session }) {
    const { user }: { user: User } = session;
    const otherUser = await User.findOne({
      where: { id: params.userId },
    });

    if (!otherUser) throw new Error("user not found");

    const messages = await user.messages(
      otherUser,
      params.limit,
      params.offset
    );

    return {
      messages: await Promise.all(messages.map((message) => message.apiData())),
    };
  }
}
