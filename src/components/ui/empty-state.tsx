import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 px-6 py-14 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-base-200 text-base-content/60">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-base-content/70">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn btn-primary mt-2">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
