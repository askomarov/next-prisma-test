import { getUserPreferences } from "@/entities/user-preferences/server";
import { getUserWalletList } from "@/entities/wallet/server";
import { AssistantAccessForm } from "@/features/user/assistant-access";
import { getUsersAssistantAccess } from "@/features/user/assistant-access/server";
import { UserPreferencesForm } from "@/features/user-preferences";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { session, userId } = await requireAuthUserId();
  const isSuperAdmin = session.role === "SUPER_ADMIN";

  const [wallets, preferences, assistantUsers] = await Promise.all([
    getUserWalletList(userId),
    getUserPreferences(userId),
    isSuperAdmin ? getUsersAssistantAccess() : Promise.resolve([]),
  ]);

  const walletOptions = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    currency: wallet.currency,
  }));

  return (
    <PageShell>
      <PageHero
        eyebrow="Аккаунт"
        title="Личный кабинет"
        lede="Настройки по умолчанию для формы создания транзакций."
      />

      <Panel title="Дефолты транзакций">
        {walletOptions.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Сначала создайте кошелёк — потом можно выбрать его здесь по
            умолчанию.
          </p>
        ) : null}
        <UserPreferencesForm
          wallets={walletOptions}
          preferences={preferences}
        />
      </Panel>

      {isSuperAdmin ? (
        <Panel className="mt-4" title="Доступ к ассистенту">
          <AssistantAccessForm users={assistantUsers} />
        </Panel>
      ) : null}
    </PageShell>
  );
}
