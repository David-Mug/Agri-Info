const items = (stats: {
  farmers: number;
  buyers: number;
  products: number;
  transactions: number;
}) => [
  { label: "Registered Farmers", value: stats.farmers },
  { label: "Buyers", value: stats.buyers },
  { label: "Products Listed", value: stats.products },
  { label: "Transactions", value: stats.transactions },
];

export function Stats(props: {
  farmers: number;
  buyers: number;
  products: number;
  transactions: number;
}) {
  return (
    <section className="border-y border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {items(props).map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-primary sm:text-4xl">
              {stat.value.toLocaleString()}+
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
