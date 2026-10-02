import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Calculator, Cpu, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { boardKnowledge, resistorColorGuide } from "@/data/boardKnowledge";
import type { CustomBoard } from "@/hooks/useCustomBoards";

interface BoardKnowledgeProps {
  englishLevel: string;
  customBoards?: CustomBoard[];
  onAskPal: (question: string, context: string) => void;
}

const BoardKnowledge = ({ englishLevel, customBoards = [], onAskPal }: BoardKnowledgeProps) => {
  const options = useMemo(() => [
    ...Object.entries(boardKnowledge).map(([key, board]) => ({ value: key, label: board.label })),
    ...customBoards.map((board) => ({ value: `custom:${board.id}`, label: board.name })),
  ], [customBoards]);
  const [selected, setSelected] = useState("Arduino");
  const [supply, setSupply] = useState("5");
  const [ledDrop, setLedDrop] = useState("2");
  const [current, setCurrent] = useState("10");
  const customBoard = customBoards.find((board) => selected === `custom:${board.id}`);
  const board = customBoard
    ? {
        label: customBoard.name,
        overview: customBoard.details?.notes || `${customBoard.name} board reference saved on this device. Confirm all pin labels and limits against its manufacturer's pinout before connecting components.`,
        pins: [
          { group: "Board details", pins: customBoard.details?.mcu || "MCU not specified", purpose: customBoard.details?.family || "Use the board's official documentation to identify valid pins." },
          { group: "Logic voltage", pins: customBoard.details?.logicVoltage || "Not specified", purpose: "Check voltage compatibility before connecting any signal." },
          { group: "Communication", pins: customBoard.details?.communication?.join(", ") || "Not specified", purpose: "Confirm the pin assignments in the board documentation." },
        ],
        components: [
          { name: "Resistor", job: "Limits current or sets signal levels; it has no polarity.", use: "For an LED, calculate (board logic voltage − LED forward voltage) ÷ desired current, then choose the next higher common resistor value.", caution: `This board's safe logic voltage is ${customBoard.details?.logicVoltage || "unknown"}. Confirm its pinout and limits before wiring.` },
          { name: "LED", job: "Emits light when current flows in one direction.", use: "Long leg is usually anode; short leg / flat edge is usually cathode. Always add a series resistor." },
          { name: "Push button", job: "Creates a human-operated input.", use: "Connect to a documented input and a valid logic level; check whether the board provides an internal pull-up." },
          { name: "Sensor", job: "Measures a physical value.", use: "Check supply voltage, output voltage, and interface against the board specifications." },
          { name: "Buzzer", job: "Makes a tone or alert.", use: "Check its voltage and current; use a driver if it exceeds the board pin rating." },
        ],
        examples: [{ title: "Start safely", parts: [customBoard.name, "Board pinout or manual"], wiring: ["Identify a documented GPIO pin and GND", "Check operating voltage and pin current limits before attaching a component."], note: "Custom board-specific example code is not generated from saved board details." }],
      }
    : boardKnowledge[selected] || boardKnowledge.Arduino;
  const requiredResistance = (() => {
    const volts = Number(supply) - Number(ledDrop);
    const amps = Number(current) / 1000;
    return Number.isFinite(volts) && Number.isFinite(amps) && volts > 0 && amps > 0 ? Math.ceil(volts / amps) : null;
  })();
  const context = `${board.label} reference: ${board.overview}\nPin notes: ${board.pins.map((pin) => `${pin.group} (${pin.pins}): ${pin.purpose} ${pin.caution || ""}`).join("; ")}\nSafety: confirm the board pinout and voltage before wiring.`;

  return (
    <section className="mx-auto max-w-5xl pt-20" aria-labelledby="board-knowledge-title">
      <div className="border-b border-border/60 pb-4">
        <p className="terminal-label">// board field guide</p>
        <h2 id="board-knowledge-title" className="mt-2 text-2xl font-bold md:text-3xl">Know your board</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{englishLevel === "hard" ? "Pin reference, component behavior, and practical circuit examples." : englishLevel === "medium" ? "Plain-language pin functions, components, and practical examples." : "Simple words explain what pins and parts do, with safe steps to try."}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-primary" />
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full sm:w-72" aria-label="Choose a board"><SelectValue /></SelectTrigger>
            <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => onAskPal(`Explain ${board.label} pins and help me safely connect a resistor and LED.`, context)}>
          <MessageCircle className="h-4 w-4" /> Ask Pal about this board
        </Button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{board.overview}</p>

      <Tabs defaultValue="pins" className="mt-6">
        <TabsList className="grid h-auto w-full grid-cols-3">
          <TabsTrigger value="pins" className="gap-2"><Cpu className="h-4 w-4" /><span>Pins</span></TabsTrigger>
          <TabsTrigger value="parts" className="gap-2"><Zap className="h-4 w-4" /><span>Components</span></TabsTrigger>
          <TabsTrigger value="examples" className="gap-2"><BookOpen className="h-4 w-4" /><span>Examples</span></TabsTrigger>
        </TabsList>
        <TabsContent value="pins" className="mt-4">
          <div className="divide-y divide-border/60 border-y border-border/60">
            {board.pins.map((pin) => (
              <article key={pin.group} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr] sm:gap-4">
                <div><h3 className="font-semibold">{pin.group}</h3><p className="font-mono text-xs text-primary">{pin.pins}</p></div>
                <div><p className="text-sm text-muted-foreground">{pin.purpose}</p>{pin.caution && <p className="mt-2 flex gap-2 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{pin.caution}</p>}</div>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="parts" className="mt-4 space-y-6">
          <div className="divide-y divide-border/60 border-y border-border/60">
            {board.components.map((part) => (
              <article key={part.name} className="py-4">
                <h3 className="font-semibold">{part.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{part.job}</p>
                <p className="mt-2 text-sm">{part.use}</p>
                {part.caution && <p className="mt-2 flex gap-2 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{part.caution}</p>}
              </article>
            ))}
          </div>

          <div className="border-y border-border/60 py-5">
            <div className="flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" /><h3 className="font-semibold">LED resistor helper</h3></div>
            <p className="mt-1 text-sm text-muted-foreground">Estimate a series resistor: (supply voltage − LED voltage) ÷ current in amps.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-xs text-muted-foreground">Supply voltage (V)<Input aria-label="Supply voltage" type="number" min="0.1" step="0.1" value={supply} onChange={(event) => setSupply(event.target.value)} className="mt-1" /></label>
              <label className="text-xs text-muted-foreground">LED voltage (V)<Input aria-label="LED voltage" type="number" min="0" step="0.1" value={ledDrop} onChange={(event) => setLedDrop(event.target.value)} className="mt-1" /></label>
              <label className="text-xs text-muted-foreground">LED current (mA)<Input aria-label="LED current" type="number" min="0.1" step="1" value={current} onChange={(event) => setCurrent(event.target.value)} className="mt-1" /></label>
            </div>
            <p className="mt-3 text-sm font-medium" aria-live="polite">{requiredResistance ? `Estimate: ${requiredResistance}Ω or the next higher common value (for example ${requiredResistance <= 220 ? "220Ω or 330Ω" : requiredResistance <= 330 ? "330Ω" : "a suitable standard value above this estimate"}).` : "Enter valid values with supply voltage higher than LED voltage."}</p>
            <p className="mt-1 text-xs text-muted-foreground">This is an estimate, not a substitute for checking the LED datasheet and the board's pin-current limit. A resistor has no polarity; put it in series with the LED.</p>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Read resistor color bands</summary>
              <p className="mt-2 text-sm text-muted-foreground">For a common 4-band resistor, the first two bands are digits, the third multiplies, and the last is tolerance. Example: orange–orange–brown–gold = 33 × 10 = 330Ω ±5%.</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">{resistorColorGuide.map(({ digit, color }) => <span key={color} className="font-mono text-xs text-muted-foreground">{color} {digit}</span>)}</div>
              <p className="mt-2 text-xs text-muted-foreground">Band order matters; the tolerance band is often spaced apart. If unsure, measure the isolated resistor with a multimeter set to resistance, never in a powered circuit.</p>
            </details>
          </div>
        </TabsContent>
        <TabsContent value="examples" className="mt-4 space-y-5">
          {board.examples.map((example) => (
            <article key={example.title} className="border-b border-border/60 pb-5">
              <h3 className="font-semibold">{example.title}</h3>
              <p className="mt-2 text-xs font-medium uppercase text-muted-foreground">Parts</p>
              <p className="text-sm">{example.parts.join(" · ")}</p>
              <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">Wiring</p>
              <ol className="mt-1 list-inside list-decimal space-y-1 text-sm text-muted-foreground">{example.wiring.map((line) => <li key={line}>{line}</li>)}</ol>
              {example.code && <pre className="mt-3 max-h-80 overflow-auto rounded border border-border bg-background/70 p-4 text-xs leading-relaxed"><code>{example.code}</code></pre>}
              {example.note && <p className="mt-2 text-xs text-muted-foreground">{example.note}</p>}
            </article>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default BoardKnowledge;