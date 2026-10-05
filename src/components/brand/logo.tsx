import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-xl font-extrabold tracking-tight ${className}`}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content">
        <ShoppingBag className="size-5" aria-hidden />
      </span>
      <span>
        Naira<span className="text-primary">Mart</span>
        <span className="sr-only"> {APP_NAME} home</span>
      </span>
    </Link>
  );
}
