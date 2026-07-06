"use client";

import type { CategoryListItem } from "@/entities/category";
import { TRANSACTION_KIND_LABELS } from "@/entities/transaction";
import { Button } from "@/shared/ui";
import { Dialog } from "@/shared/ui/dialog";
import { CategoryForm, CategoryFormSuccessContext } from "./category-form";

type EditCategoryDialogProps = {
  category: CategoryListItem;
};

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  return (
    <Dialog
      trigger={
        <Button type="button" className="w-auto">
          Изменить
        </Button>
      }
      title="Редактировать категорию"
    >
      {({ close }) => (
        <CategoryFormSuccessContext.Provider value={close}>
          <CategoryForm
            key={category.id}
            mode="edit"
            categoryId={category.id}
            kindReadOnly
            kindLabel={TRANSACTION_KIND_LABELS[category.kind]}
            defaultValues={{ name: category.name }}
          />
        </CategoryFormSuccessContext.Provider>
      )}
    </Dialog>
  );
}
