import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(["FARMER", "BUYER"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().positive(),
  unit: z.string().min(1).default("kg"),
  description: z.string().min(10),
  images: z.array(z.string()).default([]),
  harvestDate: z.string().optional(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PREORDER"]).default("IN_STOCK"),
  location: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
