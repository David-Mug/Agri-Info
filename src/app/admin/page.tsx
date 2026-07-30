import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { Users, Sprout, ShoppingBasket, Package, Wallet, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    farmers,
    buyers,
    products,
    transactions,
    todayTransactions,
    recentLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.farmerProfile.count(),
    prisma.buyerProfile.count(),
    prisma.product.count(),
    prisma.transaction.findMany({ where: { status: "COMPLETED" }, orderBy: { createdAt: "asc" } }),
    prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

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

  const thisMonthTransactions = transactions.filter(
    (t) => t.createdAt.getFullYear() === now.getFullYear() && t.createdAt.getMonth() === now.getMonth()
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide activity across farmers, buyers, and transactions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={Users} />
        <StatCard label="Farmers" value={farmers} icon={Sprout} />
        <StatCard label="Buyers" value={buyers} icon={ShoppingBasket} />
        <StatCard label="Products" value={products} icon={Package} />
        <StatCard
          label="Daily Sales"
          value={formatCurrency(todayTransactions._sum.amount ?? 0)}
          icon={TrendingUp}
          hint={`${todayTransactions._count} transactions today`}
        />
        <StatCard label="Monthly Transactions" value={thisMonthTransactions} icon={TrendingUp} />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={Wallet} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLogs.length === 0 && (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          )}
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{log.action.replaceAll("_", " ")}</p>
                <p className="text-xs text-muted-foreground">
                  {log.entity} · {log.user?.name ?? "System"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
