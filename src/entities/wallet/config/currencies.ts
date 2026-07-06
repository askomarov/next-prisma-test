export const SUPPORTED_CURRENCIES = [
  "RUB",
  "EUR",
  "USD",
  "GBP",
  "TRY",
  "KZT",
  "BYN",
  "CNY",
  "RSD"
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  EUR: "Евро (EUR)",
  RSD: "Сербский динар (RSD)",
  RUB: "Рубль (RUB)",
  USD: "Доллар (USD)",
  GBP: "Фунт (GBP)",
  TRY: "Лира (TRY)",
  KZT: "Тенге (KZT)",
  BYN: "Бел. рубль (BYN)",
  CNY: "Юань (CNY)",
};

export function isSupportedCurrency(value: string): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.includes(value as CurrencyCode);
}

export function formatMoney(
  amount: number | string,
  currency: string,
  kind?: "INCOME" | "EXPENSE",
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const formatted = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  if (kind === "INCOME") {
    return `+${formatted}`;
  }

  if (kind === "EXPENSE") {
    return `−${formatted}`;
  }

  return formatted;
}
