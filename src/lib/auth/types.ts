export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type SessionUser = {
  userId?: string;
  email: string;
  role: Role;
};
