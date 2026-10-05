import { z } from "zod";
import { checkoutLineSchema } from "./cart";

export const customerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
  address: z.string().trim().min(5, "Enter your delivery address").max(250),
  city: z.string().trim().min(2, "Enter your city").max(80),
  state: z.string().trim().min(2, "Enter your state").max(80),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  items: z.array(checkoutLineSchema).min(1, "Your cart is empty").max(50),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
