import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConversationList } from "@/components/messages/conversation-list";

export const dynamic = "force-dynamic";

export default async function FarmerMessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { participantAId: session.user.id },
        { participantBId: session.user.id },
      ],
    },
    include: {
      participantA: true,
      participantB: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Chat directly with buyers about your products.
        </p>
      </div>
      <ConversationList
        basePath="/farmer/messages"
        conversations={conversations.map((c) => {
          const other = c.participantAId === session.user.id ? c.participantB : c.participantA;
          return {
            id: c.id,
            otherUserName: other.name,
            lastMessage: c.messages[0]?.content ?? null,
            updatedAt: c.updatedAt,
          };
        })}
      />
    </div>
  );
}
