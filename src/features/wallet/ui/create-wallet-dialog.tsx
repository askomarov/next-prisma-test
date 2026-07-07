"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogOnCloseContext } from "@/shared/ui/dialog";
import { WalletForm, WalletFormSuccessContext } from "./wallet-form";

export function CreateWalletDialog() {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => setFormKey((key) => key + 1);

  return (
    <DialogOnCloseContext.Provider value={resetForm}>
      <Dialog
        trigger={
          <Button type="button" className="w-auto">
            Новый кошелёк
          </Button>
        }
        title="Создать кошелёк"
      >
        {({ close }) => (
          <WalletFormSuccessContext.Provider
            value={() => {
              close();
              resetForm();
              router.refresh();
            }}
          >
            <WalletForm key={formKey} />
          </WalletFormSuccessContext.Provider>
        )}
      </Dialog>
    </DialogOnCloseContext.Provider>
  );
}
