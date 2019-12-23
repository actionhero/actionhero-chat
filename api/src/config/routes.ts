export const DEFAULT = {
  routes: config => {
    return {
      get: [
        { path: "/:apiVersion/session", action: "session:view" },
        { path: "/:apiVersion/status", action: "status" }
      ],
      post: [{ path: "/:apiVersion/session", action: "session:create" }],
      delete: [{ path: "/:apiVersion/session", action: "session:destroy" }]
    };
  }
};
