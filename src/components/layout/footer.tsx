import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { APP_NAME, APP_TAGLINE, CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-base-content/70">{APP_TAGLINE}.</p>
        </div>
        <nav aria-label="Shop categories">
          <h3 className="mb-3 font-semibold">Shop</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link className="link link-hover" href={`/shop?category=${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Account">
          <h3 className="mb-3 font-semibold">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="link link-hover" href="/signin">Sign in</Link></li>
            <li><Link className="link link-hover" href="/cart">Your cart</Link></li>
            <li><Link className="link link-hover" href="/checkout">Checkout</Link></li>
          </ul>
        </nav>
        <div>
          <h3 className="mb-3 font-semibold">About this demo</h3>
          <p className="text-sm text-base-content/70">
            {APP_NAME} is a portfolio project. Checkout is a demo: no real payments are processed and nothing is shipped.
          </p>
        </div>
      </div>
      <div className="border-t border-base-300 py-4 text-center text-xs text-base-content/60">
        © {new Date().getFullYear()} {APP_NAME}. Made in Nigeria 🇳🇬 for the HNG internship.
      </div>
    </footer>
  );
}
