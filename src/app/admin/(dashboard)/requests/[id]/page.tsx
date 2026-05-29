import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Badge, Field, inputCx, labelCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { STATUS_ORDER, STATUS_TONE, titleCase } from "../status";
import { updateRequest, deleteRequest } from "../actions";

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);

const fmtDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const req = await prisma.orderRequest.findUnique({
    where: { id },
    include: { referenceCake: { select: { title: true, slug: true } } },
  });
  if (!req) notFound();

  const rows: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${req.email}`} className="text-rose-deep hover:underline">{req.email}</a>],
    ["Phone", req.phone || "—"],
    ["Event date", fmtDate(req.eventDate)],
    ["Servings", String(req.servings)],
    ["Occasion", req.occasion],
    ["Budget", req.budgetRange || "—"],
    [
      "Inspired by",
      req.referenceCake ? (
        <Link href={`/cakes/${req.referenceCake.slug}`} className="text-rose-deep hover:underline">
          {req.referenceCake.title}
        </Link>
      ) : (
        "—"
      ),
    ],
    ["Received", fmtDateTime(req.createdAt)],
  ];

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/requests"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← All requests
      </Link>

      <AdminHeader
        eyebrow="Request"
        title={req.name}
        action={<Badge tone={STATUS_TONE[req.status]}>{titleCase(req.status)}</Badge>}
      />

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="text-xs uppercase tracking-[0.15em] text-ink-mute mb-1">
              {label}
            </dt>
            <dd className="text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-10">
        <h2 className={labelCx}>What they have in mind</h2>
        <p className="text-ink-soft leading-relaxed whitespace-pre-wrap">
          {req.description}
        </p>
        {req.allergenNotes && (
          <>
            <h2 className={`${labelCx} mt-6`}>Allergens / dietary</h2>
            <p className="text-ink-soft leading-relaxed">{req.allergenNotes}</p>
          </>
        )}
      </div>

      {/* Triage form */}
      <form
        action={updateRequest.bind(null, req.id)}
        className="border border-line rounded-sm bg-cream-soft p-6 space-y-5"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-rose">Triage</p>
        <Field label="Status" htmlFor="status">
          <select
            id="status"
            name="status"
            defaultValue={req.status}
            className={inputCx}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Private notes"
          htmlFor="adminNotes"
          hint="Visible to admins only — quotes, call notes, etc."
        >
          <textarea
            id="adminNotes"
            name="adminNotes"
            rows={4}
            defaultValue={req.adminNotes ?? ""}
            className={`${inputCx} resize-y`}
          />
        </Field>
        <div className="flex items-center justify-between gap-4 pt-1">
          <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
          <a
            href={`mailto:${req.email}?subject=Your%20Petalcrumb%20cake%20enquiry`}
            className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
          >
            Reply by email →
          </a>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-line">
        <DeleteButton
          action={deleteRequest.bind(null, req.id)}
          label="Delete this request"
          confirmText="Delete this request permanently? This cannot be undone."
        />
      </div>
    </div>
  );
}
