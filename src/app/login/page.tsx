import { LoginForm } from "@/features/auth/login";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { Panel } from "@/shared/ui/panel";

export default function LoginPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Sign in" title="Log in to continue." />

      <Panel title="Account">
        <LoginForm />
      </Panel>
    </PageShell>
  );
}
