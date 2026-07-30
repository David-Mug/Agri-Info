"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(productId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUYER") {
    return { error: "Not authorized" };
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!buyer) return { error: "Buyer profile not found" };

  const existing = await prisma.favorite.findUnique({
    where: { buyerId_productId: { buyerId: buyer.id, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { buyerId: buyer.id, productId } });
  }

  revalidatePath("/buyer/favorites");
  revalidatePath("/buyer/marketplace");
  revalidatePath(`/buyer/marketplace/${productId}`);
  return { success: true, favorited: !existing };
}

export async function submitReview(
  productId: string,
  farmerId: string,
  rating: number,
  comment: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUYER") {
    return { error: "Not authorized" };
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!buyer) return { error: "Buyer profile not found" };

  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5" };

  await prisma.review.create({
    data: {
      rating,
      comment: comment.trim() || null,
      productId,
      farmerId,
      buyerId: buyer.id,
    },
  });

  revalidatePath(`/buyer/marketplace/${productId}`);
  return { success: true };
}
