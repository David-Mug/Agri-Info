"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteMarketPrice } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteMarketPriceButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteMarketPrice(id);
          if (result?.error) toast.error(result.error);
          else toast.success("Price removed");
        })
      }
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
