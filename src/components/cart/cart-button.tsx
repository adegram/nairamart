"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/use-cart";

export function CartButton() {
  const { count, hydrated } = useCart();
  return (
    <Link href="/cart" className="btn btn-ghost btn-circle" aria-label={`Cart${hydrated ? `, ${count} items` : ""}`}>
      <div className="indicator">
        <ShoppingCart className="size-5" aria-hidden />
        {hydrated && count > 0 ? (
          <span className="badge badge-primary badge-sm indicator-item">{count > 99 ? "99+" : count}</span>
        ) : null}
      </div>
    </Link>
  );
}
