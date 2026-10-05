"use server";

import { auth } from "@/auth";
import { getProductsByIds } from "@/lib/products";
import { sendEmail } from "@/lib/mailgun";
import { buildOrderEmail } from "@/emails/order-confirmation";
import { checkoutSchema } from "@/schemas/checkout";

export type DemoOrderResult =
  | { ok: true; reference: string; emailStatus: "sent" | "failed" }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

function makeReference() {
  const part = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `NM-${part}`;
}

/**
 * DEMO checkout. No payment is processed and no order is stored.
 * It re-validates the cart against the database, then sends a Mailgun
 * confirmation email. To add a real payment provider later, create the
 * payment session here before sending the email.
 */
export async function placeDemoOrder(input: unknown): Promise<DemoOrderResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Please sign in with Google to continue." };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check your details and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
    };
  }
  const { customer, items } = parsed.data;

  // Merge duplicate lines, then trust only the database for names and prices.
  const wanted = new Map<string, number>();
  for (const i of items) wanted.set(i.productId, (wanted.get(i.productId) ?? 0) + i.quantity);

  let found;
  try {
    found = await getProductsByIds([...wanted.keys()]);
  } catch (err) {
    console.error("[checkout] Product lookup failed:", err);
    return { ok: false, error: "We couldn't verify your cart right now. Please try again." };
  }

  if (found.length !== wanted.size) {
    return { ok: false, error: "Some items in your cart are no longer available. Please review your cart." };
  }

  const problems: string[] = [];
  const lines = found.map((p) => {
    const quantity = wanted.get(p.id)!;
    if (p.stock < quantity) problems.push(p.name);
    return { name: p.name, quantity, unitPrice: p.price };
  });
  if (problems.length) {
    return { ok: false, error: `Not enough stock for: ${problems.join(", ")}. Please adjust your cart.` };
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const reference = makeReference();

  const email = buildOrderEmail({
    reference,
    customerName: customer.fullName,
    customerEmail: customer.email,
    address: `${customer.address}, ${customer.city}, ${customer.state}`,
    lines,
    subtotal,
    total: subtotal,
  });

  const result = await sendEmail({ to: customer.email, ...email });
  return { ok: true, reference, emailStatus: result.ok ? "sent" : "failed" };
}
