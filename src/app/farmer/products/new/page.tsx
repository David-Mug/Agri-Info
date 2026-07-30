import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/farmer/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          List a new product for buyers to discover.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
