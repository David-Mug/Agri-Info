"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

async function requireFarmerProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "FARMER") {
    throw new Error("Not authorized");
  }
  const profile = await prisma.farmerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Farmer profile not found");
  return profile;
}

export async function createProduct(formData: FormData) {
  const farmer = await requireFarmerProfile();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit") || "kg",
    description: formData.get("description"),
    harvestDate: formData.get("harvestDate") || undefined,
    availability: formData.get("availability") || "IN_STOCK",
    location: formData.get("location") || undefined,
    images: String(formData.get("images") ?? "")
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { harvestDate, ...data } = parsed.data;

  await prisma.product.create({
    data: {
      ...data,
      farmerId: farmer.id,
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
    },
  });

  revalidatePath("/farmer/products");
  return { success: true };
}

export async function updateProduct(productId: string, formData: FormData) {
  const farmer = await requireFarmerProfile();

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.farmerId !== farmer.id) {
    return { error: "Product not found" };
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit") || "kg",
    description: formData.get("description"),
    harvestDate: formData.get("harvestDate") || undefined,
    availability: formData.get("availability") || "IN_STOCK",
    location: formData.get("location") || undefined,
    images: String(formData.get("images") ?? "")
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { harvestDate, ...data } = parsed.data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
    },
  });

  revalidatePath("/farmer/products");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const farmer = await requireFarmerProfile();

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.farmerId !== farmer.id) {
    return { error: "Product not found" };
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/farmer/products");
  return { success: true };
}
