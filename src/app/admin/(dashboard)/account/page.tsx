import { requireAdmin } from "@/lib/dal";
import { AdminHeader } from "@/components/admin/ui";
import { PasswordForm } from "./password-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <div>
      <AdminHeader eyebrow="Security" title="Account" />
      <p className="text-ink-soft text-sm mb-8 max-w-prose">
        Signed in as <span className="text-ink">{admin.email}</span>. Change
        your password below.
      </p>
      <PasswordForm />
    </div>
  );
}
