import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PagePlaceholder
      eyebrow="Studio"
      title="About"
      lede="The story of Maya and the studio — how Petalcrumb began, what we believe about bespoke baking, and how we work."
      milestone="Coming in a later milestone — founder story and studio values"
    />
  );
}
