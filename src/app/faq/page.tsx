import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <PagePlaceholder
      eyebrow="Answers"
      title="FAQ"
      lede="Lead times, delivery area, custom design process, allergens, deposits, and cancellation — the things most people ask before they order."
      milestone="Coming in M6 — content editable by admin from the dashboard"
    />
  );
}
