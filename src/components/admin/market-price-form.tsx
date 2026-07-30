"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { upsertMarketPrice } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MarketPriceForm() {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertMarketPrice(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Market price saved");
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} action={action} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
      <div className="space-y-1">
        <Label htmlFor="crop">Crop</Label>
        <Input id="crop" name="crop" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="currentPrice">Price (RWF)</Label>
        <Input id="currentPrice" name="currentPrice" type="number" step="0.01" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="unit">Unit</Label>
        <Input id="unit" name="unit" defaultValue="kg" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="weeklyChange">Weekly % change</Label>
        <Input id="weeklyChange" name="weeklyChange" type="number" step="0.1" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="monthlyChange">Monthly % change</Label>
        <Input id="monthlyChange" name="monthlyChange" type="number" step="0.1" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="supply">Supply</Label>
        <Input id="supply" name="supply" placeholder="Low / Medium / High" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="demand">Demand</Label>
        <Input id="demand" name="demand" placeholder="Low / Medium / High" required />
      </div>
      <Button type="submit" disabled={pending} className="sm:col-span-3 lg:col-span-7">
        Save Price
      </Button>
    </form>
  );
}
