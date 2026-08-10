"use client";

import { useMemo, useState } from "react";
import type { CategoryOption } from "@/entities/category";
import type { UserPreferences } from "@/entities/user-preferences";
import type { WalletOption } from "@/entities/wallet";
import {
  createTransaction,
  TransactionForm,
  type TransactionFormValues,
} from "@/features/transaction";

import type {
  CreateTransactionToolInput,
  CreateTransactionToolOutput,
} from "../model/types";

type TransactionPreviewCardProps = {
  input: CreateTransactionToolInput;
  wallets: WalletOption[];
  categories: CategoryOption[];
  preferences?: UserPreferences;
  onResolved: (output: CreateTransactionToolOutput) => void;
};

function toFormValues(
  input: CreateTransactionToolInput,
  fallbackWalletId: string,
): TransactionFormValues {
  const occurredAt = new Date(input.occurredAt);
  return {
    walletId: input.walletId || fallbackWalletId,
    kind: input.kind,
    moneyType: input.moneyType,
    amount: input.amount,
    description: input.description ?? "",
    occurredAt: Number.isNaN(occurredAt.getTime()) ? new Date() : occurredAt,
    categoryId: input.categoryId ?? "",
  };
}

export function TransactionPreviewCard({
  input,
  wallets,
  categories,
  preferences,
  onResolved,
}: TransactionPreviewCardProps) {
  const [resolved, setResolved] = useState(false);
  const walletsById = useMemo(
    () => new Map(wallets.map((wallet) => [wallet.id, wallet])),
    [wallets],
  );
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const defaultValues = useMemo(
    () => toFormValues(input, wallets[0]?.id ?? ""),
    [input, wallets],
  );

  if (resolved) {
    return null;
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-muted/30 p-3">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        Превью транзакции — проверь и подтверди
      </p>
      <TransactionForm
        wallets={wallets}
        categories={categories}
        preferences={preferences}
        defaultValues={defaultValues}
        submitLabel="Подтвердить"
        cancelLabel="Отклонить"
        resetOnSuccess={false}
        onCancel={() => {
          setResolved(true);
          onResolved({ success: false, cancelled: true });
        }}
        onSubmit={async (data) => {
          const result = await createTransaction(data);
          if ("error" in result) {
            return result;
          }

          const wallet = walletsById.get(data.walletId);
          const category = data.categoryId
            ? categoriesById.get(data.categoryId)
            : undefined;

          setResolved(true);
          onResolved({
            success: true,
            kind: data.kind,
            moneyType: data.moneyType,
            amount: data.amount,
            currency: wallet?.currency ?? null,
            walletName: wallet?.name ?? null,
            categoryName: category?.name ?? null,
            description: data.description || null,
            occurredAt: data.occurredAt.toISOString(),
          });
        }}
      />
    </div>
  );
}
