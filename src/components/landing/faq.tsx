import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does AgriInfo eliminate middlemen?",
    a: "Farmers list products directly and buyers order straight from them — no intermediaries involved in the transaction.",
  },
  {
    q: "Is there a fee to join as a farmer or buyer?",
    a: "Creating an account and browsing the marketplace is free. Any transaction fees are shown clearly before you confirm an order.",
  },
  {
    q: "How are market prices calculated?",
    a: "Market prices reflect recent transactions and reported supply and demand across the platform, updated regularly.",
  },
  {
    q: "Can I chat with a farmer before ordering?",
    a: "Yes — buyers and farmers can message each other directly from any product page to ask questions before placing an order.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
