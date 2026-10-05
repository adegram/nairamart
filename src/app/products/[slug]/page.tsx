import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductGrid } from "@/components/product/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { categoryBySlug } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description.slice(0, 155) };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug.slice(0, 200));
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id);
  const category = categoryBySlug(product.category);
  const stockLabel =
    product.stock <= 0 ? { text: "Out of stock", cls: "badge-error" } : product.stock <= 5 ? { text: `Only ${product.stock} left`, cls: "badge-warning" } : { text: "In stock", cls: "badge-success" };

  return (
    <div className="space-y-12">
      <div>
        <nav className="breadcrumbs mb-4 text-sm" aria-label="Breadcrumb">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            {category ? <li><Link href={`/shop?category=${category.slug}`}>{category.name}</Link></li> : null}
          </ul>
        </nav>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-box border border-base-300 bg-base-200">
            <Image src={product.image} alt={product.name} fill priority unoptimized sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            {category ? <p className="text-sm font-medium uppercase tracking-wide text-primary">{category.name}</p> : null}
            <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
            <p className="text-3xl font-bold">{formatNaira(product.price)}</p>
            <span className={`badge ${stockLabel.cls} badge-soft`}>{stockLabel.text}</span>
            <p className="leading-relaxed text-base-content/80">{product.description}</p>
            <div className="mt-2 max-w-sm">
              <AddToCart showQuantity product={product} />
            </div>
          </div>
        </div>
      </div>

      {related.length ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
