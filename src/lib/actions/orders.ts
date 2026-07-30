"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/order-number";

export async function placeOrder(productId: string, quantity: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUYER") {
    return { error: "Not authorized" };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Invalid quantity" };
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!buyer) return { error: "Buyer profile not found" };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "Product not found" };
  if (product.quantity < quantity) {
    return { error: "Not enough stock available" };
  }

  const totalPrice = Number(product.price) * quantity;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        quantity,
        totalPrice,
        productId: product.id,
        buyerId: buyer.id,
        farmerId: product.farmerId,
      },
    });

    await tx.product.update({
      where: { id: product.id },
      data: { quantity: { decrement: quantity } },
    });

    const farmerProfile = await tx.farmerProfile.findUnique({
      where: { id: product.farmerId },
    });

    if (farmerProfile) {
      await tx.notification.create({
        data: {
          userId: farmerProfile.userId,
          type: "NEW_ORDER",
          title: "New order received",
          body: `${quantity} ${product.unit} of ${product.name} — order ${created.orderNumber}`,
          link: "/farmer/orders",
        },
      });
    }

    return created;
  });

  revalidatePath("/buyer/orders");
  revalidatePath("/farmer/orders");
  revalidatePath(`/buyer/marketplace/${productId}`);
  return { success: true, orderId: order.id };
}

async function requireFarmerForOrder(orderId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "FARMER") {
    return { error: "Not authorized" } as const;
  }
  const farmer = await prisma.farmerProfile.findUnique({
    where: { userId: session.user.id },
  });
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!farmer || !order || order.farmerId !== farmer.id) {
    return { error: "Order not found" } as const;
  }
  return { order } as const;
}

export async function acceptOrder(orderId: string) {
  const result = await requireFarmerForOrder(orderId);
  if ("error" in result) return result;
  if (result.order.status !== "PENDING") return { error: "Order already processed" };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "ACCEPTED" },
  });

  const buyer = await prisma.buyerProfile.findUnique({
    where: { id: result.order.buyerId },
  });
  if (buyer) {
    await prisma.notification.create({
      data: {
        userId: buyer.userId,
        type: "ORDER_STATUS",
        title: "Order accepted",
        body: `Your order ${result.order.orderNumber} has been accepted.`,
        link: "/buyer/orders",
      },
    });
  }

  revalidatePath("/farmer/orders");
  revalidatePath("/buyer/orders");
  return { success: true };
}

export async function rejectOrder(orderId: string) {
  const result = await requireFarmerForOrder(orderId);
  if ("error" in result) return result;
  if (result.order.status !== "PENDING") return { error: "Order already processed" };

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "REJECTED" },
    });
    await tx.product.update({
      where: { id: result.order.productId },
      data: { quantity: { increment: result.order.quantity } },
    });
  });

  const buyer = await prisma.buyerProfile.findUnique({
    where: { id: result.order.buyerId },
  });
  if (buyer) {
    await prisma.notification.create({
      data: {
        userId: buyer.userId,
        type: "ORDER_STATUS",
        title: "Order rejected",
        body: `Your order ${result.order.orderNumber} was rejected by the farmer.`,
        link: "/buyer/orders",
      },
    });
  }

  revalidatePath("/farmer/orders");
  revalidatePath("/buyer/orders");
  return { success: true };
}

export async function markDelivered(orderId: string) {
  const result = await requireFarmerForOrder(orderId);
  if ("error" in result) return result;
  if (result.order.status !== "ACCEPTED") return { error: "Order must be accepted first" };

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" },
    });

    await tx.transaction.create({
      data: {
        status: "COMPLETED",
        amount: result.order.totalPrice,
        orderId: result.order.id,
        farmerId: result.order.farmerId,
        buyerId: result.order.buyerId,
      },
    });
  });

  const buyer = await prisma.buyerProfile.findUnique({
    where: { id: result.order.buyerId },
  });
  if (buyer) {
    await prisma.notification.create({
      data: {
        userId: buyer.userId,
        type: "DELIVERY_UPDATE",
        title: "Order delivered",
        body: `Your order ${result.order.orderNumber} has been delivered.`,
        link: "/buyer/orders",
      },
    });
  }

  revalidatePath("/farmer/orders");
  revalidatePath("/buyer/orders");
  revalidatePath("/farmer/transactions");
  revalidatePath("/buyer/transactions");
  return { success: true };
}

export async function cancelOrder(orderId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUYER") {
    return { error: "Not authorized" };
  }
  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  });
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!buyer || !order || order.buyerId !== buyer.id) {
    return { error: "Order not found" };
  }
  if (order.status !== "PENDING") return { error: "Order can no longer be cancelled" };

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
    await tx.product.update({
      where: { id: order.productId },
      data: { quantity: { increment: order.quantity } },
    });
  });

  revalidatePath("/buyer/orders");
  revalidatePath("/farmer/orders");
  return { success: true };
}
