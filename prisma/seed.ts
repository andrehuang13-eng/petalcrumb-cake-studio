import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// Sample data — Petalcrumb Cake Studio
// ============================================================

const categoryData = [
  { name: "Wedding Cakes", slug: "wedding-cakes" },
  { name: "Birthday Cakes", slug: "birthday-cakes" },
  { name: "Baby & Kids", slug: "baby-kids" },
  { name: "Celebrations & Anniversaries", slug: "celebrations-anniversaries" },
  { name: "Cupcakes & Bites", slug: "cupcakes-bites" },
];

type CakeSeed = {
  title: string;
  slug: string;
  categorySlug: string;
  description: string;
  basePriceCents: number;
  leadTimeDays: number;
  allergenNotes: string;
  featured: boolean;
  flavors: string[];
  sizes: { label: string; priceCents: number }[];
  imageAlt: string;
};

const cakeData: CakeSeed[] = [
  {
    title: "Pressed Petal",
    slug: "pressed-petal",
    categorySlug: "wedding-cakes",
    description:
      "A three-tier ivory buttercream cake finished with edible pressed flowers — daisies, cornflowers, and rose petals set against ribbon-clean panels. Designed for outdoor summer weddings, but adapted to any palette on request.",
    basePriceCents: 28000,
    leadTimeDays: 14,
    allergenNotes:
      "Contains gluten, eggs, dairy. Edible flowers are non-toxic. Gluten-free option available with 7 extra days notice.",
    featured: true,
    flavors: ["Vanilla bean", "Lemon elderflower", "Almond raspberry"],
    sizes: [
      { label: "3-tier (serves 60)", priceCents: 28000 },
      { label: "4-tier (serves 100)", priceCents: 38000 },
    ],
    imageAlt:
      "Three-tier ivory wedding cake decorated with pressed wildflowers",
  },
  {
    title: "Honeycomb Hive",
    slug: "honeycomb-hive",
    categorySlug: "wedding-cakes",
    description:
      "Geometric honeycomb tiers in ivory and warm cream, finished with hand-applied gold leaf. The honeycomb pattern is sculpted from royal icing — no two cakes alike.",
    basePriceCents: 32000,
    leadTimeDays: 14,
    allergenNotes:
      "Contains gluten, eggs, dairy. May contain traces of nuts.",
    featured: false,
    flavors: ["Honey vanilla", "Earl Grey", "Chestnut"],
    sizes: [
      { label: "3-tier (serves 80)", priceCents: 32000 },
      { label: "5-tier (serves 150)", priceCents: 55000 },
    ],
    imageAlt: "Geometric honeycomb wedding cake with gold leaf accents",
  },
  {
    title: "Confetti Dream",
    slug: "confetti-dream",
    categorySlug: "birthday-cakes",
    description:
      "Rainbow funfetti sponge layered with vanilla buttercream and a hand-piped sprinkle drip. The cake everyone wants to slice.",
    basePriceCents: 8500,
    leadTimeDays: 5,
    allergenNotes:
      "Contains gluten, eggs, dairy. Made in a kitchen that handles nuts.",
    featured: false,
    flavors: ["Vanilla funfetti", "Strawberry funfetti", "Chocolate funfetti"],
    sizes: [
      { label: "6-inch round (serves 10)", priceCents: 8500 },
      { label: "8-inch round (serves 20)", priceCents: 12000 },
    ],
    imageAlt: "Rainbow funfetti birthday cake with sprinkle drip",
  },
  {
    title: "Velvet Crown",
    slug: "velvet-crown",
    categorySlug: "birthday-cakes",
    description:
      "Dark chocolate sponge with raspberry compote and dark chocolate ganache. A small hand-painted gold crown sits on top — bring a name or short message and we'll write it in.",
    basePriceCents: 9500,
    leadTimeDays: 5,
    allergenNotes: "Contains gluten, eggs, dairy.",
    featured: true,
    flavors: ["Dark chocolate", "Black forest", "Tiramisu"],
    sizes: [
      { label: "6-inch round (serves 10)", priceCents: 9500 },
      { label: "8-inch round (serves 20)", priceCents: 13500 },
    ],
    imageAlt:
      "Dark chocolate birthday cake with raspberry filling and a gold crown topper",
  },
  {
    title: "Little Cloud",
    slug: "little-cloud",
    categorySlug: "baby-kids",
    description:
      "A pastel cloud cake — soft sky-blue or pink, lightly piped to look like clouds, with sugar stars scattered above. Built for first birthdays and christenings.",
    basePriceCents: 7500,
    leadTimeDays: 5,
    allergenNotes:
      "Contains gluten, eggs, dairy. Egg-free option available with notice.",
    featured: false,
    flavors: ["Vanilla cloud", "Banana custard", "White chocolate"],
    sizes: [
      { label: "6-inch round (serves 10)", priceCents: 7500 },
      { label: "8-inch round (serves 20)", priceCents: 10500 },
    ],
    imageAlt: "Pastel cloud-shaped cake with sugar stars for a first birthday",
  },
  {
    title: "Safari Storybook",
    slug: "safari-storybook",
    categorySlug: "baby-kids",
    description:
      "A buttercream cake hand-painted with safari animals around the side — lions, giraffes, elephants, and birds. We can match a specific storybook on request.",
    basePriceCents: 12000,
    leadTimeDays: 7,
    allergenNotes:
      "Contains gluten, eggs, dairy. Painted finish uses edible food colour only.",
    featured: false,
    flavors: ["Vanilla", "Chocolate", "Banana caramel"],
    sizes: [
      { label: "8-inch round (serves 20)", priceCents: 12000 },
      { label: "10-inch round (serves 40)", priceCents: 18000 },
    ],
    imageAlt: "Buttercream cake hand-painted with safari animals around the side",
  },
  {
    title: "Anniversary Bloom",
    slug: "anniversary-bloom",
    categorySlug: "celebrations-anniversaries",
    description:
      "Two-tier cake finished with hand-made sugar peonies in pastel pinks and creams. Designed for golden, silver, and ruby anniversaries — the colour palette adapts.",
    basePriceCents: 18000,
    leadTimeDays: 10,
    allergenNotes:
      "Contains gluten, eggs, dairy. Pistachio version contains nuts.",
    featured: true,
    flavors: ["Champagne rose", "Pistachio rose", "Lavender honey"],
    sizes: [
      { label: "2-tier (serves 30)", priceCents: 18000 },
      { label: "3-tier (serves 60)", priceCents: 26000 },
    ],
    imageAlt: "Two-tier anniversary cake with hand-made sugar peonies",
  },
  {
    title: "Coffee Cardamom Cupcakes",
    slug: "coffee-cardamom-cupcakes",
    categorySlug: "cupcakes-bites",
    description:
      "Espresso-soaked sponge with cardamom buttercream and a fine crumb of demerara on top. Sold in boxes of twelve. A favourite at autumn weddings as a dessert station.",
    basePriceCents: 4200,
    leadTimeDays: 3,
    allergenNotes: "Contains gluten, eggs, dairy, caffeine.",
    featured: true,
    flavors: ["Espresso cardamom"],
    sizes: [
      { label: "Box of 12", priceCents: 4200 },
      { label: "Box of 24", priceCents: 7800 },
    ],
    imageAlt:
      "Box of twelve espresso cardamom cupcakes with demerara crumb topping",
  },
];

const faqData = [
  {
    question: "What's your lead time?",
    answer:
      "It depends on the design — most birthday cakes need 5–7 days, weddings 2–3 weeks. Custom requests often need 2–3 weeks to design and bake. Get in touch as early as you can.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We deliver across Greater London (within about 25 km of our Hackney studio). Delivery is included for orders over £150; otherwise it's quoted based on distance. You can also collect from the studio by appointment.",
  },
  {
    question: "Can you cater for allergies — gluten, nuts, dairy?",
    answer:
      "Yes, with care. Every cake has its allergen profile noted, and many can be adapted. We work in a kitchen that handles wheat, eggs, dairy, and nuts, so we can't guarantee a fully allergen-free environment, but we can make designs allergen-aware. Mention requirements at enquiry.",
  },
  {
    question: "How does the custom design process work?",
    answer:
      "After you submit a request we reply within 24 hours with a quote and the option of a 15-minute mood-board call. Once design is agreed, we send a confirmation invoice with a 30% deposit. The remaining balance is due one week before the event.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes, 30% of the agreed price secures your date. The balance is due seven days before the event. Larger weddings (over £500) may have a different schedule — we'll set it together at the quote stage.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "Cancel more than 14 days before the event and your deposit is refunded in full. Within 14 days, the deposit covers our planning and preparation. Within 7 days, the full balance is non-refundable. We understand life happens — get in touch and we'll work with you where we can.",
  },
];

// ============================================================
// Seeding logic (idempotent: clears existing then re-inserts)
// ============================================================

async function main() {
  console.log("Clearing existing data...");
  // Delete in reverse dependency order so foreign keys are happy
  await prisma.cakeImage.deleteMany();
  await prisma.sizeOption.deleteMany();
  await prisma.cake.deleteMany();
  await prisma.category.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.siteSettings.deleteMany();

  console.log("Creating categories...");
  const categoryIds: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.create({ data: cat });
    categoryIds[cat.slug] = created.id;
  }
  console.log(`  ${Object.keys(categoryIds).length} categories created`);

  console.log("Creating cakes (with size options + primary image)...");
  for (const c of cakeData) {
    await prisma.cake.create({
      data: {
        title: c.title,
        slug: c.slug,
        description: c.description,
        basePriceCents: c.basePriceCents,
        leadTimeDays: c.leadTimeDays,
        allergenNotes: c.allergenNotes,
        status: "PUBLISHED",
        featured: c.featured,
        flavors: c.flavors,
        categoryId: categoryIds[c.categorySlug],
        sizeOptions: {
          create: c.sizes.map((s, idx) => ({
            label: s.label,
            priceCents: s.priceCents,
            sortOrder: idx,
          })),
        },
        images: {
          create: [
            {
              url: `https://picsum.photos/seed/petalcrumb-${c.slug}/1200/1200`,
              altText: c.imageAlt,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }
  console.log(`  ${cakeData.length} cakes created`);

  console.log("Creating FAQ entries...");
  for (let i = 0; i < faqData.length; i++) {
    await prisma.faq.create({
      data: { ...faqData[i], sortOrder: i },
    });
  }
  console.log(`  ${faqData.length} FAQ entries created`);

  console.log("Creating site settings (singleton)...");
  await prisma.siteSettings.create({
    data: {
      id: "singleton",
      email: "hello@petalcrumb.studio",
      phone: "+44 20 7946 0000",
      address: "12 Marlowe Lane, Hackney, London E8 3FY",
      openingHours: "Tuesday–Saturday 10:00–18:00 (by appointment)",
      instagramUrl: "https://instagram.com/petalcrumb.studio",
    },
  });

  console.log("\n✓ Seed complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
