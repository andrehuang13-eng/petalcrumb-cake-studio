import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <PagePlaceholder
      eyebrow="Browse"
      title="Gallery"
      lede="A growing archive of cakes we've made — pressed-flower wedding tiers, sculpted birthday designs, baby and kids cakes, anniversaries, and small bakes."
      milestone="Coming in M3 — designs will populate from our catalog database"
    />
  );
}
