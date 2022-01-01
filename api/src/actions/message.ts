import { Action, ParamsFrom } from "actionhero";
import { User } from "../models/User";
import { Message } from "../models/Message";

export class MessageCreate extends Action {
  name = "message:create";
  description = "send a message";
  outputExample = {};
  middleware = ["authenticated-user"];
  inputs = {
    userId: { required: true },
    message: { required: true },
  };

  async run({
    params,
    session,
  }: {
    params: ParamsFrom<MessageCreate>;
    session: { user: User };
  }) {
    const { user }: { user: User } = session;
    const otherUser = await User.findOne({
      where: { id: params.userId },
    });

    if (!otherUser) throw new Error("user not found");

    const message = await Message.create({
      toId: otherUser.id,
      fromId: user.id,
      message: params.message,
    });

    return { message: await message.apiData() };
  }
}
