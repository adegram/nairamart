import "server-only";
import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { getDb } from "@/db";
import { products, type Product } from "@/db/schema";
import type { ShopParams } from "@/schemas/shop";

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return getDb()
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProducts(params: ShopParams): Promise<Product[]> {
  const filters = [];
  if (params.category) filters.push(eq(products.category, params.category));
  if (params.q) {
    // Escape LIKE wildcards in user input.
    const term = `%${params.q.replace(/[\\%_]/g, "\\$&")}%`;
    filters.push(or(ilike(products.name, term), ilike(products.description, term)));
  }
  const order =
    params.sort === "price-asc"
      ? asc(products.price)
      : params.sort === "price-desc"
        ? desc(products.price)
        : desc(products.createdAt);

  return getDb()
    .select()
    .from(products)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(order, asc(products.name));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const [row] = await getDb().select().from(products).where(eq(products.slug, slug)).limit(1);
  return row ?? null;
}

export async function getRelatedProducts(category: string, excludeId: string, limit = 4) {
  const rows = await getDb()
    .select()
    .from(products)
    .where(eq(products.category, category))
    .limit(limit + 1);
  return rows.filter((p) => p.id !== excludeId).slice(0, limit);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  return getDb().select().from(products).where(inArray(products.id, ids));
}
