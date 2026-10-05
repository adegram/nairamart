"use client";

import { useMemo, useSyncExternalStore } from "react";
import * as store from "./cart-store";

const noopSubscribe = () => () => {};

export function useCart() {
  const items = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  // false on the server and during hydration, true afterwards
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  return useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      hydrated,
      count,
      subtotal,
      total: subtotal,
      addItem: store.addItem,
      setQuantity: store.setQuantity,
      removeItem: store.removeItem,
      clear: store.clearCart,
    };
  }, [items, hydrated]);
}
