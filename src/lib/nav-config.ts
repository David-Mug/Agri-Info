export type IconName =
  | "LayoutDashboard"
  | "Package"
  | "ShoppingCart"
  | "MessageCircle"
  | "LineChart"
  | "Receipt"
  | "Bell"
  | "Settings"
  | "User"
  | "Store"
  | "Heart"
  | "Users"
  | "Tags"
  | "ClipboardList"
  | "ScrollText";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

export const farmerNav: NavItem[] = [
  { href: "/farmer", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/farmer/products", label: "Products", icon: "Package" },
  { href: "/farmer/orders", label: "Orders", icon: "ShoppingCart" },
  { href: "/farmer/messages", label: "Messages", icon: "MessageCircle" },
  { href: "/farmer/market-prices", label: "Market Prices", icon: "LineChart" },
  { href: "/farmer/transactions", label: "Transactions", icon: "Receipt" },
  { href: "/farmer/notifications", label: "Notifications", icon: "Bell" },
  { href: "/farmer/settings", label: "Settings", icon: "Settings" },
  { href: "/farmer/profile", label: "Profile", icon: "User" },
];

export const buyerNav: NavItem[] = [
  { href: "/buyer", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/buyer/marketplace", label: "Marketplace", icon: "Store" },
  { href: "/buyer/cart", label: "Cart", icon: "ShoppingCart" },
  { href: "/buyer/orders", label: "Orders", icon: "ClipboardList" },
  { href: "/buyer/favorites", label: "Favorites", icon: "Heart" },
  { href: "/buyer/messages", label: "Messages", icon: "MessageCircle" },
  { href: "/buyer/transactions", label: "Transactions", icon: "Receipt" },
  { href: "/buyer/notifications", label: "Notifications", icon: "Bell" },
  { href: "/buyer/settings", label: "Settings", icon: "Settings" },
  { href: "/buyer/profile", label: "Profile", icon: "User" },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/farmers", label: "Farmers", icon: "Users" },
  { href: "/admin/buyers", label: "Buyers", icon: "Users" },
  { href: "/admin/products", label: "Products", icon: "Package" },
  { href: "/admin/orders", label: "Orders", icon: "ShoppingCart" },
  { href: "/admin/categories", label: "Categories", icon: "Tags" },
  { href: "/admin/market-prices", label: "Market Prices", icon: "LineChart" },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: "ScrollText" },
];
