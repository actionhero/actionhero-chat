import { Action } from "actionhero";
import { User } from "../models/User";
import { Message } from "../models/Message";

export class MessageCreate extends Action {
  constructor() {
    super();
    this.name = "message:create";
    this.description = "send a message";
    this.outputExample = {};
    this.inputs = {};
    this.middleware = ["authenticated-user"];
    this.inputs = {
      userId: { required: true },
      message: { required: true },
    };
  }

  async run({ params, session }) {
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
