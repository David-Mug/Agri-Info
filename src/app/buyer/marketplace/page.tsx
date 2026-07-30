import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard, type ProductCardData } from "@/components/buyer/product-card";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  sort?: string;
};

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sp = await searchParams;

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
    include: { favorites: true },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Prisma.ProductWhereInput = {};
  if (sp.q) where.name = { contains: sp.q, mode: "insensitive" };
  if (sp.category && sp.category !== "all") where.categoryId = sp.category;
  if (sp.location) where.location = { contains: sp.location, mode: "insensitive" };
  if (sp.availability && sp.availability !== "all") {
    where.availability = sp.availability as Prisma.EnumProductAvailabilityFilter["equals"];
  }
  if (sp.minPrice || sp.maxPrice) {
    where.price = {
      ...(sp.minPrice ? { gte: Number(sp.minPrice) } : {}),
      ...(sp.maxPrice ? { lte: Number(sp.maxPrice) } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sp.sort === "price_asc"
      ? { price: "asc" }
      : sp.sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      farmer: { include: { user: true } },
      reviews: true,
    },
  });

  const favoriteIds = new Set(buyer?.favorites.map((f) => f.productId) ?? []);

  let cards: ProductCardData[] = products.map((p) => ({
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

  if (sp.sort === "rating") {
    cards = [...cards].sort((a, b) => b.averageRating - a.averageRating);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Browse fresh produce listed directly by farmers.
        </p>
      </div>

      <form className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6">
        <Input name="q" defaultValue={sp.q} placeholder="Search products..." className="lg:col-span-2" />
        <Input name="location" defaultValue={sp.location} placeholder="Location" />
        <Input name="minPrice" type="number" defaultValue={sp.minPrice} placeholder="Min price" />
        <Input name="maxPrice" type="number" defaultValue={sp.maxPrice} placeholder="Max price" />

        <Select name="category" defaultValue={sp.category ?? "all"}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select name="availability" defaultValue={sp.availability ?? "all"}>
          <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any availability</SelectItem>
            <SelectItem value="IN_STOCK">In Stock</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            <SelectItem value="PREORDER">Preorder</SelectItem>
          </SelectContent>
        </Select>

        <Select name="sort" defaultValue={sp.sort ?? "newest"}>
          <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" className="lg:col-span-1">Apply Filters</Button>
      </form>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.length === 0 && (
          <p className="col-span-full py-16 text-center text-muted-foreground">
            No products match your filters.
          </p>
        )}
        {cards.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
