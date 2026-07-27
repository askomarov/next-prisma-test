import type { UserPreferences } from "../model/types";
import { EMPTY_USER_PREFERENCES } from "../model/types";

export async function getUserPreferences(
  userId: string,
): Promise<UserPreferences> {
  const { prisma } = await import("@/src/lib/prisma");

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId },
    select: {
      defaultWalletId: true,
      defaultMoneyType: true,
      defaultKind: true,
    },
  });

  if (!preferences) {
    return EMPTY_USER_PREFERENCES;
  }

  return preferences;
}
