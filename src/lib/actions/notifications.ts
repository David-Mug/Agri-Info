"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markAllNotificationsRead(returnPath: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath(returnPath);
  return { success: true };
}
