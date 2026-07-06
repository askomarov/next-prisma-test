import Link from "next/link";
import { getUserWalletList } from "@/entities/wallet/server";
import { Panel } from "@/shared/ui/panel";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { WalletsPanel } from "@/widgets/wallets-panel";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const { userId } = await requireAuthUserId();
  const wallets = await getUserWalletList(userId);

  return (
    <PageShell>
      <PageHero
        eyebrow="Финансы"
        title="Кошельки"
        lede="Управляйте кошельками в разных валютах."
      />

      <div className="mb-4">
        <WalletsPanel wallets={wallets} />
      </div>

      <Panel title="Разделы">
        <div className="grid gap-2 text-sm">
          <Link href="/finance/transactions" className="underline">
            Операции
          </Link>
          <Link href="/finance/categories" className="underline">
            Категории
          </Link>
        </div>
      </Panel>
    </PageShell>
  );
}
