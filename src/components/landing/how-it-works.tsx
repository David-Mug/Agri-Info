import { UserPlus, Upload, ShoppingCart, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Register", description: "Create a Farmer or Buyer account in minutes." },
  { icon: Upload, title: "Upload Products", description: "Farmers list produce with photos, price, and quantity." },
  { icon: ShoppingCart, title: "Buyer Places Order", description: "Buyers browse the marketplace and place an order." },
  { icon: Truck, title: "Track Delivery", description: "Both sides track the order status in real time." },
  { icon: CheckCircle2, title: "Complete Transaction", description: "Payment and delivery are confirmed and logged." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            From registration to delivery, AgriInfo guides every
            transaction.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <step.icon className="h-6 w-6" />
              </span>
              <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                Step {i + 1}
              </span>
              <h3 className="mt-1 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              {i < steps.length - 1 && (
                <span className="absolute right-[-1rem] top-7 hidden h-px w-8 bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
