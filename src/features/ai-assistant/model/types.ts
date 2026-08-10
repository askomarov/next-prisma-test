export type CreateTransactionToolInput = {
  walletId: string;
  kind: "INCOME" | "EXPENSE";
  moneyType: "REAL" | "VIRTUAL";
  amount: number;
  description?: string | null;
  occurredAt: string;
  categoryId?: string | null;
};

export type CreateTransactionToolOutput =
  | {
      success: true;
      kind: "INCOME" | "EXPENSE";
      moneyType: "REAL" | "VIRTUAL";
      amount: number;
      currency: string | null;
      walletName: string | null;
      categoryName: string | null;
      description: string | null;
      occurredAt: string;
    }
  | {
      success: false;
      cancelled?: true;
      error?: string;
      field?: string;
    };
