import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { MarketPricesTable } from "@/components/market-prices-table";

export const dynamic = "force-dynamic";

export default async function FarmerMarketPricesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const prices = await prisma.marketPrice.findMany({
    where: q ? { crop: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { crop: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Market Prices</h1>
        <p className="text-sm text-muted-foreground">
          Track real-time crop prices, trends, and supply-demand signals.
        </p>
      </div>

      <form className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Search crops..." />
      </form>

      <MarketPricesTable
        prices={prices.map((p) => ({
          ...p,
          currentPrice: Number(p.currentPrice),
          weeklyChange: Number(p.weeklyChange),
          monthlyChange: Number(p.monthlyChange),
        }))}
      />
    </div>
  );
}
