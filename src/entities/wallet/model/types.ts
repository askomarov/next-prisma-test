export type WalletOption = {
  id: string;
  name: string;
  currency: string;
};

export type WalletListItem = WalletOption & {
  description: string | null;
  transactionCount: number;
};
