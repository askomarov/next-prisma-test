import { LoginForm } from "@/features/auth/login";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { Panel } from "@/shared/ui/panel";

export default function LoginPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Вход" title="Вход в систему" />

      <Panel>
        <LoginForm />
      </Panel>
    </PageShell>
  );
}
