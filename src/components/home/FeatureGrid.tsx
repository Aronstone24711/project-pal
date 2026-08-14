import { WifiOff, Languages, Baby, MessageSquareCode, ShieldCheck, CloudSun } from "lucide-react";

const features = [
  {
    icon: WifiOff,
    title: "Works offline",
    body: "Saved plans, boards and your own ideas open with no network. Anything you create offline builds itself the moment you reconnect.",
  },
  {
    icon: MessageSquareCode,
    title: "Side-by-side assistant",
    body: "A hardware mentor sits in the corner of every screen with wiring help, code fixes and plain-language explanations.",
  },
  {
    icon: Languages,
    title: "120+ languages",
    body: "Read every instruction in your own language while pin names and code stay in standard English.",
  },
  {
    icon: Baby,
    title: "Tuned to your level",
    body: "Easy, medium or advanced wording — younger builders always get the simplest explanation automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Safety gated",
    body: "Unsafe or inappropriate ideas are declined with a safer alternative suggested instead.",
  },
  {
    icon: CloudSun,
    title: "Live weather theme",
    body: "The interface re-tints itself to the sky outside your window — sunny, rainy, hazy or late night.",
  },
];

const FeatureGrid = () => (
  <section className="max-w-5xl mx-auto pt-20" aria-labelledby="features">
    <div className="border-b border-border/60 pb-4">
      <p className="terminal-label">// what you get</p>
      <h2 id="features" className="mt-2 text-2xl md:text-3xl font-bold">
        Built for real workshops, not perfect ones
      </h2>
    </div>

    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <li key={feature.title} className="rounded-lg glass p-5">
          <feature.icon className="w-5 h-5 text-primary" />
          <h3 className="mt-3 font-display font-semibold">{feature.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default FeatureGrid;