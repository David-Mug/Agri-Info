"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(46,125,50,0.12),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(255,179,0,0.15),transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sprout className="h-4 w-4" />
            Built for African agriculture
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Connecting Farmers{" "}
            <span className="text-primary">Directly</span> with Buyers
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            AgriInfo eliminates unnecessary middlemen so farmers earn
            fairly and buyers get fresh produce — with real-time market
            prices, secure transactions, and delivery tracking built in.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative rounded-3xl border border-border bg-card p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Fresh Produce", color: "bg-secondary/20 text-secondary-foreground" },
                { label: "Verified Farmers", color: "bg-primary/10 text-primary" },
                { label: "Fair Prices", color: "bg-accent/20 text-accent-foreground" },
                { label: "Fast Delivery", color: "bg-secondary/20 text-secondary-foreground" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex h-28 flex-col justify-end rounded-2xl p-4 font-medium ${item.color}`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -top-6 -right-6 -z-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
