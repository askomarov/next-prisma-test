import { redirect } from "next/navigation";
import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserAssistantEnabled } from "@/entities/user/server";
import { getUserPreferences } from "@/entities/user-preferences/server";
import { getUserWalletOptions } from "@/entities/wallet/server";
import { AssistantChat } from "@/features/ai-assistant";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  const { userId } = await requireAuthUserId();
  const assistantEnabled = await getUserAssistantEnabled(userId);

  if (!assistantEnabled) {
    redirect("/finance");
  }

  const [wallets, categories, preferences] = await Promise.all([
    getUserWalletOptions(userId),
    getUserCategoryOptions(userId),
    getUserPreferences(userId),
  ]);

  return (
    <PageShell className="max-w-3xl">
      <PageHero
        eyebrow="Финансы"
        title="Ассистент"
        lede="Создавай транзакции использая ИИ помощника"
      />
      <AssistantChat
        wallets={wallets}
        categories={categories}
        preferences={preferences}
      />
    </PageShell>
  );
}
