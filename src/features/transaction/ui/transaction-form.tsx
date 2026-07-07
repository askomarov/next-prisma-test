"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { formatMoney } from "@/entities/wallet";
import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
} from "@/entities/transaction";
import {
  Button,
  FormError,
  FormField,
  Input,
  Select,
} from "@/shared/ui/button";
import { createTransaction, updateTransaction } from "../api/actions";
import { transactionSchema, type TransactionInput } from "../model/schema";
import { transactionFormVariants } from "./transaction-form.variants";

export type TransactionFormValues = TransactionInput;

export const TransactionFormSuccessContext = createContext<(() => void) | null>(
  null,
);

type TransactionFormProps = {
  wallets: WalletOption[];
  categories: CategoryOption[];
  mode?: "create" | "edit";
  transactionId?: string;
  defaultValues?: TransactionFormValues;
};

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCreateDefaults(wallets: WalletOption[]): TransactionFormValues {
  return {
    walletId: wallets[0]?.id ?? "",
    kind: "EXPENSE",
    moneyType: "REAL",
    amount: Number.NaN,
    description: "",
    categoryId: "",
    occurredAt: new Date(),
  };
}

export function TransactionForm({
  wallets,
  categories,
  mode = "create",
  transactionId,
  defaultValues,
}: TransactionFormProps) {
  const onSuccess = useContext(TransactionFormSuccessContext);
  const isEdit = mode === "edit";
  const resolvedDefaults = defaultValues ?? buildCreateDefaults(wallets);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: resolvedDefaults,
  });

  const selectedWalletId = watch("walletId");
  const selectedKind = watch("kind");
  const selectedCategoryId = watch("categoryId");

  const selectedWallet = useMemo(
    () => wallets.find((wallet) => wallet.id === selectedWalletId),
    [wallets, selectedWalletId],
  );

  const availableCategories = useMemo(
    () => categories.filter((category) => category.kind === selectedKind),
    [categories, selectedKind],
  );

  useEffect(() => {
    if (
      selectedCategoryId &&
      !availableCategories.some(
        (category) => category.id === selectedCategoryId,
      )
    ) {
      setValue("categoryId", "");
    }
  }, [availableCategories, selectedCategoryId, setValue]);

  const onSubmit = async (data: TransactionFormValues) => {
    const result = isEdit
      ? await updateTransaction(transactionId!, data)
      : await createTransaction(data);

    if ("error" in result) {
      if (result.field) {
        setError(result.field, { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }

    if (isEdit) {
      onSuccess?.();
      return;
    }

    reset({
      walletId: data.walletId,
      kind: data.kind,
      moneyType: data.moneyType,
      amount: Number.NaN,
      description: "",
      categoryId: data.categoryId,
      occurredAt: new Date(),
    });
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={transactionFormVariants()}
    >
      <FormField error={errors.walletId?.message}>
        <Select
          error={Boolean(errors.walletId)}
          {...register("walletId", {
            onChange: () => clearErrors("walletId"),
          })}
        >
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name} ({wallet.currency})
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid gap-3 items-start sm:grid-cols-2">
        <FormField error={errors.kind?.message}>
          <Select
            error={Boolean(errors.kind)}
            {...register("kind", {
              onChange: () => clearErrors("kind"),
            })}
          >
            {Object.entries(TRANSACTION_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField error={errors.moneyType?.message}>
          <Select
            error={Boolean(errors.moneyType)}
            {...register("moneyType", {
              onChange: () => clearErrors("moneyType"),
            })}
          >
            {Object.entries(MONEY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField error={errors.categoryId?.message}>
        <Select
          error={Boolean(errors.categoryId)}
          {...register("categoryId", {
            onChange: () => clearErrors("categoryId"),
          })}
        >
          <option value="">Без категории</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid gap-3 items-start sm:grid-cols-2">
        <FormField error={errors.amount?.message} className="relative">
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder={
              selectedWallet ? `Сумма в ${selectedWallet.currency}` : "Сумма"
            }
            error={Boolean(errors.amount)}
            {...register("amount", {
              valueAsNumber: true,
              onChange: () => clearErrors("amount"),
            })}
          />
          {selectedWallet ? (
            <p className="mt-1 text-xs text-neutral-400">
              Пример: {formatMoney(100, selectedWallet.currency)}
            </p>
          ) : null}
        </FormField>

        <FormField error={errors.occurredAt?.message}>
          <Input
            type="date"
            error={Boolean(errors.occurredAt)}
            defaultValue={formatDateInputValue(resolvedDefaults.occurredAt)}
            {...register("occurredAt", {
              setValueAs: (value: string) =>
                value ? new Date(value) : resolvedDefaults.occurredAt,
              onChange: () => clearErrors("occurredAt"),
            })}
          />
        </FormField>
      </div>

      <FormField error={errors.description?.message}>
        <Input
          type="text"
          placeholder="Описание (необязательно)"
          error={Boolean(errors.description)}
          {...register("description", {
            onChange: () => clearErrors("description"),
          })}
        />
      </FormField>

      <Button type="submit" loading={isSubmitting} loadingText="Сохранение...">
        {isEdit ? "Сохранить" : "Добавить"}
      </Button>

      <FormError message={errors.root?.message} />
    </form>
  );
}
