import type { TransactionKind } from "@/src/generated/prisma/client";

type DefaultCategory = {
  name: string;
  kind: TransactionKind;
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "Продукты", kind: "EXPENSE" },
  { name: "Транспорт", kind: "EXPENSE" },
  { name: "Развлечения", kind: "EXPENSE" },
  { name: "Животные", kind: "EXPENSE" },
  { name: "Здоровье", kind: "EXPENSE" },
  { name: "ЖКХ", kind: "EXPENSE" },
  { name: "Одежда", kind: "EXPENSE" },
  { name: "Рестораны", kind: "EXPENSE" },
  { name: "Автомобиль", kind: "EXPENSE" },
  { name: "Образование", kind: "EXPENSE" },
  { name: "Подарки", kind: "EXPENSE" },
  { name: "Прочее", kind: "EXPENSE" },
  { name: "Зарплата", kind: "INCOME" },
  { name: "Подработка", kind: "INCOME" },
  { name: "Кэшбэк", kind: "INCOME" },
  { name: "Инвестиции", kind: "INCOME" },
  { name: "Подарки", kind: "INCOME" },
  { name: "Прочее", kind: "INCOME" },
];
