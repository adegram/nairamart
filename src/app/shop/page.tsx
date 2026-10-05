import type { Metadata } from "next";
import Link from "next/link";
import { Search, PackageSearch } from "lucide-react";
import { getProducts } from "@/lib/products";
import { shopParamsSchema, type ShopParams } from "@/schemas/shop";
import { CATEGORIES, categoryBySlug } from "@/lib/constants";
import { ProductGrid } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop" };

const sorts: { value: ShopParams["sort"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function href(p: Partial<ShopParams>) {
  const qs = new URLSearchParams();
  if (p.category) qs.set("category", p.category);
  if (p.q) qs.set("q", p.q);
  if (p.sort && p.sort !== "newest") qs.set("sort", p.sort);
  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const params = shopParamsSchema.parse({
    category: typeof raw.category === "string" ? raw.category : undefined,
    q: typeof raw.q === "string" ? raw.q : undefined,
    sort: typeof raw.sort === "string" ? raw.sort : undefined,
  });
  const products = await getProducts(params);
  const active = params.category ? categoryBySlug(params.category) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">{active ? active.name : "All products"}</h1>
          <p className="text-base-content/70">{products.length} {products.length === 1 ? "product" : "products"}</p>
        </div>
        <form action="/shop" className="join w-full sm:w-80" role="search">
          {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
          {params.sort !== "newest" ? <input type="hidden" name="sort" value={params.sort} /> : null}
          <input name="q" defaultValue={params.q} placeholder="Search products" className="input join-item w-full" aria-label="Search products" maxLength={80} />
          <button className="btn btn-primary join-item" aria-label="Search"><Search className="size-4" /></button>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Categories">
        <Link href={href({ q: params.q, sort: params.sort })} className={`btn btn-sm ${!params.category ? "btn-primary" : "btn-outline"}`}>All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={href({ category: c.slug, q: params.q, sort: params.sort })} className={`btn btn-sm shrink-0 ${params.category === c.slug ? "btn-primary" : "btn-outline"}`}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-base-content/70">Sort by:</span>
        {sorts.map((s) => (
          <Link key={s.value} href={href({ ...params, sort: s.value })} className={`link ${params.sort === s.value ? "font-bold link-primary" : "link-hover"}`}>
            {s.label}
          </Link>
        ))}
      </div>

      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState icon={<PackageSearch className="size-7" />} title="No products found" description="Try a different search or category." actionHref="/shop" actionLabel="Clear filters" />
      )}
    </div>
  );
}
