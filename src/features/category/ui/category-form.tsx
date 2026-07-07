"use client";

import { createContext, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TRANSACTION_KIND_LABELS } from "@/entities/transaction";
import {
  Button,
  FormError,
  FormField,
  Input,
  Select,
} from "@/shared/ui/button";
import { createCategory, updateCategory } from "../api/actions";
import {
  categorySchema,
  categoryUpdateSchema,
  type CategoryInput,
  type CategoryUpdateInput,
} from "../model/schema";
import { categoryFormVariants } from "./category-form.variants";

export const CategoryFormSuccessContext = createContext<(() => void) | null>(
  null,
);

type CategoryFormProps = {
  mode?: "create" | "edit";
  categoryId?: string;
  defaultValues?: CategoryInput | CategoryUpdateInput;
  kindReadOnly?: boolean;
  kindLabel?: string;
};

const createDefaults: CategoryInput = {
  name: "",
  kind: "EXPENSE",
};

export function CategoryForm({
  mode = "create",
  categoryId,
  defaultValues = createDefaults,
  kindReadOnly = false,
  kindLabel = "",
}: CategoryFormProps) {
  const onSuccess = useContext(CategoryFormSuccessContext);
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput | CategoryUpdateInput>({
    resolver: zodResolver(isEdit ? categoryUpdateSchema : categorySchema),
    defaultValues,
  });

  const onSubmit = async (data: CategoryInput | CategoryUpdateInput) => {
    if (isEdit && !categoryId) {
      setError("root", { message: "Категория не найдена" });
      return;
    }

    const result = isEdit
      ? await updateCategory(categoryId!, data as CategoryUpdateInput)
      : await createCategory(data as CategoryInput);

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
    <form onSubmit={handleSubmit(onSubmit)} className={categoryFormVariants()}>
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

      {isEdit && kindReadOnly ? (
        <FormField>
          <Input type="text" value={kindLabel} readOnly disabled />
        </FormField>
      ) : (
        <FormField error={"kind" in errors ? errors.kind?.message : undefined}>
          <Select
            error={Boolean("kind" in errors && errors.kind)}
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
      )}

      <Button type="submit" loading={isSubmitting} loadingText="Сохранение...">
        {isEdit ? "Сохранить" : "Создать"}
      </Button>

      <FormError message={errors.root?.message} />
    </form>
  );
}
