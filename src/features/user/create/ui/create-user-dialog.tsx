"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogOnCloseContext } from "@/shared/ui/dialog";
import { CreateUserForm, CreateUserSuccessContext } from "./create-user-form";

export function CreateUserDialog() {
  const [formKey, setFormKey] = useState(0);

  const resetForm = () => setFormKey((key) => key + 1);

  return (
    <DialogOnCloseContext.Provider value={resetForm}>
      <Dialog
        trigger={
          <Button type="button" className="w-auto">
            Создать пользователя
          </Button>
        }
        title="Создать пользователя"
      >
        {({ close }) => (
          <CreateUserSuccessContext.Provider
            value={() => {
              close();
              resetForm();
            }}
          >
            <CreateUserForm key={formKey} />
          </CreateUserSuccessContext.Provider>
        )}
      </Dialog>
    </DialogOnCloseContext.Provider>
  );
}
