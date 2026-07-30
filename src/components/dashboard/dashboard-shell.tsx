import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { NavItem } from "@/lib/nav-config";

export function DashboardShell({
  items,
  homeHref,
  name,
  email,
  roleLabel,
  profileHref,
  children,
}: {
  items: NavItem[];
  homeHref: string;
  name: string;
  email: string;
  roleLabel: string;
  profileHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} homeHref={homeHref} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={name}
          email={email}
          roleLabel={roleLabel}
          profileHref={profileHref}
        />
        <main className="flex-1 overflow-x-hidden bg-muted/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
