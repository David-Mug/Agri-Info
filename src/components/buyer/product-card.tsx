import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { AddToCartButton } from "@/components/buyer/add-to-cart-button";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  images: string[];
  availability: string;
  location: string | null;
  farmerName: string;
  averageRating: number;
  reviewCount: number;
  favorited: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];

  return (
    <Card className="group overflow-hidden pt-0">
      <div className="relative aspect-4/3 bg-muted">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Sprout className="h-10 w-10" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <FavoriteButton productId={product.id} initialFavorited={product.favorited} />
        </div>
        {product.availability !== "IN_STOCK" && (
          <Badge className="absolute left-2 top-2" variant="secondary">
            {product.availability === "OUT_OF_STOCK" ? "Out of Stock" : "Preorder"}
          </Badge>
        )}
      </div>

      <div className="space-y-3 p-4 pt-0">
        <div>
          <Link href={`/buyer/marketplace/${product.id}`}>
            <h3 className="font-medium hover:underline">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.farmerName}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {product.location ?? "—"}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {product.averageRating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-primary">{formatCurrency(product.price)}</p>
            <p className="text-xs text-muted-foreground">
              {product.quantity} {product.unit} available
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <AddToCartButton
            product={{
              productId: product.id,
              name: product.name,
              price: product.price,
              unit: product.unit,
              farmerName: product.farmerName,
              maxQuantity: product.quantity,
              image: image ?? null,
            }}
            disabled={product.availability !== "IN_STOCK"}
          />
        </div>
      </div>
    </Card>
  );
}
