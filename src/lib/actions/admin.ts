"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "DELIVERED",
  "CANCELLED",
];

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session.user;
}

async function logAction(userId: string, action: string, entity: string, entityId?: string) {
  await prisma.auditLog.create({ data: { userId, action, entity, entityId } });
}

export async function setUserSuspended(
  userId: string,
  suspended: boolean
): Promise<{ success?: true; error?: string }> {
  const admin = await requireAdmin();

  await prisma.user.update({ where: { id: userId }, data: { isSuspended: suspended } });
  await logAction(admin.id, suspended ? "SUSPEND_USER" : "REACTIVATE_USER", "User", userId);

  revalidatePath("/admin/farmers");
  revalidatePath("/admin/buyers");
  return { success: true };
}

export async function deleteProductAdmin(
  productId: string
): Promise<{ success?: true; error?: string }> {
  const admin = await requireAdmin();

  await prisma.product.delete({ where: { id: productId } });
  await logAction(admin.id, "DELETE_PRODUCT", "Product", productId);

  revalidatePath("/admin/products");
  return { success: true };
}

export async function createCategory(formData: FormData) {
  const admin = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) return { error: "Category already exists" };

  const category = await prisma.category.create({ data: { name, slug } });
  await logAction(admin.id, "CREATE_CATEGORY", "Category", category.id);

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  const admin = await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return { error: "Cannot delete a category that still has products" };
  }

  await prisma.category.delete({ where: { id: categoryId } });
  await logAction(admin.id, "DELETE_CATEGORY", "Category", categoryId);

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function upsertMarketPrice(formData: FormData) {
  const admin = await requireAdmin();

  const crop = String(formData.get("crop") ?? "").trim();
  const currentPrice = Number(formData.get("currentPrice"));
  const weeklyChange = Number(formData.get("weeklyChange"));
  const monthlyChange = Number(formData.get("monthlyChange"));
  const supply = String(formData.get("supply") ?? "").trim();
  const demand = String(formData.get("demand") ?? "").trim();
  const unit = String(formData.get("unit") ?? "kg").trim();

  if (!crop || !supply || !demand) return { error: "All fields are required" };
  if (Number.isNaN(currentPrice) || Number.isNaN(weeklyChange) || Number.isNaN(monthlyChange)) {
    return { error: "Prices must be valid numbers" };
  }

  const price = await prisma.marketPrice.upsert({
    where: { crop },
    update: { currentPrice, weeklyChange, monthlyChange, supply, demand, unit },
    create: { crop, currentPrice, weeklyChange, monthlyChange, supply, demand, unit },
  });

  await logAction(admin.id, "UPSERT_MARKET_PRICE", "MarketPrice", price.id);

  revalidatePath("/admin/market-prices");
  revalidatePath("/farmer/market-prices");
  revalidatePath("/buyer/market-prices");
  return { success: true };
}

export async function deleteMarketPrice(
  id: string
): Promise<{ success?: true; error?: string }> {
  const admin = await requireAdmin();

  await prisma.marketPrice.delete({ where: { id } });
  await logAction(admin.id, "DELETE_MARKET_PRICE", "MarketPrice", id);

  revalidatePath("/admin/market-prices");
  revalidatePath("/farmer/market-prices");
  revalidatePath("/buyer/market-prices");
  return { success: true };
}

export async function updateOrderStatusAdmin(orderId: string, status: string) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return { error: "Invalid status" };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}
