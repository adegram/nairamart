import type { Metadata } from "next";
import { auth } from "@/auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  let user: { name?: string | null; email?: string | null } | null = null;
  try {
    const session = await auth();
    user = session?.user ? { name: session.user.name, email: session.user.email } : null;
  } catch (err) {
    console.error("[checkout] Failed to read session:", err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <p className="text-base-content/70">Review your order and confirm your delivery details.</p>
      </div>
      <CheckoutForm user={user} />
    </div>
  );
}
