import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div>
      <AdminHeader
        eyebrow="Site content"
        title="Studio settings"
      />
      <p className="text-ink-soft text-sm mb-8 max-w-prose">
        Contact details shown in the site footer and on the contact page.
      </p>
      <SettingsForm
        initial={{
          email: settings?.email ?? "",
          phone: settings?.phone ?? "",
          address: settings?.address ?? "",
          openingHours: settings?.openingHours ?? "",
          instagramUrl: settings?.instagramUrl ?? "",
        }}
      />
    </div>
  );
}
