import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, MailWarning } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Demo order confirmed" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string; email?: string }> }) {
  const { ref, email } = await searchParams;
  const reference = ref && /^NM-[A-Z0-9]{8}$/.test(ref) ? ref : null;
  const emailSent = email === "sent";

  return (
    <div className="mx-auto max-w-lg space-y-5 rounded-box border border-base-300 bg-base-100 p-6 text-center sm:p-10">
      <CheckCircle2 className="mx-auto size-14 text-success" />
      <h1 className="text-2xl font-extrabold">Demo order confirmed</h1>
      <p className="text-base-content/80">
        Thanks for trying {APP_NAME}! This was a <strong>demo checkout</strong>: no payment was processed and no items will be shipped.
      </p>
      {reference ? (
        <p className="rounded-lg bg-base-200 p-3 text-sm">Order reference: <span className="font-mono font-bold">{reference}</span></p>
      ) : null}
      {emailSent ? (
        <p className="flex items-center justify-center gap-2 text-sm text-success"><Mail className="size-4" /> A confirmation email is on its way to you.</p>
      ) : (
        <p className="flex items-center justify-center gap-2 text-sm text-warning-content/80"><MailWarning className="size-4" /> We couldn&apos;t send the confirmation email this time, but your demo order was recorded.</p>
      )}
      <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
    </div>
  );
}
