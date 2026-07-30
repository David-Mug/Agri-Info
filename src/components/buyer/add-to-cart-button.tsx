"use client";

import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/buyer/cart-context";

export function AddToCartButton({
  product,
  disabled,
}: {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <Button
      type="button"
      size="sm"
      className="flex-1"
      disabled={disabled}
      onClick={() => {
        addItem(product);
        toast.success(`${product.name} added to cart`);
      }}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
