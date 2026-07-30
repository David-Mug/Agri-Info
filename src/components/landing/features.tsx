import {
  Handshake,
  LineChart,
  Truck,
  MessageCircle,
  Bell,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Handshake,
    title: "Sell Directly",
    description:
      "Farmers list products and sell straight to buyers — no middlemen taking a cut.",
  },
  {
    icon: LineChart,
    title: "Real-Time Market Prices",
    description:
      "Track crop prices, weekly and monthly trends, supply and demand at a glance.",
  },
  {
    icon: Truck,
    title: "Product Tracking",
    description:
      "Follow every order from acceptance to delivery with live status updates.",
  },
  {
    icon: MessageCircle,
    title: "Buyer Communication",
    description:
      "Chat directly with farmers or buyers to negotiate and coordinate deliveries.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Instant alerts for new orders, price changes, and delivery updates.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    description:
      "Role-based access, encrypted passwords, and audited transaction history.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to trade produce
        </h2>
        <p className="mt-4 text-muted-foreground">
          A complete toolkit for farmers and buyers to connect, transact, and
          grow together.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
