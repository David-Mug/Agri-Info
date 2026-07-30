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

export default async function AdminFarmersPage() {
  const farmers = await prisma.farmerProfile.findMany({
    include: { user: true, _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Farmers</h1>
        <p className="text-sm text-muted-foreground">Manage farmer accounts on the platform.</p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">{farmer.user.name}</TableCell>
                <TableCell>{farmer.user.email}</TableCell>
                <TableCell>{farmer.farmName ?? "—"}</TableCell>
                <TableCell>{farmer.location ?? "—"}</TableCell>
                <TableCell>{farmer._count.products}</TableCell>
                <TableCell>{formatDate(farmer.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={farmer.user.isSuspended ? "destructive" : "default"}>
                    {farmer.user.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <SuspendUserButton userId={farmer.user.id} isSuspended={farmer.user.isSuspended} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
