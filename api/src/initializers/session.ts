import { api, action, Initializer, Connection, chatRoom } from "actionhero";
import { User } from "./../models/User";
import crypto from "crypto";

interface SessionData {
  id: number;
  csrfToken: string;
  createdAt: number;
}

declare module "actionhero" {
  export interface Api {
    session: {
      prefix: string;
      ttl: number;
      key: (connection: Connection) => string;
      load: (connection: Connection) => Promise<SessionData>;
      destroy: (connection: Connection) => Promise<void>;
      create: (connection: Connection, user: User) => Promise<SessionData>;
    };
  }
}

async function randomBytesAsync(bytes = 64) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (error, buf) => {
      if (error) {
        return reject(error);
      }
      return resolve(buf.toString("hex"));
    });
  });
}

const authenticatedUserMiddleware: action.ActionMiddleware = {
  name: "authenticated-user",
  global: false,
  priority: 1000,
  preProcessor: async (data) => {
    const connection: Connection = data.connection;

    const sessionData = await api.session.load(connection);
    if (!sessionData) {
      throw new Error("Please log in to continue");
    } else if (
      !data.params.csrfToken ||
      data.params.csrfToken !== sessionData.csrfToken
    ) {
      throw new Error("CSRF error");
    } else {
      const user = await User.findOne({
        where: { id: sessionData.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      data.session.data = sessionData;
      data.session.user = user;
    }
  },
};

const modelChatRoomMiddleware: chatRoom.ChatMiddleware = {
  name: "model chat room middleware",
  join: async (connection: Connection, room: string) => {
    if (!room.match(/^model:/)) {
      return;
    }

    const userId = parseInt(room.split(":")[1]);
    const sessionData = await api.session.load(connection);
    if (!sessionData) {
      throw new Error("Please log in to continue");
    } else if (userId !== sessionData.id) {
      throw new Error("That is not for you");
    }
  },
};

export class Session extends Initializer {
  constructor() {
    super();
    this.name = "session";
  }

  async initialize() {
    const redis = api.redis.clients.client;

    api.session = {
      prefix: "session",
      ttl: 60 * 60 * 24 * 30, // 1 month; in seconds

      key: (connection: Connection) => {
        return `${api.session.prefix}:${connection.fingerprint}`;
      },

      load: async (connection) => {
        const key = api.session.key(connection);
        const data = await redis.get(key);
        if (!data) {
          return false;
        }
        await redis.expire(key, api.session.ttl);
        return JSON.parse(data);
      },

      create: async (connection: Connection, user: User) => {
        const key = api.session.key(connection);
        const csrfToken = (await randomBytesAsync()).toString();

        const sessionData = {
          id: user.id,
          csrfToken: csrfToken,
          createdAt: new Date().getTime(),
        };

        await user.update({ lastLoginAt: new Date() });
        await redis.set(key, JSON.stringify(sessionData));
        await redis.expire(key, api.session.ttl);
        return sessionData;
      },

      destroy: async (connection: Connection) => {
        const key = api.session.key(connection);
        await redis.del(key);
      },
    };
  }

  async start() {
    action.addMiddleware(authenticatedUserMiddleware);
    chatRoom.addMiddleware(modelChatRoomMiddleware);
    api.params.globalSafeParams.push("csrfToken");
  }
}
