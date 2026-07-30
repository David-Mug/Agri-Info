import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { SuspendUserButton } from "@/components/admin/suspend-user-button";

export const dynamic = "force-dynamic";

export default async function AdminBuyersPage() {
  const buyers = await prisma.buyerProfile.findMany({
    include: { user: true, _count: { select: { ordersAsBuyer: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buyers</h1>
        <p className="text-sm text-muted-foreground">Manage buyer accounts on the platform.</p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyers.map((buyer) => (
              <TableRow key={buyer.id}>
                <TableCell className="font-medium">{buyer.user.name}</TableCell>
                <TableCell>{buyer.user.email}</TableCell>
                <TableCell>{buyer.companyName ?? "—"}</TableCell>
                <TableCell>{buyer.location ?? "—"}</TableCell>
                <TableCell>{buyer._count.ordersAsBuyer}</TableCell>
                <TableCell>{formatDate(buyer.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={buyer.user.isSuspended ? "destructive" : "default"}>
                    {buyer.user.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <SuspendUserButton userId={buyer.user.id} isSuspended={buyer.user.isSuspended} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
