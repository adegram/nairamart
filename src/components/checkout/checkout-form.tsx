"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Info, LogIn, ShoppingCart } from "lucide-react";
import { placeDemoOrder } from "@/actions/checkout";
import { customerSchema, type CustomerInput } from "@/schemas/checkout";
import { useCart } from "@/lib/use-cart";
import { formatNaira } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";
import { CartLines } from "@/components/cart/cart-lines";
import { OrderSummary } from "@/components/cart/order-summary";

type Props = { user: { name?: string | null; email?: string | null } | null };

const fields: { name: keyof CustomerInput; label: string; type?: string; autoComplete: string; placeholder?: string; span?: boolean }[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", placeholder: "08012345678" },
  { name: "address", label: "Delivery address", autoComplete: "street-address", span: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "state", label: "State", autoComplete: "address-level1" },
];

export function CheckoutForm({ user }: Props) {
  const router = useRouter();
  const { items, hydrated, count, subtotal, total, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: { fullName: user?.name ?? "", email: user?.email ?? "" },
  });

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]" aria-busy="true">
        <div className="skeleton h-96 w-full" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="size-7" />}
        title="Your cart is empty"
        description="Add something to your cart before checking out."
        actionHref="/shop"
        actionLabel="Continue shopping"
      />
    );
  }

  const onSubmit = handleSubmit((customer) => {
    setServerError(null);
    startTransition(async () => {
      const result = await placeDemoOrder({
        customer,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      if (!result.ok) {
        setServerError(result.error);
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          if (messages?.[0] && field !== "items") setError(field as keyof CustomerInput, { message: messages[0] });
        }
        return;
      }
      router.push(`/checkout/success?ref=${encodeURIComponent(result.reference)}&email=${result.emailStatus}`);
      clear();
    });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-lg font-bold">1. Review your items</h2>
          <CartLines />
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">2. Delivery details</h2>
          {!user ? (
            <div role="alert" className="alert alert-info alert-soft mb-4">
              <Info className="size-5" />
              <span>Sign in with Google to place your demo order. Your cart will be kept.</span>
              <Link href="/signin?callbackUrl=/checkout" className="btn btn-sm btn-primary"><LogIn className="size-4" /> Sign in</Link>
            </div>
          ) : null}
          <form id="checkout-form" onSubmit={onSubmit} noValidate className="grid gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:grid-cols-2 sm:p-5">
            {fields.map((f) => (
              <div key={f.name} className={f.span ? "sm:col-span-2" : ""}>
                <label htmlFor={f.name} className="mb-1 block text-sm font-medium">{f.label}</label>
                <input
                  id={f.name}
                  type={f.type ?? "text"}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  aria-invalid={errors[f.name] ? true : undefined}
                  className={`input w-full ${errors[f.name] ? "input-error" : ""}`}
                  {...register(f.name)}
                />
                {errors[f.name] ? <p className="mt-1 text-sm text-error">{errors[f.name]?.message}</p> : null}
              </div>
            ))}
          </form>
        </section>
      </div>

      <OrderSummary count={count} subtotal={subtotal} total={total}>
        {serverError ? (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            <AlertCircle className="size-5 shrink-0" />
            <span>{serverError}</span>
          </div>
        ) : null}
        <button type="submit" form="checkout-form" className="btn btn-primary btn-block" disabled={pending || !user}>
          {pending ? <span className="loading loading-spinner loading-sm" /> : null}
          {pending ? "Processing demo…" : `Pay ${formatNaira(total)} (Demo)`}
        </button>
        <p className="flex gap-2 rounded-lg bg-warning/15 p-3 text-xs text-base-content/80">
          <Info className="mt-0.5 size-4 shrink-0" />
          Payment integration is not available in this demo. Clicking the button will not charge you.
        </p>
        <Link href="/cart" className="link link-primary text-center text-sm">← Edit cart</Link>
      </OrderSummary>
    </div>
  );
}
