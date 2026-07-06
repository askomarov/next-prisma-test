"use client";

import { createContext, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
} from "@/entities/transaction";
import { Button, FormError, FormField, Input, Select } from "@/shared/ui";
import { createTransaction, updateTransaction } from "../api/actions";
import { transactionSchema, type TransactionInput } from "../model/schema";
import { transactionFormVariants } from "./transaction-form.variants";

export type TransactionFormValues = TransactionInput;

export const TransactionFormSuccessContext = createContext<(() => void) | null>(
  null,
);

type TransactionFormProps = {
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

const createDefaults: TransactionFormValues = {
  kind: "EXPENSE",
  moneyType: "REAL",
  amount: Number.NaN,
  description: "",
  occurredAt: new Date(),
};

export function TransactionForm({
  mode = "create",
  transactionId,
  defaultValues = createDefaults,
}: TransactionFormProps) {
  const onSuccess = useContext(TransactionFormSuccessContext);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

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
      kind: data.kind,
      moneyType: data.moneyType,
      amount: Number.NaN,
      description: "",
      occurredAt: new Date(),
    });
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={transactionFormVariants()}
    >
      <div className="grid gap-3 sm:grid-cols-2">
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

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField error={errors.amount?.message}>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Сумма"
            error={Boolean(errors.amount)}
            {...register("amount", {
              valueAsNumber: true,
              onChange: () => clearErrors("amount"),
            })}
          />
        </FormField>

        <FormField error={errors.occurredAt?.message}>
          <Input
            type="date"
            error={Boolean(errors.occurredAt)}
            defaultValue={formatDateInputValue(defaultValues.occurredAt)}
            {...register("occurredAt", {
              setValueAs: (value: string) =>
                value ? new Date(value) : defaultValues.occurredAt,
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
