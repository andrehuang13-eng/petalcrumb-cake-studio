import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PagePlaceholder
      eyebrow="Get in touch"
      title="Contact"
      lede="Email, phone, studio address, and a short form for non-order questions. For cake requests, use the order form linked from any design."
      milestone="Coming in a later milestone — short contact form and studio map"
    />
  );
}
