const namespace = "next";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<typeof DEFAULT[typeof namespace]>;
  }
}

export const DEFAULT = {
  [namespace]: () => {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

    return {
      enabled: process.env.NEXT_DISABLED === "true" ? false : true,
      dev: process.env.NEXT_DEVELOPMENT_MODE
        ? process.env.NEXT_DEVELOPMENT_MODE === "false"
          ? false
          : true
        : env === "development",
      quiet: false,
    };
  },
};
