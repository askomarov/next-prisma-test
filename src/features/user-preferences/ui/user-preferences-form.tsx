"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UserPreferences } from "@/entities/user-preferences";
import type { WalletOption } from "@/entities/wallet";
import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
} from "@/entities/transaction";
import {
  Button,
  FormError,
  FormField,
  Select,
} from "@/shared/ui/button";
import { updateUserPreferences } from "../api/actions";
import {
  userPreferencesSchema,
  type UserPreferencesInput,
} from "../model/schema";
import { userPreferencesFormVariants } from "./user-preferences-form.variants";

type UserPreferencesFormProps = {
  wallets: WalletOption[];
  preferences: UserPreferences;
};

function toFormValues(preferences: UserPreferences): UserPreferencesInput {
  return {
    defaultWalletId: preferences.defaultWalletId ?? "",
    defaultMoneyType: preferences.defaultMoneyType ?? "",
    defaultKind: preferences.defaultKind ?? "",
  };
}

export function UserPreferencesForm({
  wallets,
  preferences,
}: UserPreferencesFormProps) {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserPreferencesInput>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: toFormValues(preferences),
  });

  const onSubmit = async (data: UserPreferencesInput) => {
    setSaved(false);
    const result = await updateUserPreferences(data);

    if ("error" in result) {
      if (result.field) {
        setError(result.field, { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }

    setSaved(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={userPreferencesFormVariants()}
    >
      <FormField error={errors.defaultWalletId?.message}>
        <label className="mb-1 block text-sm text-neutral-500">
          Кошелёк по умолчанию
        </label>
        <Select
          error={Boolean(errors.defaultWalletId)}
          {...register("defaultWalletId", {
            onChange: () => {
              clearErrors("defaultWalletId");
              setSaved(false);
            },
          })}
        >
          <option value="">Не задан</option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name} ({wallet.currency})
            </option>
          ))}
        </Select>
      </FormField>

      <FormField error={errors.defaultMoneyType?.message}>
        <label className="mb-1 block text-sm text-neutral-500">
          Тип денег
        </label>
        <Select
          error={Boolean(errors.defaultMoneyType)}
          {...register("defaultMoneyType", {
            onChange: () => {
              clearErrors("defaultMoneyType");
              setSaved(false);
            },
          })}
        >
          <option value="">Не задан</option>
          {Object.entries(MONEY_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField error={errors.defaultKind?.message}>
        <label className="mb-1 block text-sm text-neutral-500">
          Тип транзакции (необязательно)
        </label>
        <Select
          error={Boolean(errors.defaultKind)}
          {...register("defaultKind", {
            onChange: () => {
              clearErrors("defaultKind");
              setSaved(false);
            },
          })}
        >
          <option value="">Не задан</option>
          {Object.entries(TRANSACTION_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      <Button type="submit" loading={isSubmitting} loadingText="Сохранение...">
        Сохранить
      </Button>

      {saved ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Настройки сохранены
        </p>
      ) : null}

      <FormError message={errors.root?.message} />
    </form>
  );
}
