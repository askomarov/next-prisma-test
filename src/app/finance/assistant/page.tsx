import { AssistantChat } from "@/features/ai-assistant";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  await requireAuthUserId();

  return (
    <PageShell className="max-w-3xl">
      <PageHero
        eyebrow="Финансы"
        title="Ассистент"
        lede="Создавай транзакции использая ИИ помощника"
      />
      <AssistantChat />
    </PageShell>
  );
}
