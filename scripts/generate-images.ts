/**
 * Generates a clean SVG illustration for each seed product into public/products.
 * Run with: npm run images:generate
 * These are placeholders you can replace with real product photos.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { seedProducts } from "../src/db/seed-data";

const gradients: Record<string, [string, string]> = {
  phones: ["#0f766e", "#14b8a6"],
  laptops: ["#1d4ed8", "#60a5fa"],
  electronics: ["#7c3aed", "#c084fc"],
  accessories: ["#b45309", "#fbbf24"],
  fashion: ["#be185d", "#f472b6"],
  "home-living": ["#166534", "#4ade80"],
};

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

for (const p of seedProducts) {
  const [from, to] = gradients[p.category] ?? ["#166534", "#4ade80"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${p.name.replace(/&/g, "and")}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="400" cy="380" r="230" fill="#ffffff" fill-opacity="0.16"/>
  <circle cx="400" cy="380" r="170" fill="#ffffff" fill-opacity="0.18"/>
  <text x="400" y="440" font-size="230" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${p.emoji}</text>
  <text x="400" y="740" font-size="34" font-weight="700" text-anchor="middle" fill="#ffffff" fill-opacity="0.85" font-family="Helvetica, Arial, sans-serif">NairaMart</text>
</svg>`;
  writeFileSync(join(dir, `${p.slug}.svg`), svg);
}
console.log(`Generated ${seedProducts.length} product images in public/products`);
