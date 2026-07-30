"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateFarmerProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FarmerProfileForm({
  initial,
}: {
  initial: {
    name: string;
    email: string;
    phone: string | null;
    farmName: string | null;
    bio: string | null;
    location: string | null;
  };
}) {
  const [pending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateFarmerProfile(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Profile updated");
    });
  };

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={initial.name} required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={initial.email} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={initial.phone ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmName">Farm name</Label>
          <Input id="farmName" name="farmName" defaultValue={initial.farmName ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={initial.location ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" rows={4} defaultValue={initial.bio ?? ""} />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
