export const DEFAULT = {
  routes: () => {
    // prettier-ignore
    return {
      get: [
        { path: "/:apiVersion/status", action: "status" },
        { path: "/:apiVersion/session", action: "session:view" },
        { path: "/:apiVersion/user", action: "user:view" },
        { path: "/:apiVersion/user/conversations", action: "user:conversations" },
        { path: "/:apiVersion/user/messages", action: "user:messages" },
        { path: "/:apiVersion/swagger", action: "swagger" },
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
