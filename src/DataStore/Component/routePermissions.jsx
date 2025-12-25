// src/rbac/routePermissions.js
export const routePermissions = {
  "/": { page: "Dashboard", action: "view" },
  "/pages": { page: "Pages", action: "view" },
  "/create-page": { page: "Pages", action: "create" },
  "/edit-page/:id": { page: "Pages", action: "edit" },
  "/roles": { page: "Roles", action: "view" },
  "/create-roles": { page: "Roles", action: "create" },
  "/edit-role/:id": { page: "Roles", action: "edit" },
};
