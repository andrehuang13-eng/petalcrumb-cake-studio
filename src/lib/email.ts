import "server-only";
import { Resend } from "resend";

// Resend sandbox sender — works without domain verification, but can only
// deliver to the email address that registered the Resend account.
// For production, replace with a verified sender like "studio@petalcrumb.co.uk".
const FROM_EMAIL = "Petalcrumb Studio <onboarding@resend.dev>";

// Singleton — instantiate the client once per server instance.
// `undefined` = not yet checked; `null` = checked, no key configured.
let resendClient: Resend | null | undefined;

function getResend(): Resend | null {
  if (resendClient !== undefined) return resendClient;
  const key = process.env.RESEND_API_KEY;
  resendClient = key ? new Resend(key) : null;
  return resendClient;
}

export type OrderRequestEmailInput = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  eventDate: Date;
  servings: number;
  occasion: string;
  description: string;
  allergenNotes: string | null;
  budgetRange: string | null;
  referenceCake: { title: string; slug: string } | null;
};

export type EmailResult = { sent: true } | { sent: false; reason: string };

/**
 * Sends the admin-notification email for a new order request.
 *
 * Best-effort: returns `{ sent: false, reason }` instead of throwing when
 * configuration is missing, so callers can fire-and-forget without a
 * try/catch around every call site. Hard errors (network, Resend 5xx) do
 * propagate — wrap the call in `.catch()` if you don't want them surfaced.
 */
export async function sendOrderRequestEmail(
  input: OrderRequestEmailInput,
): Promise<EmailResult> {
  const resend = getResend();
  if (!resend) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const to = process.env.ORDER_REQUEST_TO_EMAIL;
  if (!to) {
    return { sent: false, reason: "ORDER_REQUEST_TO_EMAIL not configured" };
  }

  const fmtDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(input.eventDate);

  const subject = `New cake request — ${input.name} (${input.occasion}, ${fmtDate})`;

  const html = renderOrderRequestHtml(input, fmtDate);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    replyTo: input.email,
    subject,
    html,
  });

  if (error) {
    return { sent: false, reason: error.message };
  }
  return { sent: true };
}

// === HTML rendering ===
// Inline styles only — most email clients strip <style> blocks.
// Colours mirror the site's brand palette (cream/ink/rose/sage).

function renderOrderRequestHtml(
  input: OrderRequestEmailInput,
  fmtDate: string,
): string {
  const rows = [
    row("Name", esc(input.name)),
    row("Email", `<a href="mailto:${esc(input.email)}" style="color:#8e4f4a">${esc(input.email)}</a>`),
    input.phone ? row("Phone", esc(input.phone)) : "",
    row("Event date", esc(fmtDate)),
    row("Servings", String(input.servings)),
    row("Occasion", esc(input.occasion)),
    input.budgetRange ? row("Budget", esc(input.budgetRange)) : "",
    input.referenceCake
      ? row(
          "Inspired by",
          `<a href="https://petalcrumb-cake-studio.vercel.app/cakes/${esc(input.referenceCake.slug)}" style="color:#8e4f4a">${esc(input.referenceCake.title)}</a>`,
        )
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:32px 16px;background:#faf6f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1f1a14">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5dccd;border-radius:4px;padding:32px">
    <tr><td>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#b86f6a">New request</p>
      <h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:24px;color:#1f1a14">
        ${esc(input.name)} — ${esc(input.occasion)}
      </h2>

      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
        ${rows}
      </table>

      <h3 style="margin:32px 0 8px;font-family:Georgia,serif;font-weight:500;font-size:16px;color:#1f1a14">What they have in mind</h3>
      <p style="margin:0;color:#4a4138;white-space:pre-wrap">${esc(input.description)}</p>

      ${
        input.allergenNotes
          ? `<h3 style="margin:24px 0 8px;font-family:Georgia,serif;font-weight:500;font-size:16px;color:#1f1a14">Allergens / dietary</h3>
             <p style="margin:0;color:#4a4138">${esc(input.allergenNotes)}</p>`
          : ""
      }

      <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e5dccd;font-size:11px;color:#8a8278">
        Request ID: ${esc(input.id)}<br />
        Reply directly to this email to respond to the customer.
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#8a8278;text-transform:uppercase;letter-spacing:0.1em;font-size:10px;vertical-align:top;white-space:nowrap">${esc(label)}</td>
    <td style="padding:6px 0;color:#1f1a14;vertical-align:top">${value}</td>
  </tr>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
