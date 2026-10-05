import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { LogIn, LogOut, Menu } from "lucide-react";
import { auth } from "@/auth";
import { signOutAction } from "@/actions/auth";
import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/components/cart/cart-button";
import { CATEGORIES } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export async function Navbar() {
  // Opt into request-time rendering explicitly (the session depends on cookies).
  await connection();
  let user: { name?: string | null; email?: string | null; image?: string | null } | null = null;
  try {
    user = (await auth())?.user ?? null;
  } catch (err) {
    // Never let an auth/database hiccup take down the whole layout.
    console.error("[navbar] Failed to read session:", err);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
        <details className="dropdown lg:hidden">
          <summary className="btn btn-ghost btn-circle" aria-label="Open menu">
            <Menu className="size-5" />
          </summary>
          <ul className="menu dropdown-content z-50 mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
            <li className="menu-title mt-2">Categories</li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/shop?category=${c.slug}`}>{c.emoji} {c.name}</Link></li>
            ))}
          </ul>
        </details>

        <Logo />

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="btn btn-ghost btn-sm">{l.label}</Link>
          ))}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">Categories</div>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {CATEGORIES.map((c) => (
                <li key={c.slug}><Link href={`/shop?category=${c.slug}`}>{c.emoji} {c.name}</Link></li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <CartButton />
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" aria-label="Account menu">
                {user.image ? (
                  <div className="relative size-9 overflow-hidden rounded-full">
                    <Image src={user.image} alt={user.name ?? "Your avatar"} fill sizes="36px" unoptimized />
                  </div>
                ) : (
                  <div className="grid size-9 place-items-center rounded-full bg-primary text-primary-content">
                    {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div tabIndex={0} className="dropdown-content z-50 mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-3 shadow-lg">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-sm text-base-content/70">{user.email}</p>
                <form action={signOutAction} className="mt-3">
                  <button className="btn btn-outline btn-sm btn-block"><LogOut className="size-4" /> Sign out</button>
                </form>
              </div>
            </div>
          ) : (
            <Link href="/signin" className="btn btn-primary btn-sm">
              <LogIn className="size-4" /> <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
