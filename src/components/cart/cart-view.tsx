"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/use-cart";
import { EmptyState } from "@/components/ui/empty-state";
import { CartLines } from "./cart-lines";
import { OrderSummary } from "./order-summary";

export function CartView() {
  const { items, hydrated, count, subtotal, total, clear } = useCart();

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]" aria-busy="true">
        <div className="skeleton h-72 w-full" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="size-7" />}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Explore the shop to find something you'll love."
        actionHref="/shop"
        actionLabel="Continue shopping"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-3">
        <CartLines />
        <div className="flex items-center justify-between">
          <Link href="/shop" className="link link-primary text-sm">← Continue shopping</Link>
          <button className="btn btn-ghost btn-sm text-error" onClick={clear}>Empty cart</button>
        </div>
      </div>
      <OrderSummary count={count} subtotal={subtotal} total={total}>
        <Link href="/checkout" className="btn btn-primary btn-block">Proceed to checkout</Link>
      </OrderSummary>
    </div>
  );
}
