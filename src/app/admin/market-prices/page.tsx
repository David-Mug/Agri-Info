import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { MarketPriceForm } from "@/components/admin/market-price-form";
import { DeleteMarketPriceButton } from "@/components/admin/delete-market-price-button";

export const dynamic = "force-dynamic";

export default async function AdminMarketPricesPage() {
  const prices = await prisma.marketPrice.findMany({ orderBy: { crop: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Market Prices</h1>
        <p className="text-sm text-muted-foreground">
          Set the crop prices shown to farmers and buyers.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <MarketPriceForm />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Weekly</TableHead>
              <TableHead>Monthly</TableHead>
              <TableHead>Supply</TableHead>
              <TableHead>Demand</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.crop}</TableCell>
                <TableCell>{formatCurrency(p.currentPrice)} / {p.unit}</TableCell>
                <TableCell>{Number(p.weeklyChange).toFixed(1)}%</TableCell>
                <TableCell>{Number(p.monthlyChange).toFixed(1)}%</TableCell>
                <TableCell>{p.supply}</TableCell>
                <TableCell>{p.demand}</TableCell>
                <TableCell className="text-right">
                  <DeleteMarketPriceButton id={p.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
