"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { sendMessage } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
};

export function MessageThread({
  conversationId,
  currentUserId,
  otherUserName,
  messages,
}: {
  conversationId: string;
  currentUserId: string;
  otherUserName: string;
  messages: Message[];
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const action = (formData: FormData) => {
    const content = String(formData.get("content") ?? "");
    startTransition(async () => {
      const result = await sendMessage(conversationId, content);
      if (result?.error) {
        toast.error(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <p className="font-medium">{otherUserName}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Say hello to start the conversation.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xs rounded-2xl px-4 py-2 text-sm sm:max-w-md",
                  mine
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <p>{m.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    mine ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form ref={formRef} action={action} className="flex gap-2 border-t border-border p-4">
        <Input name="content" placeholder="Type a message..." autoComplete="off" required />
        <Button type="submit" size="icon" disabled={pending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
