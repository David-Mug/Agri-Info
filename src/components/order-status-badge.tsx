import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  PENDING: "bg-accent/20 text-accent-foreground",
  ACCEPTED: "bg-secondary/20 text-secondary-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
  DELIVERED: "bg-primary/10 text-primary",
  CANCELLED: "bg-muted text-muted-foreground",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={styles[status] ?? ""} variant="outline">
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
