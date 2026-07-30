"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/actions/favorites";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ReviewForm({
  productId,
  farmerId,
}: {
  productId: string;
  farmerId: string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium">Leave a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star
              className={cn(
                "h-5 w-5",
                n <= rating ? "fill-accent text-accent" : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this farmer..."
        rows={3}
      />
      <Button
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await submitReview(productId, farmerId, rating, comment);
            if (result?.error) {
              toast.error(result.error);
            } else {
              toast.success("Review submitted");
              setComment("");
            }
          })
        }
      >
        Submit Review
      </Button>
    </div>
  );
}
