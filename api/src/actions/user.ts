import { Action, api, ParamsFrom } from "actionhero";
import { User } from "./../models/User";

export class UserCreate extends Action {
  name = "user:create";
  description = "create a user";
  outputExample = {};
  inputs = {
    email: { required: true },
    password: { required: true },
    userName: { required: true },
  };

  async run({ params }: { params: ParamsFrom<UserCreate> }) {
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
  name = "user:view";
  description = "view your user information";
  outputExample = {};
  inputs = {};
  middleware = ["authenticated-user"];

  async run({ session }: { session: { user: User } }) {
    const { user } = session;
    return { user: await user.apiData(true) };
  }
}

export class UserEdit extends Action {
  name = "user:edit";
  description = "edit your user information";
  outputExample = {};
  middleware = ["authenticated-user"];
  inputs = {
    email: { required: false },
    password: { required: false },
    userName: { required: false },
  };

  async run({
    params,
    session,
  }: {
    params: ParamsFrom<UserEdit>;
    session: { user: User };
  }) {
    const { user } = session;
    await user.update(params);

    if (params.password) {
      await user.updatePassword(params.password);
    }

    return { user: await user.apiData(true) };
  }
}

export class UserConversations extends Action {
  name = "user:conversations";
  description = "get the list of other users you are chatting with";
  outputExample = {};
  middleware = ["authenticated-user"];

  async run({ session }: { session: { user: User } }) {
    const { user } = session;
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
  name = "user:messages";
  description = "get the messages between you and another user";
  outputExample = {};
  middleware = ["authenticated-user"];
  inputs = {
    userId: { required: true, formatter: parseInt },
    limit: { required: false, default: 1000, formatter: parseInt },
    offset: { required: false, default: 0, formatter: parseInt },
  };

  async run({
    params,
    session,
  }: {
    params: ParamsFrom<UserMessages>;
    session: { user: User };
  }) {
    const { user } = session;
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
