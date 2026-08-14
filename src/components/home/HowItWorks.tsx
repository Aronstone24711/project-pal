import { ScanLine, Lightbulb, CircuitBoard, Wrench } from "lucide-react";

const steps = [
  {
    icon: ScanLine,
    title: "Scan what you own",
    body: "Point the camera at your parts drawer, a sketch or household objects. Everything is identified for you.",
  },
  {
    icon: Lightbulb,
    title: "Pick a project",
    body: "Get buildable ideas matched to the exact parts and board you have — nothing you cannot finish today.",
  },
  {
    icon: CircuitBoard,
    title: "Wire it up",
    body: "Pin-accurate connection lists, optional breadboard view and code that compiles on the first try.",
  },
  {
    icon: Wrench,
    title: "Debug with help",
    body: "Paste an error or describe the symptom and the assistant walks you through the fix, step by step.",
  },
];

const HowItWorks = () => (
  <section className="max-w-5xl mx-auto pt-20" aria-labelledby="how-it-works">
    <div className="border-b border-border/60 pb-4">
      <p className="terminal-label">// how it works</p>
      <h2 id="how-it-works" className="mt-2 text-2xl md:text-3xl font-bold">
        From a pile of parts to a working build
      </h2>
    </div>

    <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="rounded-lg glass p-5">
          <div className="flex items-center justify-between">
            <step.icon className="w-5 h-5 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
          </div>
          <h3 className="mt-3 font-display font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default HowItWorks;