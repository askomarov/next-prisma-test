"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogOnCloseContext } from "@/shared/ui/dialog";
import { CategoryForm, CategoryFormSuccessContext } from "./category-form";
import { PlusCircleIcon } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

export function CreateCategoryDialog({ className }: { className?: string }) {
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => setFormKey((key) => key + 1);

  return (
    <DialogOnCloseContext.Provider value={resetForm}>
      <Dialog
        trigger={
          <Button type="button" className={cn("w-auto", className)}>
            Создать <PlusCircleIcon />
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
