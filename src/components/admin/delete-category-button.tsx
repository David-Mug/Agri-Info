"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteCategory(categoryId);
          if (result?.error) toast.error(result.error);
          else toast.success("Category deleted");
        })
      }
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
