import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { buyerNav } from "@/lib/nav-config";
import { CartProvider } from "@/components/buyer/cart-context";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "BUYER") {
    redirect("/login");
  }

  return (
    <CartProvider>
      <DashboardShell
        items={buyerNav}
        homeHref="/buyer"
        name={session.user.name ?? "Buyer"}
        email={session.user.email ?? ""}
        roleLabel="Buyer"
        profileHref="/buyer/profile"
      >
        {children}
      </DashboardShell>
    </CartProvider>
  );
}
