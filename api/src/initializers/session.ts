import { api, action, Initializer, Connection } from "actionhero";
import { User } from "./../models/User";
import crypto from "crypto";

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
  preProcessor: async data => {
    const connection: Connection = data.connection;

    const sessionData = await api.session.load(connection);
    if (!sessionData) {
      throw new Error(connection.localize("Please log in to continue"));
    } else if (
      !data.params.csrfToken ||
      data.params.csrfToken !== sessionData.csrfToken
    ) {
      throw new Error(connection.localize("CSRF error"));
    } else {
      const user = await User.findOne({
        where: { id: sessionData.id }
      });

      if (!user) {
        throw new Error(connection.localize("User not found"));
      }

      data.session.data = sessionData;
      data.session.user = user;
    }
  }
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

      load: async connection => {
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
        const csrfToken = await randomBytesAsync();

        const sessionData = {
          id: user.id,
          csrfToken: csrfToken,
          createdAt: new Date().getTime()
        };

        await user.update({ lastLoginAt: new Date() });
        await redis.set(key, JSON.stringify(sessionData));
        await redis.expire(key, api.session.ttl);
        return sessionData;
      },

      destroy: async (connection: Connection) => {
        const key = api.session.key(connection);
        await redis.del(key);
      }
    };
  }

  async start() {
    action.addMiddleware(authenticatedUserMiddleware);
    api.params.globalSafeParams.push("csrfToken");
  }
}
