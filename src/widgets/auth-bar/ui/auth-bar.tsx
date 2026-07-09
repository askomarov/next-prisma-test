import Link from "next/link";
import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserWalletList } from "@/entities/wallet/server";
import { logout } from "@/features/auth/login";
import { cn } from "@/shared/lib/utils";
import { canViewUsers, requireAuthUserId } from "@/src/lib/auth/guards";
import type { SessionUser } from "@/src/lib/auth/types";
import { getAuthBarNavItems } from "../lib/auth-bar-nav";
import { AuthBarMobileMenu } from "./auth-bar-mobile-menu";
import { Button } from "@/src/shared/ui/button";
import Image from "next/image";

type AuthBarProps = {
  session: SessionUser;
};

export async function AuthBar({ session }: AuthBarProps) {
  const showUsers = canViewUsers(session.role);
  const navItems = getAuthBarNavItems(showUsers);
  const { userId } = await requireAuthUserId();

  const [wallets, categories] = await Promise.all([
    getUserWalletList(userId),
    getUserCategoryOptions(userId),
  ]);

  const walletOptions = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    currency: wallet.currency,
  }));

  return (
    <header className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex container justify-between items-center gap-3 py-3">
        <Link href="/">
          <img
            src="/images/app-icon-min.png"
            alt="logo"
            width={64}
            height={32}
            className="h-auto"
          />
        </Link>
        <div className="sm:hidden">
          <AuthBarMobileMenu
            navItems={navItems}
            wallets={walletOptions}
            categories={categories}
          />
        </div>

        <nav
          className="hidden items-center gap-3 sm:flex"
          aria-label="Основная навигация"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-900 no-underline hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form className="hidden sm:flex" action={logout}>
          <Button type="submit" variant="outline">
            Выйти
          </Button>
        </form>
      </div>
    </header>
  );
}
