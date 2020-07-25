import { api, Initializer } from "actionhero";
import { User } from "./../models/User";
import { Message } from "./../models/Message";

const BOT_USERNAME = "actionhero-bot";
const BOT_EMAIL = "hello@actionherojs.com";

declare module "actionhero" {
  export interface Api {
    bot: {
      user: User;
      welcome: (user: User) => Promise<void>;
    };
  }
}

export class Bot extends Initializer {
  constructor() {
    super();
    this.name = "bot";
  }

  async initialize() {
    api.bot = {
      user: null,
      welcome: async (user) => {
        if (user.userName === BOT_USERNAME) return;

        await Message.store(api.bot.user, user, "Welcome to Actionhero Chat!");
        await Message.store(
          api.bot.user,
          user,
          "This is a pretty poor chat app... but a great example of using Actionhero with Next.js and Sequelize"
        );
        await Message.store(api.bot.user, user, "Have fun!");
        await Message.store(
          api.bot.user,
          user,
          "https://demo.actionherojs.com/public/logo/actionhero.png"
        );
      },
    };
  }

  async start() {
    // crete & load the bot user
    let user = await User.findOne({ where: { userName: BOT_USERNAME } });
    if (!user)
      user = await User.create({ userName: BOT_USERNAME, email: BOT_EMAIL });

    api.bot.user = user;
  }
}
