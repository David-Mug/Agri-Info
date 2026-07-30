import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FarmerProfileForm } from "@/components/farmer/farmer-profile-form";

export const dynamic = "force-dynamic";

export default async function FarmerProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { farmerProfile: true },
  });
  if (!user?.farmerProfile) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          This information is visible to buyers browsing your products.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Farm details</CardTitle>
        </CardHeader>
        <CardContent>
          <FarmerProfileForm
            initial={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              farmName: user.farmerProfile.farmName,
              bio: user.farmerProfile.bio,
              location: user.farmerProfile.location,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
