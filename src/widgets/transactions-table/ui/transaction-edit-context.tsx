"use client";

import { createContext } from "react";

export type TransactionEditContextValue = {
  editingTransactionId: string | null;
  setEditingTransactionId: (id: string | null) => void;
};

export const TransactionEditContext =
  createContext<TransactionEditContextValue | null>(null);
