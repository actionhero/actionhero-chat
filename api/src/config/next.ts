// learn more about the next.js app options here https://nextjs.org/docs/advanced-features/custom-server
import { env } from "actionhero";

export const DEFAULT = {
  next: () => {
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
