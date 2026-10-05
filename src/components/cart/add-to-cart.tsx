"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { addItem } from "@/lib/cart-store";
import { MAX_ITEM_QUANTITY } from "@/lib/constants";

type Props = {
  product: { id: string; slug: string; name: string; price: number; image: string; stock: number };
  showQuantity?: boolean;
  size?: "sm" | "md";
};

export function AddToCart({ product, showQuantity = false, size = "md" }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const max = Math.min(product.stock, MAX_ITEM_QUANTITY);
  const btn = size === "sm" ? "btn-sm" : "";

  if (product.stock <= 0) {
    return (
      <button className={`btn btn-disabled w-full ${btn}`} disabled>
        Out of stock
      </button>
    );
  }

  function handleAdd() {
    addItem(
      { productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, stock: product.stock },
      qty,
    );
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-3">
        {showQuantity ? (
          <div className="join">
            <button type="button" className="btn join-item" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
              <Minus className="size-4" />
            </button>
            <span className="join-item grid min-w-12 place-items-center border border-base-300 px-3 font-semibold" aria-live="polite">{qty}</span>
            <button type="button" className="btn join-item" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max}>
              <Plus className="size-4" />
            </button>
          </div>
        ) : null}
        <button type="button" onClick={handleAdd} className={`btn btn-primary flex-1 ${btn}`}>
          {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
      {added && showQuantity ? (
        <Link href="/cart" className="link link-primary text-sm">View cart and checkout →</Link>
      ) : null}
    </div>
  );
}
