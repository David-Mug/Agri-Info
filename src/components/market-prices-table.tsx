import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";

type MarketPrice = {
  id: string;
  crop: string;
  currentPrice: number | string;
  weeklyChange: number | string;
  monthlyChange: number | string;
  supply: string;
  demand: string;
  unit: string;
};

function ChangeCell({ value }: { value: number | string }) {
  const num = Number(value);
  const positive = num >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        positive ? "text-primary" : "text-destructive"
      }`}
    >
      {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {positive ? "+" : ""}
      {num.toFixed(1)}%
    </span>
  );
}

export function MarketPricesTable({ prices }: { prices: MarketPrice[] }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Crop</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Weekly Change</TableHead>
            <TableHead>Monthly Trend</TableHead>
            <TableHead>Supply</TableHead>
            <TableHead>Demand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No market price data yet.
              </TableCell>
            </TableRow>
          )}
          {prices.map((price) => (
            <TableRow key={price.id}>
              <TableCell className="font-medium">{price.crop}</TableCell>
              <TableCell>
                {formatCurrency(price.currentPrice)} / {price.unit}
              </TableCell>
              <TableCell>
                <ChangeCell value={price.weeklyChange} />
              </TableCell>
              <TableCell>
                <ChangeCell value={price.monthlyChange} />
              </TableCell>
              <TableCell>{price.supply}</TableCell>
              <TableCell>{price.demand}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
