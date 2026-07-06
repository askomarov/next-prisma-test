"use client";

import { useState } from "react";
import { Button } from "@/shared/ui";
import { Dialog, DialogOnCloseContext } from "@/shared/ui/dialog";
import { CategoryForm, CategoryFormSuccessContext } from "./category-form";

export function CreateCategoryDialog() {
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => setFormKey((key) => key + 1);

  return (
    <DialogOnCloseContext.Provider value={resetForm}>
      <Dialog
        trigger={
          <Button type="button" className="w-auto">
            Новая категория
          </Button>
        }
        title="Создать категорию"
      >
        {({ close }) => (
          <CategoryFormSuccessContext.Provider
            value={() => {
              close();
              resetForm();
            }}
          >
            <CategoryForm key={formKey} />
          </CategoryFormSuccessContext.Provider>
        )}
      </Dialog>
    </DialogOnCloseContext.Provider>
  );
}
