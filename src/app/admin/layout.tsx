import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { adminNav } from "@/lib/nav-config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <DashboardShell
      items={adminNav}
      homeHref="/admin"
      name={session.user.name ?? "Admin"}
      email={session.user.email ?? ""}
      roleLabel="Admin"
      profileHref="/admin"
    >
      {children}
    </DashboardShell>
  );
}
