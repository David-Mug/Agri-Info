import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MessageThread } from "@/components/messages/message-thread";

export const dynamic = "force-dynamic";

export default async function BuyerMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participantA: true,
      participantB: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (
    !conversation ||
    (conversation.participantAId !== session.user.id &&
      conversation.participantBId !== session.user.id)
  ) {
    notFound();
  }

  const other =
    conversation.participantAId === session.user.id
      ? conversation.participantB
      : conversation.participantA;

  return (
    <MessageThread
      conversationId={conversation.id}
      currentUserId={session.user.id}
      otherUserName={other.name}
      messages={conversation.messages}
    />
  );
}
