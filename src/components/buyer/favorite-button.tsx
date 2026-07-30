"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleFavorite } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  productId,
  initialFavorited,
}: {
  productId: string;
  initialFavorited: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [favorited, setOptimisticFavorited] = useOptimistic(initialFavorited);

  return (
    <button
      type="button"
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      disabled={pending}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur-sm"
      onClick={() => {
        startTransition(async () => {
          setOptimisticFavorited(!favorited);
          const result = await toggleFavorite(productId);
          if (result?.error) toast.error(result.error);
        });
      }}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          favorited ? "fill-destructive text-destructive" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
