import { ShieldCheck } from "lucide-react";

const SafetyNotice = () => (
  <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    <p>
      Safety check active: harmful, illegal, weapon, malware, and targeted-surveillance requests are blocked.
      Safe projects still include voltage, battery, heat, and tool warnings.
    </p>
  </div>
);

export default SafetyNotice;