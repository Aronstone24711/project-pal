import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SafetyNotice from "@/components/SafetyNotice";

interface DebugProjectProps {
  language: string;
  onBack: () => void;
}

interface FixResult {
  analysis: {
    problemIdentified: string;
    cause: string;
    deviceCompatibility: string;
  };
  fixedCode: {
    filename: string;
    code: string;
    changes: string[];
  };
  explanation: string;
  tips: string[];
  deviceNotes: string;
}

const deviceTypes = [
  { value: "arduino-uno", label: "Arduino Uno" },
  { value: "arduino-nano", label: "Arduino Nano" },
  { value: "arduino-mega", label: "Arduino Mega" },
  { value: "esp32", label: "ESP32" },
  { value: "esp8266", label: "ESP8266 / NodeMCU" },
  { value: "raspberry-pi-pico", label: "Raspberry Pi Pico" },
  { value: "raspberry-pi", label: "Raspberry Pi (Python)" },
  { value: "stm32", label: "STM32" },
  { value: "attiny85", label: "ATtiny85" },
  { value: "teensy", label: "Teensy" },
  { value: "other", label: "Other / Not Sure" },
];

const DebugProject = ({ language, onBack }: DebugProjectProps) => {
  const [deviceType, setDeviceType] = useState("arduino-uno");
  const [currentCode, setCurrentCode] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!problemDescription.trim()) {
      toast({ title: "Describe the problem", description: "Tell us what's going wrong.", variant: "destructive" });
      return;
    }
    if (!currentCode.trim()) {
      toast({ title: "Paste your code", description: "We need the code or program to debug.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: { action: "fix_code", currentCode, problemDescription, deviceType, language },
      });
      if (error) throw error;
      if (data?.analysis && data?.fixedCode) {
        setResult(data);
        toast({ title: "Analysis complete", description: "Found the issue and generated a fix." });
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyFixed = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.fixedCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Code copied" });
  };

  const reset = () => {
    setResult(null);
    setProblemDescription("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Debug a Project</h2>
        <p className="text-muted-foreground">Paste your code, describe the issue, and get an AI-powered fix.</p>
      </div>

      <SafetyNotice />

      {!result ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Device</label>
              <Select value={deviceType} onValueChange={setDeviceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      <div className="flex items-center gap-2"><Cpu className="w-4 h-4" />{d.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your Code / Program</label>
              <Textarea
                placeholder="Paste your full code here..."
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                className="min-h-[200px] font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Describe the Problem</label>
              <Textarea
                placeholder="What happens vs. what you expected? Any error messages? When does it happen?"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full gap-2">
              {isAnalyzing ? (<><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</>) : (<><Wrench className="w-4 h-4" />Analyze & Fix</>)}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" />Problem Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-sm font-medium">Issue:</p><p className="text-sm text-muted-foreground">{result.analysis.problemIdentified}</p></div>
              <div><p className="text-sm font-medium">Cause:</p><p className="text-sm text-muted-foreground">{result.analysis.cause}</p></div>
              {result.analysis.deviceCompatibility && (
                <div><p className="text-sm font-medium">Device Compatibility:</p><p className="text-sm text-muted-foreground">{result.analysis.deviceCompatibility}</p></div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" />Fixed Code</CardTitle>
                <Button variant="outline" size="sm" onClick={copyFixed} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto"><code>{result.fixedCode.code}</code></pre>
              </ScrollArea>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Changes Made:</p>
                <ul className="space-y-1">
                  {result.fixedCode.changes.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{c}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" />Explanation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{result.explanation}</p>
              {result.deviceNotes && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium flex items-center gap-2 mb-1"><Cpu className="w-4 h-4" />Device Notes</p>
                  <p className="text-sm text-muted-foreground">{result.deviceNotes}</p>
                </div>
              )}
              {result.tips?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Tips:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.tips.map((t, i) => (<Badge key={i} variant="secondary" className="text-xs">{t}</Badge>))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button variant="outline" onClick={reset} className="w-full">Debug Another Problem</Button>
        </div>
      )}
    </div>
  );
};

export default DebugProject;