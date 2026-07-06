import type { TransactionKind } from "@/src/generated/prisma/client";

export type CategoryOption = {
  id: string;
  name: string;
  kind: TransactionKind;
};

export type CategoryListItem = CategoryOption & {
  transactionCount: number;
};
