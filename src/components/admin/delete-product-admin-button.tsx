"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteProductAdmin } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteProductAdminButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() => {
        if (!confirm("Remove this product listing?")) return;
        startTransition(async () => {
          const result = await deleteProductAdmin(productId);
          if (result?.error) toast.error(result.error);
          else toast.success("Product removed");
        });
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
