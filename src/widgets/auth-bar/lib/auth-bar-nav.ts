export type AuthBarNavItem = {
  href: string;
  label: string;
};

export function getAuthBarNavItems(
  showUsers: boolean,
  showAssistant = false,
): AuthBarNavItem[] {
  return [
    ...(showUsers ? [{ href: "/", label: "Пользователи" }] : []),
    { href: "/finance", label: "Кошельки" },
    { href: "/finance/transactions", label: "Транзакции" },
    ...(showAssistant
      ? [{ href: "/finance/assistant", label: "Ассистент" }]
      : []),
    { href: "/finance/stats", label: "Статистика" },
    { href: "/finance/categories", label: "Категории" },
    { href: "/account", label: "Кабинет" },
  ];
}
