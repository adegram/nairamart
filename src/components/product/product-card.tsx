import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { AddToCart } from "@/components/cart/add-to-cart";
import { categoryBySlug } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const category = categoryBySlug(product.category);
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-base-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock ? <span className="badge badge-neutral absolute left-2 top-2">Out of stock</span> : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {category ? <p className="text-xs font-medium uppercase tracking-wide text-primary">{category.name}</p> : null}
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold sm:text-base">
          <Link href={`/products/${product.slug}`} className="hover:text-primary">{product.name}</Link>
        </h3>
        <p className="text-lg font-bold">{formatNaira(product.price)}</p>
        <div className="mt-auto pt-1">
          <AddToCart size="sm" product={product} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-72 w-full" />
      ))}
    </div>
  );
}
