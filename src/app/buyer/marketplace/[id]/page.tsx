import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Sprout } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { AddToCartButton } from "@/components/buyer/add-to-cart-button";
import { PlaceOrderForm } from "@/components/buyer/place-order-form";
import { ContactFarmerButton } from "@/components/buyer/contact-farmer-button";
import { ReviewForm } from "@/components/buyer/review-form";
import { ProductCard, type ProductCardData } from "@/components/buyer/product-card";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      farmer: { include: { user: true } },
      reviews: { include: { buyer: { include: { user: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  await prisma.product.update({ where: { id }, data: { views: { increment: 1 } } });

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
    include: { favorites: { where: { productId: id } } },
  });

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: id } },
    include: { farmer: { include: { user: true } }, reviews: true },
    take: 4,
  });

  const favoriteIds = new Set(
    (await prisma.favorite.findMany({ where: { buyerId: buyer?.id } })).map((f) => f.productId)
  );

  const averageRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const relatedCards: ProductCardData[] = related.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    quantity: p.quantity,
    unit: p.unit,
    images: p.images,
    availability: p.availability,
    location: p.location,
    farmerName: p.farmer.user.name,
    averageRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
    favorited: favoriteIds.has(p.id),
  }));

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Sprout className="h-16 w-16" />
            </div>
          )}
          <div className="absolute right-3 top-3">
            <FavoriteButton productId={product.id} initialFavorited={favoriteIds.has(product.id)} />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Badge variant="outline">{product.category.name}</Badge>
            <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {product.location ?? "—"}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {averageRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(product.price)}{" "}
            <span className="text-base font-normal text-muted-foreground">/ {product.unit}</span>
          </p>

          <p className="text-muted-foreground">{product.description}</p>

          {product.harvestDate && (
            <p className="text-sm text-muted-foreground">
              Harvested {formatDate(product.harvestDate)}
            </p>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium">{product.farmer.farmName ?? product.farmer.user.name}</p>
            <p className="text-sm text-muted-foreground">{product.farmer.user.name}</p>
            {product.farmer.bio && (
              <p className="mt-2 text-sm text-muted-foreground">{product.farmer.bio}</p>
            )}
          </div>

          <PlaceOrderForm
            productId={product.id}
            price={Number(product.price)}
            unit={product.unit}
            maxQuantity={product.quantity}
          />

          <div className="grid grid-cols-2 gap-3">
            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                unit: product.unit,
                farmerName: product.farmer.user.name,
                maxQuantity: product.quantity,
                image: product.images[0] ?? null,
              }}
              disabled={product.availability !== "IN_STOCK"}
            />
            <ContactFarmerButton farmerUserId={product.farmer.userId} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="space-y-3">
            {product.reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{review.buyer.user.name}</p>
                  <span className="flex items-center gap-1 text-sm text-accent">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {review.rating}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <ReviewForm productId={product.id} farmerId={product.farmerId} />
      </div>

      {relatedCards.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Related products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedCards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Link href="/buyer/marketplace" className="text-sm text-primary hover:underline">
        ← Back to marketplace
      </Link>
    </div>
  );
}
