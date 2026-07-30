"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function roleBasePath(role: string) {
  if (role === "FARMER") return "/farmer";
  if (role === "BUYER") return "/buyer";
  return "/admin";
}

export async function startConversation(otherUserId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (otherUserId === session.user.id) {
    return { error: "You cannot message yourself" };
  }

  const [a, b] = [session.user.id, otherUserId].sort();

  const conversation = await prisma.conversation.upsert({
    where: { participantAId_participantBId: { participantAId: a, participantBId: b } },
    update: {},
    create: { participantAId: a, participantBId: b },
  });

  redirect(`${roleBasePath(session.user.role)}/messages/${conversation.id}`);
}

export async function sendMessage(conversationId: string, content: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };
  if (!content.trim()) return { error: "Message cannot be empty" };

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (
    !conversation ||
    (conversation.participantAId !== session.user.id &&
      conversation.participantBId !== session.user.id)
  ) {
    return { error: "Conversation not found" };
  }

  const otherUserId =
    conversation.participantAId === session.user.id
      ? conversation.participantBId
      : conversation.participantAId;

  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
  if (!otherUser) return { error: "Recipient not found" };

  await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: content.trim(),
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
    prisma.notification.create({
      data: {
        userId: otherUserId,
        type: "MESSAGE",
        title: "New message",
        body: content.trim().slice(0, 100),
        link: `${roleBasePath(otherUser.role)}/messages/${conversationId}`,
      },
    }),
  ]);

  revalidatePath(`/farmer/messages/${conversationId}`);
  revalidatePath(`/buyer/messages/${conversationId}`);
  return { success: true };
}
