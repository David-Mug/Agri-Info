import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [farmers, buyers, products, transactions] = await Promise.all([
    prisma.farmerProfile.count(),
    prisma.buyerProfile.count(),
    prisma.product.count(),
    prisma.transaction.count(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats
          farmers={farmers}
          buyers={buyers}
          products={products}
          transactions={transactions}
        />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
