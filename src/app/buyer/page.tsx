import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Heart, Clock, PackageCheck, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!buyer) redirect("/login");

  const [pendingOrders, deliveredOrders, favoritesCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { buyerId: buyer.id, status: { in: ["PENDING", "ACCEPTED"] } } }),
    prisma.order.count({ where: { buyerId: buyer.id, status: "DELIVERED" } }),
    prisma.favorite.count({ where: { buyerId: buyer.id } }),
    prisma.order.findMany({
      where: { buyerId: buyer.id },
      include: { product: true, farmer: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {session.user.name}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s an overview of your marketplace activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Orders" value={pendingOrders} icon={Clock} />
        <StatCard label="Delivered Orders" value={deliveredOrders} icon={PackageCheck} />
        <StatCard label="Saved Products" value={favoritesCount} icon={Heart} />
        <StatCard label="Recent Purchases" value={recentOrders.length} icon={ShoppingBag} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent purchases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentOrders.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No orders yet.{" "}
              <Link href="/buyer/marketplace" className="text-primary hover:underline">
                Browse the marketplace
              </Link>
            </div>
          )}
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{order.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {order.farmer.user.name} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">{formatCurrency(order.totalPrice)}</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
