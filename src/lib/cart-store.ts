"use client";

import { storedCartItemSchema, storedCartSchema, type CartItem } from "@/schemas/cart";
import { MAX_ITEM_QUANTITY } from "@/lib/constants";

/**
 * Tiny external store backed by localStorage, consumed with useSyncExternalStore.
 * The server snapshot is always an empty cart, so server HTML and the first
 * client render match and there are no hydration errors; the real cart
 * appears right after hydration.
 */
const STORAGE_KEY = "nairamart:cart:v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = storedCartSchema.safeParse(raw ? JSON.parse(raw) : []);
    items = parsed.success && parsed.data.length ? parsed.data : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next.length ? next : EMPTY;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be full or blocked (private mode); the cart still works in memory.
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): CartItem[] {
  load();
  return items;
}
export const getServerSnapshot = (): CartItem[] => EMPTY;

const clamp = (qty: number, stock: number) =>
  Math.max(1, Math.min(Math.floor(qty), MAX_ITEM_QUANTITY, Math.max(stock, 1)));

export function addItem(product: Omit<CartItem, "quantity">, quantity = 1) {
  load();
  const existing = items.find((i) => i.productId === product.productId);
  const nextQty = clamp((existing?.quantity ?? 0) + quantity, product.stock);
  const next: CartItem = storedCartItemSchema.parse({ ...product, quantity: nextQty });
  commit(existing ? items.map((i) => (i.productId === next.productId ? next : i)) : [...items, next]);
}

export function setQuantity(productId: string, quantity: number) {
  load();
  commit(
    items.map((i) => (i.productId === productId ? { ...i, quantity: clamp(quantity, i.stock) } : i)),
  );
}

export function removeItem(productId: string) {
  load();
  commit(items.filter((i) => i.productId !== productId));
}

export function clearCart() {
  load();
  commit([]);
}
