import { PagePlaceholder } from "@/components/PagePlaceholder";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title };
}

export default async function CakeDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <PagePlaceholder
      eyebrow="Design"
      title={title}
      lede="A detailed view of this cake — gallery, size and flavor options, lead time, allergen notes, and a 'Request this design' form that pre-fills your enquiry."
      milestone="Coming in M3 — pulls real cake data from the database"
    />
  );
}
