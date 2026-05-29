import Link from "next/link";
import { OrderRequestStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Badge } from "@/components/admin/ui";
import { STATUS_ORDER, STATUS_TONE, titleCase } from "./status";

export const metadata = { title: "Requests" };

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);

type SearchParams = Promise<{ status?: string }>;

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const activeStatus =
    status && (STATUS_ORDER as string[]).includes(status)
      ? (status as OrderRequestStatus)
      : undefined;

  const requests = await prisma.orderRequest.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { referenceCake: { select: { title: true } } },
  });

  return (
    <div>
      <AdminHeader eyebrow="Enquiries" title="Order requests" />

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <FilterChip label="All" href="/admin/requests" active={!activeStatus} />
        {STATUS_ORDER.map((s) => (
          <FilterChip
            key={s}
            label={titleCase(s)}
            href={`/admin/requests?status=${s}`}
            active={activeStatus === s}
          />
        ))}
      </div>

      {requests.length === 0 ? (
        <p className="text-ink-mute text-sm py-12 text-center border border-dashed border-line rounded-sm">
          No requests{activeStatus ? ` with status “${titleCase(activeStatus)}”` : " yet"}.
        </p>
      ) : (
        <div className="overflow-x-auto border border-line rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-cream-soft text-left">
                <Th>Received</Th>
                <Th>Name</Th>
                <Th>Occasion</Th>
                <Th>Event date</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-line/60 last:border-0 hover:bg-cream-soft/50 transition-colors"
                >
                  <Td>
                    <Link
                      href={`/admin/requests/${r.id}`}
                      className="block text-ink hover:text-rose-deep transition-colors"
                    >
                      {fmtDate(r.createdAt)}
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/requests/${r.id}`}
                      className="block font-medium text-ink hover:text-rose-deep transition-colors"
                    >
                      {r.name}
                    </Link>
                    <span className="text-ink-mute text-xs">{r.email}</span>
                  </Td>
                  <Td>{r.occasion}</Td>
                  <Td>{fmtDate(r.eventDate)}</Td>
                  <Td>
                    <Badge tone={STATUS_TONE[r.status]}>
                      {titleCase(r.status)}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-ink-mute font-normal">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full transition-colors ${
        active
          ? "bg-ink text-cream"
          : "border border-line text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
