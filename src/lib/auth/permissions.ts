// RBAC (Role-Based Access Control) permissions

export type Role = "admin" | "editor" | "viewer";

export type Permission =
  | "products:read"
  | "products:create"
  | "products:update"
  | "products:delete"
  | "products:publish"
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "blog:read"
  | "blog:create"
  | "blog:update"
  | "blog:delete"
  | "blog:publish"
  | "releases:read"
  | "releases:create"
  | "releases:update"
  | "releases:delete"
  | "messages:read"
  | "messages:update"
  | "settings:read"
  | "settings:update"
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "audit:read";

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "products:read", "products:create", "products:update", "products:delete", "products:publish",
    "projects:read", "projects:create", "projects:update", "projects:delete",
    "blog:read", "blog:create", "blog:update", "blog:delete", "blog:publish",
    "releases:read", "releases:create", "releases:update", "releases:delete",
    "messages:read", "messages:update",
    "settings:read", "settings:update",
    "users:read", "users:create", "users:update", "users:delete",
    "audit:read",
  ],
  editor: [
    "products:read", "products:create", "products:update", "products:publish",
    "projects:read", "projects:create", "projects:update",
    "blog:read", "blog:create", "blog:update", "blog:publish",
    "releases:read", "releases:create", "releases:update",
    "messages:read",
    "settings:read",
  ],
  viewer: [
    "products:read",
    "projects:read",
    "blog:read",
    "releases:read",
    "messages:read",
    "settings:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${permission} required for role ${role}`);
  }
}