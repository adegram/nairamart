import { APP_NAME } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

export type OrderEmailLine = { name: string; quantity: number; unitPrice: number };

export type OrderEmailData = {
  reference: string;
  customerName: string;
  customerEmail: string;
  address: string;
  lines: OrderEmailLine[];
  subtotal: number;
  total: number;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildOrderEmail(d: OrderEmailData) {
  const subject = `${APP_NAME} demo order ${d.reference}`;

  const rows = d.lines
    .map(
      (l) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb">${esc(l.name)}</td>
  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:center">${l.quantity}</td>
  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right">${formatNaira(l.unitPrice)}</td>
  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right">${formatNaira(l.unitPrice * l.quantity)}</td>
</tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f3f4f6;font-family:Helvetica,Arial,sans-serif;color:#111827">
<div style="max-width:620px;margin:0 auto;padding:24px">
  <div style="background:#166534;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
    <div style="font-size:24px;font-weight:700">${APP_NAME}</div>
    <div style="opacity:.85;font-size:14px">Order confirmation (demo)</div>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px">
    <p style="margin-top:0">Hi ${esc(d.customerName)},</p>
    <p>Thank you for shopping with ${APP_NAME}! Your demo order <strong>${esc(d.reference)}</strong> has been recorded.</p>
    <p style="background:#fef3c7;border:1px solid #fcd34d;padding:12px;border-radius:8px;font-size:14px">
      <strong>This is a demo.</strong> No payment was taken and nothing will be shipped.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
      <thead><tr style="text-align:left;color:#6b7280">
        <th style="padding-bottom:8px">Product</th><th style="padding-bottom:8px;text-align:center">Qty</th>
        <th style="padding-bottom:8px;text-align:right">Price</th><th style="padding-bottom:8px;text-align:right">Total</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <table style="width:100%;font-size:14px;margin-top:12px">
      <tr><td style="color:#6b7280">Subtotal</td><td style="text-align:right">${formatNaira(d.subtotal)}</td></tr>
      <tr><td style="font-weight:700;font-size:16px;padding-top:6px">Total</td><td style="text-align:right;font-weight:700;font-size:16px;padding-top:6px">${formatNaira(d.total)}</td></tr>
    </table>
    <p style="font-size:14px;margin-top:20px"><strong>Delivery address</strong><br>${esc(d.address)}</p>
    <p style="font-size:12px;color:#6b7280;margin-bottom:0">${APP_NAME} is a demo ecommerce project. Reference: ${esc(d.reference)}.</p>
  </div>
</div></body></html>`;

  const text = [
    `${APP_NAME} - Order confirmation (DEMO)`,
    `Hi ${d.customerName}, your demo order ${d.reference} has been recorded. No payment was taken.`,
    "",
    ...d.lines.map((l) => `${l.quantity} x ${l.name} @ ${formatNaira(l.unitPrice)} = ${formatNaira(l.unitPrice * l.quantity)}`),
    "",
    `Subtotal: ${formatNaira(d.subtotal)}`,
    `Total: ${formatNaira(d.total)}`,
    `Delivery address: ${d.address}`,
  ].join("\n");

  return { subject, html, text };
}
