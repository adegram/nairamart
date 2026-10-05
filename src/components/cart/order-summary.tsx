import type { ReactNode } from "react";
import { formatNaira } from "@/lib/format";

export function OrderSummary({
  count,
  subtotal,
  total,
  children,
}: {
  count: number;
  subtotal: number;
  total: number;
  children?: ReactNode;
}) {
  return (
    <aside className="h-fit rounded-box border border-base-300 bg-base-100 p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-base-content/70">Items ({count})</dt>
          <dd>{formatNaira(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-base-content/70">Delivery</dt>
          <dd className="text-base-content/70">Calculated at delivery (demo)</dd>
        </div>
        <div className="divider my-2" />
        <div className="flex justify-between text-base font-bold">
          <dt>Total</dt>
          <dd>{formatNaira(total)}</dd>
        </div>
      </dl>
      {children ? <div className="mt-5 flex flex-col gap-3">{children}</div> : null}
    </aside>
  );
}
