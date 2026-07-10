import Link from "next/link";
import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserWalletList } from "@/entities/wallet/server";
import { logout } from "@/features/auth/login";
import { canViewUsers, requireAuthUserId } from "@/src/lib/auth/guards";
import type { SessionUser } from "@/src/lib/auth/types";
import { getAuthBarNavItems } from "../lib/auth-bar-nav";
import { AuthBarMobileMenu } from "./auth-bar-mobile-menu";
import { AuthBarNavLinks } from "./auth-bar-nav-links";
import { Button } from "@/src/shared/ui/button";
import { ThemeToggle } from "@/src/shared/ui/theme-toggle";

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
    <header className="border-b border-border bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 sticky top-0 z-1">
      <div className="mx-auto flex container justify-between items-center gap-3 py-3">
        <Link href="/">
          <img
            src="/images/app-icon-min.png"
            alt="logo"
            width={64}
            height={32}
            className="h-auto w-12 sm:w-16"
          />
        </Link>

        <div className="sm:hidden">
          <AuthBarMobileMenu
            navItems={navItems}
            wallets={walletOptions}
            categories={categories}
          />
        </div>

        <AuthBarNavLinks
          items={navItems}
          className="hidden items-center gap-3 sm:flex flex-wrap"
        />
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <form className="" action={logout}>
            <Button type="submit" variant="outline">
              Выйти
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
