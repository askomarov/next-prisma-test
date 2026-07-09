import type { WalletListItem } from "@/entities/wallet";
import { getUserWalletList } from "@/entities/wallet/server";
import { EmptyState, Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { WalletsList, WalletsPanelActions } from "./wallets-panel";

type WalletsPanelProps = {
  wallets?: WalletListItem[];
};

export async function WalletsPanel({
  wallets: initialWallets,
}: WalletsPanelProps) {
  const { userId } = await requireAuthUserId();
  const wallets = initialWallets ?? (await getUserWalletList(userId));

  return (
    <Panel title="Кошельки" meta={<>{wallets.length} шт.</>}>
      <WalletsPanelActions />

      {wallets.length === 0 ? (
        <EmptyState className="text-center">
          Кошельков пока нет. Создайте первый — например, в евро.
        </EmptyState>
      ) : (
        <WalletsList wallets={wallets} />
      )}
    </Panel>
  );
}
