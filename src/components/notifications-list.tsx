"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, ShoppingCart, Truck, MessageCircle, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { formatDate } from "@/lib/format";

const iconFor: Record<string, typeof Bell> = {
  NEW_ORDER: ShoppingCart,
  ORDER_STATUS: Tag,
  PRICE_UPDATE: Tag,
  PRODUCT_SOLD: ShoppingCart,
  DELIVERY_UPDATE: Truck,
  MESSAGE: MessageCircle,
  SYSTEM: AlertCircle,
};

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
};

export function NotificationsList({
  notifications,
  returnPath,
}: {
  notifications: Notification[];
  returnPath: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={pending || notifications.every((n) => n.isRead)}
          onClick={() =>
            startTransition(async () => {
              const result = await markAllNotificationsRead(returnPath);
              if (result?.error) toast.error(result.error);
            })
          }
        >
          Mark all as read
        </Button>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {notifications.length === 0 && (
          <p className="p-10 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        )}
        {notifications.map((n) => {
          const Icon = iconFor[n.type] ?? Bell;
          const content = (
            <div
              className={`flex items-start gap-3 p-4 ${!n.isRead ? "bg-primary/5" : ""}`}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(n.createdAt)}
                </p>
              </div>
              {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </div>
          );

          return n.link ? (
            <Link key={n.id} href={n.link} className="block hover:bg-muted/50">
              {content}
            </Link>
          ) : (
            <div key={n.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
