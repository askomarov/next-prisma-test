import "server-only";

import { prisma } from "@/src/lib/prisma";
import { getSession } from "./session";
import type { Role, SessionUser } from "./types";

export { canCreateUsers, canViewUsers, getHomePathForRole } from "./roles";

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const session = await requireAuth();

  if (!roles.includes(session.role)) {
    throw new Error("Forbidden");
  }

  return session;
}

async function resolveAuthUserId(session: SessionUser): Promise<string> {
  if (session.userId) {
    const userById = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (userById) {
      return userById.id;
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function requireAuthUserId(): Promise<{
  session: SessionUser;
  userId: string;
}> {
  const session = await requireAuth();
  const userId = await resolveAuthUserId(session);

  return { session, userId };
}
