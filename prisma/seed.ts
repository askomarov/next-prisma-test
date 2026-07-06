import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";

const DEMO_PASSWORD = "password123";

async function main() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@prisma.io" },
      update: {
        name: "Alice",
        role: "USER",
        passwordHash,
      },
      create: {
        email: "alice@prisma.io",
        name: "Alice",
        role: "USER",
        passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@prisma.io" },
      update: {
        name: "Bob",
        role: "ADMIN",
        passwordHash,
      },
      create: {
        email: "bob@prisma.io",
        name: "Bob",
        role: "ADMIN",
        passwordHash,
      },
    }),
  ]);

  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "";

  if (superAdminEmail && superAdminPassword) {
    const superAdminHash = await hashPassword(superAdminPassword);
    const superAdmin = await prisma.user.upsert({
      where: { email: superAdminEmail },
      update: {
        role: "SUPER_ADMIN",
        passwordHash: superAdminHash,
      },
      create: {
        email: superAdminEmail,
        passwordHash: superAdminHash,
        role: "SUPER_ADMIN",
      },
    });
    users.push(superAdmin);
  }

  console.log(`Seeded ${users.length} users.`);
  console.log(`Demo password for alice@prisma.io and bob@prisma.io: ${DEMO_PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
