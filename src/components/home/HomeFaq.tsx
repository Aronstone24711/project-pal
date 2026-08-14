import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need to sign in?",
    a: "No. You can use everything as a guest. Signing in only adds syncing across your devices.",
  },
  {
    q: "Does it really work without internet?",
    a: "Yes. The app installs to your device, and saved build plans, boards and your own project ideas open offline. New ideas queue up and generate automatically when you are back online.",
  },
  {
    q: "Which boards are supported?",
    a: "Arduino, ESP32, Raspberry Pi and STM32 out of the box, plus any board you add yourself — specs are fetched for you when you are online.",
  },
  {
    q: "Can I bring my own idea?",
    a: "Yes. Describe it in a sentence or upload a photo of a sketch and you get a personalised plan with parts, wiring, steps and code in your workspace.",
  },
];

const HomeFaq = () => (
  <section className="max-w-3xl mx-auto pt-20" aria-labelledby="faq">
    <div className="border-b border-border/60 pb-4">
      <p className="terminal-label">// questions</p>
      <h2 id="faq" className="mt-2 text-2xl md:text-3xl font-bold">
        Before you start
      </h2>
    </div>

    <Accordion type="single" collapsible className="mt-4">
      {faqs.map((faq) => (
        <AccordionItem key={faq.q} value={faq.q}>
          <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default HomeFaq;