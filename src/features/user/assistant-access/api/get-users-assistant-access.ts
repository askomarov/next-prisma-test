import "server-only";

import { prisma } from "@/src/lib/prisma";
import type { UserAssistantAccess } from "../model/types";

export type { UserAssistantAccess };

export async function getUsersAssistantAccess(): Promise<
  UserAssistantAccess[]
> {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      assistantEnabled: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
