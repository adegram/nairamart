import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { seedProducts } from "./seed-data";

config({ path: ".env.local" });
config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local first.");
  const db = drizzle(neon(url), { schema });

  const rows = seedProducts.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    stock: p.stock,
    featured: p.featured,
    image: `/products/${p.slug}.svg`,
  }));

  // Idempotent: re-running updates existing products by slug.
  await db
    .insert(schema.products)
    .values(rows)
    .onConflictDoUpdate({
      target: schema.products.slug,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        price: sql`excluded.price`,
        image: sql`excluded.image`,
        category: sql`excluded.category`,
        stock: sql`excluded.stock`,
        featured: sql`excluded.featured`,
        updatedAt: new Date(),
      },
    });

  console.log(`Seeded ${rows.length} NairaMart products.`);
}

main().catch((err) => {
  console.error("Seeding failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
