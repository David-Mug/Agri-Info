import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard, type ProductCardData } from "@/components/buyer/product-card";

export const dynamic = "force-dynamic";

export default async function BuyerFavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!buyer) redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { buyerId: buyer.id },
    include: {
      product: {
        include: { farmer: { include: { user: true } }, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const cards: ProductCardData[] = favorites.map(({ product }) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    quantity: product.quantity,
    unit: product.unit,
    images: product.images,
    availability: product.availability,
    location: product.location,
    farmerName: product.farmer.user.name,
    averageRating: product.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0,
    reviewCount: product.reviews.length,
    favorited: true,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <p className="text-sm text-muted-foreground">Products you&apos;ve saved for later.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.length === 0 && (
          <p className="col-span-full py-16 text-center text-muted-foreground">
            You haven&apos;t saved any products yet.
          </p>
        )}
        {cards.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
