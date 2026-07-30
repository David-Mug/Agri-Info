"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateFarmerProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "FARMER") {
    return { error: "Not authorized" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const farmName = String(formData.get("farmName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!name) return { error: "Name is required" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      phone: phone || null,
      farmerProfile: {
        update: {
          farmName: farmName || null,
          bio: bio || null,
          location: location || null,
        },
      },
    },
  });

  revalidatePath("/farmer/profile");
  return { success: true };
}

export async function updateBuyerProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUYER") {
    return { error: "Not authorized" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!name) return { error: "Name is required" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      phone: phone || null,
      buyerProfile: {
        update: {
          companyName: companyName || null,
          location: location || null,
        },
      },
    },
  });

  revalidatePath("/buyer/profile");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found" };

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect" };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: true };
}
