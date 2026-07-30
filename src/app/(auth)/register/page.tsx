import Link from "next/link";
import { Sprout, ShoppingBasket } from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose how you want to use AgriInfo
        </p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/register/farmer"
          className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Register as Farmer</p>
            <p className="text-sm text-muted-foreground">
              List your products and sell directly to buyers
            </p>
          </div>
        </Link>

        <Link
          href="/register/buyer"
          className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
            <ShoppingBasket className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Register as Buyer</p>
            <p className="text-sm text-muted-foreground">
              Browse the marketplace and order fresh produce
            </p>
          </div>
        </Link>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
