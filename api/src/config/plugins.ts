import { PluginConfig } from "actionhero";
import { join } from "path";

const namespace = "plugins";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<typeof DEFAULT[typeof namespace]>;
  }
}

export const DEFAULT: { [namespace]: () => PluginConfig } = {
  [namespace]: () => {
    return {
      "ah-sequelize-plugin": {
        path: join(
          __dirname,
          "..",
          "..",
          "..",
          "node_modules",
          "ah-sequelize-plugin"
        ),
      },
      "ah-next-plugin": {
        path: join(
          __dirname,
          "..",
          "..",
          "..",
          "node_modules",
          "ah-next-plugin"
        ),
      },
    };
  },
};
