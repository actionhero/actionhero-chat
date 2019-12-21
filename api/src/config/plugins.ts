import { join } from "path";

export const DEFAULT = {
  plugins: () => {
    return {
      "ah-sequelize-plugin": {
        path: join(
          __dirname,
          "..",
          "..",
          "..",
          "node_modules",
          "ah-sequelize-plugin"
        )
      }
    };
  }
};
