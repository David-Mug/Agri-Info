"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setUserSuspended } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function SuspendUserButton({
  userId,
  isSuspended,
}: {
  userId: string;
  isSuspended: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isSuspended ? "default" : "outline"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await setUserSuspended(userId, !isSuspended);
          if (result?.error) toast.error(result.error);
          else toast.success(isSuspended ? "Account reactivated" : "Account suspended");
        })
      }
    >
      {isSuspended ? "Reactivate" : "Suspend"}
    </Button>
  );
}
