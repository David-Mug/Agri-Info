import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">AgriInfo</span>
        </Link>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,179,0,0.25),transparent_45%)]" />
        <div className="relative z-10 flex h-full flex-col justify-end p-16 text-primary-foreground">
          <blockquote className="text-3xl font-semibold leading-snug">
            &ldquo;Connecting Farmers Directly with Buyers.&rdquo;
          </blockquote>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Sell your harvest without middlemen, track real-time market
            prices, and get paid fairly — all in one platform built for
            African agriculture.
          </p>
        </div>
      </div>
    </div>
  );
}
