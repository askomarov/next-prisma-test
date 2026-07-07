import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";
import { DEFAULT_CATEGORIES } from "../src/entities/category/config/defaults";
import type { MoneyType, TransactionKind } from "../src/generated/prisma/client";

const DEMO_PASSWORD = "password123";

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date;
}

type DemoTransaction = {
  walletName: string;
  categoryName: string;
  kind: TransactionKind;
  moneyType: MoneyType;
  amount: string;
  description?: string;
  daysAgo: number;
};

const BOB_DEMO_TRANSACTIONS: DemoTransaction[] = [
  {
    walletName: "Основной",
    categoryName: "Зарплата",
    kind: "INCOME",
    moneyType: "REAL",
    amount: "125000.00",
    description: "Зарплата за месяц",
    daysAgo: 28,
  },
  {
    walletName: "Основной",
    categoryName: "Подработка",
    kind: "INCOME",
    moneyType: "REAL",
    amount: "18000.00",
    description: "Фриланс-проект",
    daysAgo: 14,
  },
  {
    walletName: "Основной",
    categoryName: "Кэшбэк",
    kind: "INCOME",
    moneyType: "VIRTUAL",
    amount: "1250.50",
    description: "Кэшбэк по карте",
    daysAgo: 7,
  },
  {
    walletName: "Основной",
    categoryName: "Продукты",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "4820.30",
    description: "Пятёрочка",
    daysAgo: 6,
  },
  {
    walletName: "Основной",
    categoryName: "Транспорт",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "890.00",
    description: "Метро и такси",
    daysAgo: 5,
  },
  {
    walletName: "Основной",
    categoryName: "Рестораны",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "3200.00",
    description: "Ужин с друзьями",
    daysAgo: 4,
  },
  {
    walletName: "Основной",
    categoryName: "ЖКХ",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "11500.00",
    description: "Коммуналка",
    daysAgo: 20,
  },
  {
    walletName: "Основной",
    categoryName: "Развлечения",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "2500.00",
    description: "Кино и попкорн",
    daysAgo: 3,
  },
  {
    walletName: "Основной",
    categoryName: "Одежда",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "6700.00",
    description: "Куртка",
    daysAgo: 12,
  },
  {
    walletName: "Основной",
    categoryName: "Здоровье",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "4100.00",
    description: "Стоматолог",
    daysAgo: 18,
  },
  {
    walletName: "Накопления",
    categoryName: "Инвестиции",
    kind: "INCOME",
    moneyType: "REAL",
    amount: "850.00",
    description: "Дивиденды ETF",
    daysAgo: 25,
  },
  {
    walletName: "Накопления",
    categoryName: "Прочее",
    kind: "INCOME",
    moneyType: "REAL",
    amount: "500.00",
    description: "Перевод с основного",
    daysAgo: 27,
  },
  {
    walletName: "Накопления",
    categoryName: "Образование",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "49.99",
    description: "Подписка на курсы",
    daysAgo: 10,
  },
  {
    walletName: "Накопления",
    categoryName: "Подарки",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "120.00",
    description: "Подарок на день рождения",
    daysAgo: 8,
  },
  {
    walletName: "Основной",
    categoryName: "Автомобиль",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "4500.00",
    description: "Заправка",
    daysAgo: 2,
  },
  {
    walletName: "Основной",
    categoryName: "Животные",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: "1890.00",
    description: "Корм и наполнитель",
    daysAgo: 1,
  },
];

async function seedBobDemoData(userId: string): Promise<void> {
  const categoryCount = await prisma.category.count({ where: { userId } });

  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        userId,
        name: category.name,
        kind: category.kind,
      })),
      skipDuplicates: true,
    });
  }

  const mainWallet = await prisma.wallet.upsert({
    where: { userId_name: { userId, name: "Основной" } },
    update: { currency: "RUB", description: "Повседневные расходы" },
    create: {
      userId,
      name: "Основной",
      currency: "RUB",
      description: "Повседневные расходы",
    },
  });

  const savingsWallet = await prisma.wallet.upsert({
    where: { userId_name: { userId, name: "Накопления" } },
    update: { currency: "USD", description: "Резерв и инвестиции" },
    create: {
      userId,
      name: "Накопления",
      currency: "USD",
      description: "Резерв и инвестиции",
    },
  });

  const walletsByName = {
    Основной: mainWallet.id,
    Накопления: savingsWallet.id,
  } as const;

  const existingTransactions = await prisma.transaction.count({ where: { userId } });

  if (existingTransactions > 0) {
    console.log(`Bob already has ${existingTransactions} transactions, skipping demo transactions.`);
    return;
  }

  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, kind: true },
  });

  const categoryByKey = new Map(
    categories.map((category) => [`${category.kind}:${category.name}`, category.id]),
  );

  await prisma.transaction.createMany({
    data: BOB_DEMO_TRANSACTIONS.map((transaction) => {
      const categoryId = categoryByKey.get(
        `${transaction.kind}:${transaction.categoryName}`,
      );

      if (!categoryId) {
        throw new Error(
          `Category not found for Bob demo data: ${transaction.kind} / ${transaction.categoryName}`,
        );
      }

      return {
        userId,
        walletId: walletsByName[transaction.walletName as keyof typeof walletsByName],
        categoryId,
        kind: transaction.kind,
        moneyType: transaction.moneyType,
        amount: transaction.amount,
        description: transaction.description ?? null,
        occurredAt: daysAgo(transaction.daysAgo),
      };
    }),
  });

  console.log(
    `Seeded Bob demo data: 2 wallets, ${BOB_DEMO_TRANSACTIONS.length} transactions.`,
  );
}

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

  const bob = users.find((user) => user.email === "bob@prisma.io");

  if (bob) {
    await seedBobDemoData(bob.id);
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
