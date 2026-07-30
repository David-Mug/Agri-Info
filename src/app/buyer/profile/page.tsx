import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuyerProfileForm } from "@/components/buyer/buyer-profile-form";

export const dynamic = "force-dynamic";

export default async function BuyerProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { buyerProfile: true },
  });
  if (!user?.buyerProfile) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your buyer account details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          <BuyerProfileForm
            initial={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              companyName: user.buyerProfile.companyName,
              location: user.buyerProfile.location,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
