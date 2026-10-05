import type { NewProduct } from "./schema";

type SeedProduct = Omit<NewProduct, "id" | "image" | "createdAt" | "updatedAt"> & {
  emoji: string;
};

/** Prices are in whole Naira (NGN). Images are generated into /public/products/<slug>.svg */
export const seedProducts: SeedProduct[] = [
  // Phones
  { name: "Samsung Galaxy A55 5G (8GB/256GB)", slug: "samsung-galaxy-a55-5g", category: "phones", price: 485000, stock: 24, featured: true, emoji: "📱", description: "6.6-inch Super AMOLED 120Hz display, 50MP triple camera with OIS, 5,000mAh battery and a sleek metal frame. Dual SIM, 5G ready." },
  { name: "Tecno Camon 30 Pro 5G (12GB/256GB)", slug: "tecno-camon-30-pro-5g", category: "phones", price: 365000, stock: 31, featured: true, emoji: "📲", description: "Portrait-first flagship with a 50MP RGBW camera, 6.78-inch curved AMOLED screen and 70W fast charging." },
  { name: "Infinix Note 40 Pro (8GB/256GB)", slug: "infinix-note-40-pro", category: "phones", price: 245000, stock: 42, featured: false, emoji: "📱", description: "Big 6.78-inch AMOLED display, 45W wired plus 20W wireless charging, and a smooth gaming-ready chipset." },
  { name: "iPhone 15 (128GB)", slug: "iphone-15-128gb", category: "phones", price: 1150000, stock: 9, featured: true, emoji: "📱", description: "Dynamic Island, 48MP main camera, A16 Bionic chip and USB-C. Brand new, factory unlocked." },
  // Laptops
  { name: "HP Pavilion 15 (Core i5, 16GB/512GB SSD)", slug: "hp-pavilion-15-core-i5", category: "laptops", price: 780000, stock: 14, featured: true, emoji: "💻", description: "15.6-inch FHD display, 13th-gen Intel Core i5, 16GB RAM and a fast 512GB SSD. Great for work and study." },
  { name: "Lenovo IdeaPad Slim 3 (Ryzen 5, 8GB/512GB)", slug: "lenovo-ideapad-slim-3-ryzen-5", category: "laptops", price: 620000, stock: 18, featured: false, emoji: "💻", description: "Thin and light 15.6-inch laptop with AMD Ryzen 5, all-day battery and a comfortable full-size keyboard." },
  { name: "Dell Inspiron 14 (Core i7, 16GB/1TB SSD)", slug: "dell-inspiron-14-core-i7", category: "laptops", price: 980000, stock: 7, featured: false, emoji: "🖥️", description: "Premium 14-inch aluminium chassis with a 1TB SSD and a powerful Intel Core i7 for demanding workloads." },
  { name: "MacBook Air 13-inch M2 (8GB/256GB)", slug: "macbook-air-13-m2", category: "laptops", price: 1650000, stock: 5, featured: true, emoji: "💻", description: "Fanless, whisper-quiet design with the Apple M2 chip, Liquid Retina display and up to 18 hours of battery life." },
  // Electronics
  { name: "JBL Flip 6 Portable Bluetooth Speaker", slug: "jbl-flip-6-speaker", category: "electronics", price: 125000, stock: 26, featured: true, emoji: "🔊", description: "Bold JBL Pro Sound, IP67 waterproof and dustproof, and 12 hours of playtime. Perfect for the beach or the balcony." },
  { name: "Hisense 43-inch Smart 4K UHD TV", slug: "hisense-43-smart-4k-tv", category: "electronics", price: 335000, stock: 12, featured: false, emoji: "📺", description: "Crisp 4K picture, built-in streaming apps, voice remote and three HDMI ports for all your devices." },
  { name: "Anker 20,000mAh Power Bank", slug: "anker-20000mah-power-bank", category: "electronics", price: 38500, stock: 60, featured: false, emoji: "🔋", description: "High-capacity power bank with fast charging for phones and tablets. A must-have during power cuts." },
  { name: "Oraimo FreePods 4 Wireless Earbuds", slug: "oraimo-freepods-4-earbuds", category: "electronics", price: 29500, stock: 80, featured: true, emoji: "🎧", description: "Active noise cancellation, 35-hour total battery life and a comfortable in-ear fit." },
  // Accessories
  { name: "Oraimo Watch 4 Plus Smartwatch", slug: "oraimo-watch-4-plus", category: "accessories", price: 42000, stock: 45, featured: false, emoji: "⌚", description: "1.95-inch AMOLED display, Bluetooth calling, heart-rate and SpO2 tracking, and 100+ sports modes." },
  { name: "Samsung 25W Super Fast Charger", slug: "samsung-25w-fast-charger", category: "accessories", price: 18500, stock: 70, featured: false, emoji: "🔌", description: "Original USB-C fast charger that tops up compatible Galaxy phones quickly and safely." },
  { name: "Logitech M330 Silent Wireless Mouse", slug: "logitech-m330-silent-mouse", category: "accessories", price: 14500, stock: 55, featured: false, emoji: "🖱️", description: "90% quieter clicks, a contoured grip and up to 24 months of battery life from one AA battery." },
  { name: "Anti-Theft Laptop Backpack (USB Port)", slug: "anti-theft-laptop-backpack", category: "accessories", price: 24500, stock: 38, featured: true, emoji: "🎒", description: "Water-resistant, padded 15.6-inch laptop compartment, hidden zip pockets and a built-in USB charging port." },
  // Fashion
  { name: "Men's Classic Native Senator Wear", slug: "mens-classic-senator-wear", category: "fashion", price: 45000, stock: 22, featured: true, emoji: "👔", description: "Tailored two-piece senator outfit in breathable fabric with refined embroidery. Ideal for events and Sundays." },
  { name: "Women's Ankara Print Maxi Dress", slug: "womens-ankara-maxi-dress", category: "fashion", price: 38000, stock: 27, featured: true, emoji: "👗", description: "Vibrant Ankara print, flattering flared silhouette and a comfortable lined bodice. Made by Nigerian tailors." },
  { name: "Unisex Everyday Running Sneakers", slug: "unisex-running-sneakers", category: "fashion", price: 52000, stock: 33, featured: false, emoji: "👟", description: "Lightweight mesh upper with cushioned soles for all-day comfort, whether you are running or running errands." },
  { name: "Leather Crossbody Bag", slug: "leather-crossbody-bag", category: "fashion", price: 35000, stock: 19, featured: false, emoji: "👜", description: "Genuine leather bag with an adjustable strap and zip compartments, sized for your phone, wallet and essentials." },
  // Home & Living
  { name: "Binatone 1.8L Stainless Electric Kettle", slug: "binatone-electric-kettle-1-8l", category: "home-living", price: 14500, stock: 65, featured: false, emoji: "🫖", description: "Fast-boil stainless steel kettle with auto shut-off and boil-dry protection." },
  { name: "5L Digital Air Fryer", slug: "digital-air-fryer-5l", category: "home-living", price: 58000, stock: 29, featured: true, emoji: "🍟", description: "Cook crispy jollof-friendly sides, plantain and chicken with little to no oil. Digital touch controls and 8 presets." },
  { name: "Queen Size Cotton Bedding Set (4 pieces)", slug: "queen-cotton-bedding-set", category: "home-living", price: 42000, stock: 24, featured: false, emoji: "🛏️", description: "Soft, breathable cotton duvet cover, fitted sheet and two pillowcases. Stays cool in warm weather." },
  { name: "7-Piece Non-Stick Cookware Set", slug: "non-stick-cookware-set-7pc", category: "home-living", price: 48000, stock: 16, featured: false, emoji: "🍳", description: "Durable non-stick pots and pans with heat-resistant handles and tempered glass lids." },
];
