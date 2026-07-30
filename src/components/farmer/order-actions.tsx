"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { acceptOrder, rejectOrder, markDelivered } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

export function OrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  const run = (fn: (id: string) => Promise<{ error?: string }>) => {
    startTransition(async () => {
      const result = await fn(orderId);
      if (result?.error) toast.error(result.error);
    });
  };

  if (status === "PENDING") {
    return (
      <div className="flex justify-end gap-2">
        <Button size="sm" disabled={pending} onClick={() => run(acceptOrder)}>
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(rejectOrder)}
        >
          Reject
        </Button>
      </div>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <div className="flex justify-end">
        <Button size="sm" disabled={pending} onClick={() => run(markDelivered)}>
          Mark Delivered
        </Button>
      </div>
    );
  }

  return null;
}
