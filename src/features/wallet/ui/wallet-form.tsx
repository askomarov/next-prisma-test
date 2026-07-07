"use client";

import { createContext, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CURRENCY_LABELS } from "@/entities/wallet";
import {
  Button,
  FormError,
  FormField,
  Input,
  Select,
} from "@/shared/ui/button";
import { createWallet, updateWallet } from "../api/actions";
import {
  walletSchema,
  walletUpdateSchema,
  type WalletInput,
  type WalletUpdateInput,
} from "../model/schema";
import { walletFormVariants } from "./wallet-form.variants";

export const WalletFormSuccessContext = createContext<(() => void) | null>(
  null,
);

type WalletFormProps = {
  mode?: "create" | "edit";
  walletId?: string;
  defaultValues?: WalletInput | WalletUpdateInput;
  currencyReadOnly?: boolean;
  currencyLabel?: string;
};

const createDefaults: WalletInput = {
  name: "",
  currency: "RUB",
  description: "",
};

export function WalletForm({
  mode = "create",
  walletId,
  defaultValues = createDefaults,
  currencyReadOnly = false,
  currencyLabel = "",
}: WalletFormProps) {
  const onSuccess = useContext(WalletFormSuccessContext);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<WalletInput | WalletUpdateInput>({
    resolver: zodResolver(isEdit ? walletUpdateSchema : walletSchema),
    defaultValues,
  });

  const onSubmit = async (data: WalletInput | WalletUpdateInput) => {
    if (isEdit && !walletId) {
      setError("root", { message: "Кошелёк не найден" });
      return;
    }

    const result = isEdit
      ? await updateWallet(walletId!, data as WalletUpdateInput)
      : await createWallet(data as WalletInput);

    if ("error" in result) {
      if (result.field) {
        setError(result.field, { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }

    if (!isEdit) {
      reset(createDefaults);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={walletFormVariants()}>
      <FormField error={errors.name?.message}>
        <Input
          type="text"
          placeholder="Название"
          error={Boolean(errors.name)}
          {...register("name", {
            onChange: () => clearErrors("name"),
          })}
        />
      </FormField>

      {isEdit && currencyReadOnly ? (
        <FormField>
          <Input type="text" value={currencyLabel} readOnly disabled />
        </FormField>
      ) : (
        <FormField
          error={"currency" in errors ? errors.currency?.message : undefined}
        >
          <Select
            error={Boolean("currency" in errors && errors.currency)}
            {...register("currency", {
              onChange: () => clearErrors("currency"),
            })}
          >
            {Object.entries(CURRENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormField>
      )}

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
        {isEdit ? "Сохранить" : "Создать"}
      </Button>

      <FormError message={errors.root?.message} />
    </form>
  );
}
