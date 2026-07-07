import Link from "next/link";
import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserWalletList } from "@/entities/wallet/server";
import { logout } from "@/features/auth/login";
import { cn } from "@/shared/lib/utils";
import { canViewUsers, requireAuthUserId } from "@/src/lib/auth/guards";
import type { SessionUser } from "@/src/lib/auth/types";
import { getAuthBarNavItems } from "../lib/auth-bar-nav";
import { AuthBarMobileMenu } from "./auth-bar-mobile-menu";
import {
  authBarDesktopNavVariants,
  authBarInnerVariants,
  authBarLinkVariants,
  authBarVariants,
  logoutButtonVariants,
} from "./auth-bar.variants";

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
    <header className={authBarVariants()}>
      <div className={authBarInnerVariants()}>
        <div className="sm:hidden">
          <AuthBarMobileMenu
            navItems={navItems}
            wallets={walletOptions}
            categories={categories}
          />
        </div>

        <nav className={authBarDesktopNavVariants()} aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={authBarLinkVariants()}>
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logout}>
          <button type="submit" className={cn(logoutButtonVariants())}>
            Выйти
          </button>
        </form>
      </div>
    </header>
  );
}
