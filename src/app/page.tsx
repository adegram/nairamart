import Link from "next/link";
import { ArrowRight, BadgeCheck, Headset, Truck } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/product-card";
import { APP_NAME, CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const perks = [
  { icon: Truck, title: "Nationwide delivery", text: "From Lagos to Maiduguri (demo)." },
  { icon: BadgeCheck, title: "Authentic products", text: "Only genuine items on the shelf." },
  { icon: Headset, title: "Friendly support", text: "Real people, ready to help." },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(8);

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-box bg-gradient-to-br from-primary to-emerald-800 p-6 text-primary-content sm:p-12">
        <div className="max-w-xl space-y-4">
          <span className="badge badge-secondary">New season deals</span>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">Shop smart with {APP_NAME}</h1>
          <p className="text-primary-content/85 sm:text-lg">
            Phones, laptops, fashion and home essentials, all priced in Naira and ready to add to your cart.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/shop" className="btn btn-secondary">Shop now <ArrowRight className="size-4" /></Link>
            <Link href="/shop?category=phones" className="btn btn-outline border-primary-content/50 text-primary-content hover:bg-primary-content hover:text-primary">Browse phones</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="categories">
        <h2 id="categories" className="mb-4 text-2xl font-bold">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="flex flex-col items-center gap-1 rounded-box border border-base-300 bg-base-100 p-4 text-center transition hover:border-primary hover:shadow-md">
              <span className="text-3xl" aria-hidden>{c.emoji}</span>
              <span className="font-semibold">{c.name}</span>
              <span className="hidden text-xs text-base-content/60 sm:block">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="featured" className="text-2xl font-bold">Featured products</h2>
          <Link href="/shop" className="link link-primary text-sm">View all →</Link>
        </div>
        {featured.length ? (
          <ProductGrid products={featured} />
        ) : (
          <p className="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/70">
            No products yet. Run <code className="rounded bg-base-200 px-1">npm run db:seed</code> to load the catalog.
          </p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-box border border-base-300 bg-base-100 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="size-5" /></span>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-base-content/70">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
