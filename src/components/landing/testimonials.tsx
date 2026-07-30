import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jean Baptiste Uwimana",
    role: "Farmer, Musanze",
    quote:
      "I used to lose most of my margin to middlemen. Now I sell directly to buyers in Kigali and my income has nearly doubled.",
  },
  {
    name: "Alice Mukamana",
    role: "Buyer, Kigali Fresh Market",
    quote:
      "Real-time market prices help me plan purchases confidently, and I can chat with farmers before every order.",
  },
  {
    name: "Eric Niyonzima",
    role: "Farmer, Huye",
    quote:
      "Order tracking and notifications mean I never miss a delivery window. It's transformed how I run my farm.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Trusted by farmers and buyers
        </h2>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
