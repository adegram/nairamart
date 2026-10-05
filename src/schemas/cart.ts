import { z } from "zod";
import { MAX_ITEM_QUANTITY } from "@/lib/constants";

export const productIdSchema = z.string().uuid();
export const quantitySchema = z.number().int().min(1).max(MAX_ITEM_QUANTITY);

/** Shape persisted in localStorage. Re-validated on load, never trusted on the server. */
export const storedCartItemSchema = z.object({
  productId: productIdSchema,
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(300),
  price: z.number().int().positive(),
  image: z.string().min(1).max(500),
  stock: z.number().int().min(0),
  quantity: quantitySchema,
});

export const storedCartSchema = z.array(storedCartItemSchema).max(50);

export type CartItem = z.infer<typeof storedCartItemSchema>;

/** Minimal payload sent to the server at checkout. Prices are re-read from the DB. */
export const checkoutLineSchema = z.object({
  productId: productIdSchema,
  quantity: quantitySchema,
});
