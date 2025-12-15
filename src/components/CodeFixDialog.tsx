import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Cpu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CodeFixDialogProps {
  currentCode: string;
  language: string;
  onCodeFixed?: (newCode: string) => void;
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
  { value: "arduino-leonardo", label: "Arduino Leonardo" },
  { value: "arduino-micro", label: "Arduino Micro" },
  { value: "esp32", label: "ESP32" },
  { value: "esp8266", label: "ESP8266 / NodeMCU" },
  { value: "raspberry-pi-pico", label: "Raspberry Pi Pico" },
  { value: "raspberry-pi", label: "Raspberry Pi (Python)" },
  { value: "stm32", label: "STM32" },
  { value: "attiny85", label: "ATtiny85" },
  { value: "teensy", label: "Teensy" },
  { value: "other", label: "Other" },
];

const CodeFixDialog = ({ currentCode, language, onCodeFixed }: CodeFixDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceType, setDeviceType] = useState("arduino-uno");
  const [problemDescription, setProblemDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!problemDescription.trim()) {
      toast({
        title: "Please describe the problem",
        description: "Tell us what issue you're experiencing.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setFixResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: {
          action: "fix_code",
          currentCode,
          problemDescription,
          deviceType,
          language
        }
      });

      if (error) throw error;

      if (data.analysis && data.fixedCode) {
        setFixResult(data);
        toast({
          title: "Analysis Complete!",
          description: "Found the issue and generated a fix."
        });
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyFixedCode = async () => {
    if (fixResult?.fixedCode.code) {
      await navigator.clipboard.writeText(fixResult.fixedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Code Copied!",
        description: "Paste it into your IDE."
      });
    }
  };

  const applyFix = () => {
    if (fixResult?.fixedCode.code && onCodeFixed) {
      onCodeFixed(fixResult.fixedCode.code);
      toast({
        title: "Fix Applied!",
        description: "The corrected code has been applied."
      });
      setIsOpen(false);
    }
  };

  const resetDialog = () => {
    setProblemDescription("");
    setFixResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetDialog(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wrench className="w-4 h-4" />
          Fix Code Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Code Troubleshooter
          </DialogTitle>
          <DialogDescription>
            Describe your problem and select your device to get AI-powered code fixes
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {!fixResult ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Your Device</label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((device) => (
                      <SelectItem key={device.value} value={device.value}>
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4" />
                          {device.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Describe Your Problem</label>
                <Textarea
                  placeholder="Example: The LED doesn't blink, I get a compilation error, the sensor readings are always 0, the code uploads but nothing happens..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Tips for better results:</strong>
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Describe exactly what happens vs what you expected</li>
                  <li>• Mention any error messages you see</li>
                  <li>• Note if the issue happens always or sometimes</li>
                </ul>
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !problemDescription.trim()}
                className="w-full gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    Analyze & Fix Code
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Analysis Result */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Problem Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Issue Identified:</p>
                    <p className="text-sm text-muted-foreground">{fixResult.analysis.problemIdentified}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Cause:</p>
                    <p className="text-sm text-muted-foreground">{fixResult.analysis.cause}</p>
                  </div>
                  {fixResult.analysis.deviceCompatibility && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Device Compatibility:</p>
                      <p className="text-sm text-muted-foreground">{fixResult.analysis.deviceCompatibility}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fixed Code */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Fixed Code
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={copyFixedCode} className="gap-2">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{fixResult.fixedCode.code}</code>
                    </pre>
                  </ScrollArea>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Changes Made:</p>
                    <ul className="space-y-1">
                      {fixResult.fixedCode.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{fixResult.explanation}</p>
                  
                  {fixResult.deviceNotes && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                        <Cpu className="w-4 h-4" />
                        Device-Specific Notes
                      </p>
                      <p className="text-sm text-muted-foreground">{fixResult.deviceNotes}</p>
                    </div>
                  )}

                  {fixResult.tips && fixResult.tips.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">💡 Tips:</p>
                      <div className="flex flex-wrap gap-2">
                        {fixResult.tips.map((tip, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetDialog} className="flex-1">
                  Report Another Issue
                </Button>
                {onCodeFixed && (
                  <Button onClick={applyFix} className="flex-1 gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Apply Fix
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeFixDialog;
