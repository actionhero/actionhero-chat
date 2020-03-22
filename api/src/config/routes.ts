export const DEFAULT = {
  routes: (config) => {
    return {
      get: [
        { path: "/:apiVersion/status", action: "status" },
        { path: "/:apiVersion/session", action: "session:view" },
        { path: "/:apiVersion/user", action: "user:view" },
      ],

      post: [
        { path: "/:apiVersion/session", action: "session:create" },
        { path: "/:apiVersion/user", action: "user:create" },
      ],

      put: [{ path: "/:apiVersion/user", action: "user:edit" }],

      delete: [{ path: "/:apiVersion/session", action: "session:destroy" }],
    };
  },
};
