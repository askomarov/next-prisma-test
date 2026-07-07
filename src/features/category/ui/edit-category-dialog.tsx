"use client";

import type { CategoryListItem } from "@/entities/category";
import { TRANSACTION_KIND_LABELS } from "@/entities/transaction";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { CategoryForm, CategoryFormSuccessContext } from "./category-form";
import { PenSquareIcon } from "lucide-react";

type EditCategoryDialogProps = {
  category: CategoryListItem;
};

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  return (
    <Dialog
      trigger={
        <Button type="button" className="w-auto">
          <PenSquareIcon />
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
