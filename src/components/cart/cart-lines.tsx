"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/use-cart";
import { formatNaira } from "@/lib/format";
import { MAX_ITEM_QUANTITY } from "@/lib/constants";

export function CartLines() {
  const { items, setQuantity, removeItem } = useCart();

  return (
    <ul className="divide-y divide-base-300 rounded-box border border-base-300 bg-base-100">
      {items.map((item) => {
        const max = Math.min(item.stock, MAX_ITEM_QUANTITY);
        return (
          <li key={item.productId} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
            <Link href={`/products/${item.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-base-200 sm:size-24">
              <Image src={item.image} alt={item.name} fill sizes="96px" unoptimized className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/products/${item.slug}`} className="line-clamp-2 font-semibold hover:text-primary">
                  {item.name}
                </Link>
                <button className="btn btn-ghost btn-xs btn-square text-error" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.productId)}>
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="text-sm text-base-content/70">{formatNaira(item.price)} each</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                <div className="join">
                  <button className="btn btn-sm join-item" aria-label={`Decrease quantity of ${item.name}`} onClick={() => setQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus className="size-3.5" />
                  </button>
                  <span className="join-item grid min-w-10 place-items-center border border-base-300 px-2 text-sm font-semibold">{item.quantity}</span>
                  <button className="btn btn-sm join-item" aria-label={`Increase quantity of ${item.name}`} onClick={() => setQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= max}>
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <p className="font-bold">{formatNaira(item.price * item.quantity)}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
