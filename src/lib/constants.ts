export const APP_NAME = "NairaMart";
export const APP_TAGLINE = "Shop Nigeria's finest, delivered to your door";
export const CURRENCY = "NGN";
export const LOCALE = "en-NG";
export const MAX_ITEM_QUANTITY = 10;

export const CATEGORIES = [
  { name: "Phones", slug: "phones", emoji: "📱", blurb: "Smartphones from top brands" },
  { name: "Laptops", slug: "laptops", emoji: "💻", blurb: "Work, study and play" },
  { name: "Electronics", slug: "electronics", emoji: "🎧", blurb: "Audio, TVs and power" },
  { name: "Accessories", slug: "accessories", emoji: "⌚", blurb: "Wearables and add-ons" },
  { name: "Fashion", slug: "fashion", emoji: "👗", blurb: "Style for every day" },
  { name: "Home & Living", slug: "home-living", emoji: "🛋️", blurb: "Make your space yours" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
