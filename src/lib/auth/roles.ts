import type { Role } from "./types";

export function canViewUsers(role: Role): boolean {
  return role === "SUPER_ADMIN";
}

export function canCreateUsers(role: Role): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function getHomePathForRole(role: Role): string {
  return canViewUsers(role) ? "/" : "/finance";
}
