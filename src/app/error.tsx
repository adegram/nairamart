"use client";

import { TriangleAlert } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 p-10 text-center">
      <TriangleAlert className="size-10 text-warning" />
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-base-content/70">We couldn&apos;t load this page. Please try again in a moment.</p>
      <button className="btn btn-primary" onClick={reset}>Try again</button>
    </div>
  );
}
