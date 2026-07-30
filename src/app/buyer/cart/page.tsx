"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/buyer/cart-context";
import { placeOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clear } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const checkout = async () => {
    setCheckingOut(true);
    let failures = 0;

    for (const item of items) {
      const result = await placeOrder(item.productId, item.quantity);
      if (result?.error) {
        failures += 1;
        toast.error(`${item.name}: ${result.error}`);
      }
    }

    setCheckingOut(false);

    if (failures === 0) {
      toast.success("Order placed successfully!");
      clear();
      router.push("/buyer/orders");
      router.refresh();
    } else if (failures < items.length) {
      toast.warning("Some items could not be ordered — check your cart.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Browse the marketplace to add products.</p>
        </div>
        <Button asChild>
          <Link href="/buyer/marketplace">Explore Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-sm text-muted-foreground">Review your items before checking out.</p>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.farmerName}</p>
              <p className="text-sm text-primary">{formatCurrency(item.price)} / {item.unit}</p>
            </div>
            <Input
              type="number"
              min={1}
              max={item.maxQuantity}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value) || 1)}
              className="w-20"
            />
            <p className="w-28 shrink-0 text-right font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold text-primary">{formatCurrency(total)}</span>
      </div>

      <Button className="w-full" size="lg" disabled={checkingOut} onClick={checkout}>
        {checkingOut ? "Placing orders..." : "Checkout"}
      </Button>
    </div>
  );
}
