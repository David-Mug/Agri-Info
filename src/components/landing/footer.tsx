import Link from "next/link";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-semibold">AgriInfo</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting farmers directly with buyers across Africa.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Platform</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
              <li><Link href="/market-prices" className="hover:text-foreground">Market Prices</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AgriInfo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
