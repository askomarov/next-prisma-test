import { prisma } from "@/src/lib/prisma";

export async function getUserAssistantEnabled(
  userId: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { assistantEnabled: true },
  });

  return user?.assistantEnabled ?? false;
}
