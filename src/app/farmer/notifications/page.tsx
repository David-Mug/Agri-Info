import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NotificationsList } from "@/components/notifications-list";

export const dynamic = "force-dynamic";

export default async function FarmerNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Stay up to date on orders, deliveries, and messages.
        </p>
      </div>
      <NotificationsList notifications={notifications} returnPath="/farmer/notifications" />
    </div>
  );
}
