"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  LineChart,
  Receipt,
  Bell,
  Settings,
  User,
  Store,
  Heart,
  Users,
  Tags,
  ClipboardList,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem, IconName } from "@/lib/nav-config";

const icons: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  LineChart,
  Receipt,
  Bell,
  Settings,
  User,
  Store,
  Heart,
  Users,
  Tags,
  ClipboardList,
  ScrollText,
};

export function Sidebar({ items, homeHref }: { items: NavItem[]; homeHref: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <Link href={homeHref} className="flex items-center gap-2 px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="h-4 w-4" />
        </span>
        <span className="font-semibold">AgriInfo</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== homeHref && pathname.startsWith(item.href + "/"));
          const Icon = icons[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
