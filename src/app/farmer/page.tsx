import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { Package, ShoppingCart, Wallet, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FarmerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const farmer = await prisma.farmerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!farmer) redirect("/login");

  const [totalProducts, activeOrders, transactions, viewsAgg] = await Promise.all([
    prisma.product.count({ where: { farmerId: farmer.id } }),
    prisma.order.count({
      where: { farmerId: farmer.id, status: { in: ["PENDING", "ACCEPTED"] } },
    }),
    prisma.transaction.findMany({
      where: { farmerId: farmer.id, status: "COMPLETED" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.product.aggregate({
      where: { farmerId: farmer.id },
      _sum: { views: true },
    }),
  ]);

  const revenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en", { month: "short" }) };
  });

  const chartData = months.map(({ key, label }) => {
    const [year, month] = key.split("-").map(Number);
    const value = transactions
      .filter((t) => t.createdAt.getFullYear() === year && t.createdAt.getMonth() === month)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { label, value };
  });

  const recentOrders = await prisma.order.findMany({
    where: { farmerId: farmer.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { product: true, buyer: { include: { user: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {session.user.name}</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your farm today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={totalProducts} icon={Package} />
        <StatCard label="Active Orders" value={activeOrders} icon={ShoppingCart} />
        <StatCard label="Revenue" value={formatCurrency(revenue)} icon={Wallet} />
        <StatCard
          label="Product Views"
          value={viewsAgg._sum.views ?? 0}
          icon={Eye}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentOrders.length === 0 && (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          )}
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{order.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {order.orderNumber} · {order.buyer.user.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(order.totalPrice)}</p>
                <p className="text-xs text-muted-foreground">{order.status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
