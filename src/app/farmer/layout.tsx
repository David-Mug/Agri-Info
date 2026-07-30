import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { farmerNav } from "@/lib/nav-config";

export default async function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "FARMER") {
    redirect("/login");
  }

  return (
    <DashboardShell
      items={farmerNav}
      homeHref="/farmer"
      name={session.user.name ?? "Farmer"}
      email={session.user.email ?? ""}
      roleLabel="Farmer"
      profileHref="/farmer/profile"
    >
      {children}
    </DashboardShell>
  );
}
