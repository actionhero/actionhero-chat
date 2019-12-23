import { Client } from "../client/client";
import { StorageMock } from "../utils/storageMock";
import { ErrorHandler } from "../utils/errorHandler";
import { SuccessHandler } from "../utils/successHandler";

export class BaseRepository {
  name: string;
  client: Client;
  storage: StorageMock;
  successHandler: SuccessHandler;
  errorHandler: ErrorHandler;
  responseKeys: Array<string>;
  key: string;
  apiBaseVersion: string | number;
  ttl: number;
  subscriptions: { [key: string]: any };
  includeParamsInRequests: Promise<void> | Function;
  loading: boolean;
  lastPublish: string;

  routes: {
    [key: string]: {
      verb: string;
      path: string | Function;
    };
  };

  constructor({ client, errorHandler, successHandler }) {
    let storage;
    //@ts-ignore
    if (typeof global !== "undefined" && global.localStorage) {
      //@ts-ignore
      storage = global.localStorage;
    } else if (typeof window !== "undefined" && window.localStorage) {
      storage = window.localStorage;
    } else {
      storage = new StorageMock();
    }

    this.name = "__base";
    this.client = client;
    this.storage = storage;
    this.responseKeys = [];
    this.key = undefined;
    this.errorHandler = errorHandler;
    this.successHandler = successHandler;
    this.apiBaseVersion = 1;
    this.ttl = 1000 * 60 * 5; // 5 minutes
    this.subscriptions = {};
    this.includeParamsInRequests = undefined;

    this.loading = false;
    this.lastPublish = null;

    this.routes = {
      get: {
        verb: "get",
        path: undefined
      },
      update: {
        verb: "put",
        path: undefined
      },
      destroy: {
        verb: "delete",
        path: undefined
      },
      create: {
        verb: "post",
        path: undefined
      }
    };
  }

  async sleep(wait = 1000) {
    return new Promise(resolve => {
      setTimeout(resolve, wait);
    });
  }

  async ensureNotParallel(next: Function, wait = 1000) {
    if (this.loading) {
      await this.sleep(wait);
      return this.ensureNotParallel(next, wait);
    }

    this.loading = true;
    try {
      return next();
    } finally {
      this.loading = false;
    }
  }

  async get(params?: object, showErrors = true) {
    const now = new Date().getTime();
    let response;
    try {
      response = JSON.parse(await this.storage.getItem(this.key));
    } catch (error) {}
    if (response && response.data && response.expiresAt > now) {
      return response.data;
    } else {
      try {
        response = await this.hydrate(params);
        return response;
      } catch (error) {
        if (this.errorHandler && showErrors) {
          this.errorHandler.set({ error: error.toString() });
        } else {
          throw error;
        }
      }
    }
  }

  async set(data?: object) {
    const now = new Date().getTime();
    const cleanedData = {};
    const keys = Object.keys(data);
    for (const i in keys) {
      const k = keys[i];
      if (this.responseKeys.indexOf(k) >= 0) {
        cleanedData[k] = data[k];
      }
    }

    if (this.key) {
      await this.storage.setItem(
        this.key,
        JSON.stringify({
          expiresAt: now + this.ttl,
          data: cleanedData
        })
      );
    }

    return cleanedData;
  }

  async remove() {
    if (this.key) {
      await this.storage.removeItem(this.key);
      await this.publish(null);
    }
  }

  async publish(data: object) {
    // to prevent loops of hydration, we should check the data we are publishing...
    // this will also help prevent publishing no-up updates
    const stringifiedData = JSON.stringify(data);
    if (stringifiedData === this.lastPublish) {
      return;
    }
    this.lastPublish = stringifiedData;

    const subscriptionKeys = Object.keys(this.subscriptions);
    for (const i in subscriptionKeys) {
      const key = subscriptionKeys[i];
      await this.subscriptions[key](data);
    }
  }

  async hydrate(params = {}) {
    return this.ensureNotParallel(async () => {
      params = await this.mergeAdditionalParams(params);
      try {
        const path = this.buildPath("get", params);
        const response = await this.client.action(
          this.routes.get.verb,
          path,
          params
        );
        const cleanedData = await this.set(response);
        await this.publish(cleanedData);
        return cleanedData;
      } catch (error) {
        const errorMessage = error.message
          ? error.message
          : `cannot hydrate ${this.name}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    });
  }

  async create(params = {}): Promise<any> {
    params = await this.mergeAdditionalParams(params);

    try {
      const path = this.buildPath("create", params);
      const response = await this.client.action(
        this.routes.create.verb,
        path,
        params
      );
      const cleanedData = await this.set(response);
      if (this.successHandler) {
        this.successHandler.set({ message: `Created ${this.name}` });
      }
      await this.publish(response);
      return cleanedData;
    } catch (error) {
      const errorMessage = error.message
        ? error.message
        : `cannot create ${this.name}`;
      if (this.errorHandler) {
        this.errorHandler.set({ error: errorMessage });
        return false;
      } else {
        throw error;
      }
    }
  }

  async update(params = {}) {
    params = await this.mergeAdditionalParams(params);

    try {
      const path = this.buildPath("update", params);
      const response = await this.client.action(
        this.routes.update.verb,
        path,
        params
      );
      this.set(response);
      if (this.successHandler) {
        this.successHandler.set({ message: `Updated ${this.name}` });
      }
      await this.publish(response);
      return response;
    } catch (error) {
      const errorMessage = error.message
        ? error.message
        : `cannot update ${this.name}`;
      if (this.errorHandler) {
        this.errorHandler.set({ error: errorMessage });
        return false;
      } else {
        throw error;
      }
    }
  }

  async destroy(params = {}) {
    params = await this.mergeAdditionalParams(params);

    try {
      const path = this.buildPath("destroy", params);
      await this.client.action(this.routes.destroy.verb, path, params);
      this.remove();
      if (this.successHandler) {
        this.successHandler.set({ message: `Destroyed ${this.name}` });
      }
      // await this.publish(response) // don't publish on destroy events
      return true;
    } catch (error) {
      const errorMessage = error.message
        ? error.message
        : `cannot remove ${this.name}`;
      if (this.errorHandler) {
        this.errorHandler.set({ error: errorMessage });
        return false;
      } else {
        throw error;
      }
    }
  }

  subscribe(name, handler) {
    this.subscriptions[name] = handler;
  }

  unsubscribe(name) {
    delete this.subscriptions[name];
  }

  async mergeAdditionalParams(params) {
    if (typeof this.includeParamsInRequests === "function") {
      const additionalParams = await this.includeParamsInRequests();
      for (const i in additionalParams) {
        params[i] = additionalParams[i];
      }
    }
    return params;
  }

  buildPath(verb: string, params: object) {
    if (typeof this.routes[verb].path === "function") {
      //@ts-ignore
      return this.routes[verb].path(params);
    } else {
      return this.routes[verb].path;
    }
  }
}
