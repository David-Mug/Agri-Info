"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { placeOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

export function PlaceOrderForm({
  productId,
  price,
  unit,
  maxQuantity,
}: {
  productId: string;
  price: number;
  unit: string;
  maxQuantity: number;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();

  const total = price * quantity;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity ({unit})</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.min(Number(e.target.value) || 1, maxQuantity))}
        />
        <p className="text-xs text-muted-foreground">{maxQuantity} {unit} available</p>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-semibold text-primary">{formatCurrency(total)}</span>
      </div>

      <Button
        className="w-full"
        disabled={pending || maxQuantity === 0}
        onClick={() => {
          startTransition(async () => {
            const result = await placeOrder(productId, quantity);
            if (result?.error) {
              toast.error(result.error);
            } else {
              toast.success("Order placed!");
              router.push("/buyer/orders");
              router.refresh();
            }
          });
        }}
      >
        {pending ? "Placing order..." : "Place Order"}
      </Button>
    </div>
  );
}
