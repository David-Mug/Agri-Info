import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

type ConversationSummary = {
  id: string;
  otherUserName: string;
  lastMessage: string | null;
  updatedAt: Date;
};

export function ConversationList({
  conversations,
  basePath,
}: {
  conversations: ConversationSummary[];
  basePath: string;
}) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No conversations yet. Start one from a product or order page.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {conversations.map((c) => (
        <Link
          key={c.id}
          href={`${basePath}/${c.id}`}
          className="flex items-center gap-3 p-4 hover:bg-muted/50"
        >
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials(c.otherUserName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{c.otherUserName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {c.lastMessage ?? "No messages yet"}
            </p>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {formatDate(c.updatedAt)}
          </p>
        </Link>
      ))}
    </div>
  );
}
