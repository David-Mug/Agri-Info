import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password, phone, location, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone,
      role,
      ...(role === "FARMER"
        ? { farmerProfile: { create: { location } } }
        : { buyerProfile: { create: { location } } }),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: user.id,
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
