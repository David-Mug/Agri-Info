"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { cancelOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await cancelOrder(orderId);
          if (result?.error) toast.error(result.error);
        })
      }
    >
      Cancel
    </Button>
  );
}
