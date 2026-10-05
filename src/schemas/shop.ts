import { z } from "zod";

export const shopParamsSchema = z.object({
  category: z.string().trim().max(50).optional().catch(undefined),
  q: z.string().trim().max(80).optional().catch(undefined),
  sort: z.enum(["newest", "price-asc", "price-desc"]).catch("newest"),
});

export type ShopParams = z.infer<typeof shopParamsSchema>;
