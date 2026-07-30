"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: string; name: string };

type InitialProduct = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  harvestDate: string | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "PREORDER";
  location: string | null;
  images: string[];
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: InitialProduct;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [availability, setAvailability] = useState(
    initial?.availability ?? "IN_STOCK"
  );
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? ""
  );

  const action = async (formData: FormData) => {
    formData.set("availability", availability);
    formData.set("categoryId", categoryId);

    const result = initial
      ? await updateProduct(initial.id, formData)
      : await createProduct(formData);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(initial ? "Product updated" : "Product created");
    router.push("/farmer/products");
    router.refresh();
  };

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={initial?.name} required />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (RWF)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.price}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              defaultValue={initial?.quantity}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" name="unit" defaultValue={initial?.unit ?? "kg"} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="harvestDate">Harvest Date</Label>
          <Input
            id="harvestDate"
            name="harvestDate"
            type="date"
            defaultValue={initial?.harvestDate ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <Label>Availability</Label>
          <Select value={availability} onValueChange={(v) => setAvailability(v as typeof availability)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN_STOCK">In Stock</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              <SelectItem value="PREORDER">Preorder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={initial?.location ?? undefined} placeholder="Musanze, Rwanda" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="images">Image URLs (one per line)</Label>
          <Textarea
            id="images"
            name="images"
            rows={2}
            defaultValue={initial?.images.join("\n")}
            placeholder="https://images.unsplash.com/..."
          />
          <p className="text-xs text-muted-foreground">
            Cloudinary upload isn&apos;t wired up yet — paste image URLs directly for now.
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial?.description}
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
