import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/farmer/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const farmer = await prisma.farmerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!farmer) redirect("/login");

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product || product.farmerId !== farmer.id) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-sm text-muted-foreground">Update your product listing.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            categoryId: product.categoryId,
            price: Number(product.price),
            quantity: product.quantity,
            unit: product.unit,
            description: product.description,
            harvestDate: product.harvestDate
              ? product.harvestDate.toISOString().slice(0, 10)
              : null,
            availability: product.availability,
            location: product.location,
            images: product.images,
          }}
        />
      </div>
    </div>
  );
}
