export type AuthBarNavItem = {
  href: string;
  label: string;
};

export function getAuthBarNavItems(showUsers: boolean): AuthBarNavItem[] {
  return [
    ...(showUsers ? [{ href: "/", label: "Пользователи" }] : []),
    { href: "/finance", label: "Кошельки" },
    { href: "/finance/transactions", label: "Операции" },
    { href: "/finance/stats", label: "Статистика" },
    { href: "/finance/categories", label: "Категории" },
  ];
}
