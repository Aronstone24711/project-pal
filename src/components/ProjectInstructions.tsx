import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check,
  Wrench,
  Code,
  TestTube,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Component, Project, ProjectInstructions as ProjectInstructionsType, InstructionStep } from "@/types/arduino";

interface ProjectInstructionsProps {
  project: Project;
  components: Component[];
  onBack: () => void;
  language: string;
}

const ProjectInstructions = ({ project, components, onBack, language }: ProjectInstructionsProps) => {
  const [instructions, setInstructions] = useState<ProjectInstructionsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstructions();
  }, [project]);

  const fetchInstructions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: { 
          action: "get_instructions",
          projectId: `${project.name} - ${project.description}`,
          components: components.map(c => ({ name: c.name, type: c.type, quantity: c.quantity })),
          language
        }
      });

      if (error) throw error;

      if (data.project) {
        setInstructions(data);
      }
    } catch (error: any) {
      toast({
        title: "Failed to Load Instructions",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStepComplete = (stepNumber: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  };

  const copyCode = async () => {
    if (instructions?.project.code.code) {
      await navigator.clipboard.writeText(instructions.project.code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Code Copied!",
        description: "Paste it into your Arduino IDE."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium text-foreground">Generating visual walkthrough...</p>
              <p className="text-sm text-muted-foreground">Creating step-by-step instructions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!instructions) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Failed to load instructions.</p>
            <Button onClick={fetchInstructions} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { project: proj } = instructions;
  const steps = proj.steps || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{proj.name}</h1>
        <p className="text-muted-foreground">{proj.overview}</p>
      </div>

      <Tabs defaultValue="build" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="build" className="gap-2">
            <Wrench className="w-4 h-4" />
            Build
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2">
            <Code className="w-4 h-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-2">
            <TestTube className="w-4 h-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="help" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Help
          </TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-4">
          {/* Progress indicator */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps.size} of {steps.length} steps
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Step navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((step, idx) => (
              <Button
                key={idx}
                variant={currentStep === idx ? "default" : completedSteps.has(step.stepNumber) ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(idx)}
                className="shrink-0"
              >
                {completedSteps.has(step.stepNumber) ? (
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                ) : (
                  <span className="w-4 h-4 mr-1 flex items-center justify-center text-xs">{step.stepNumber}</span>
                )}
                {step.title.slice(0, 20)}{step.title.length > 20 ? '...' : ''}
              </Button>
            ))}
          </div>

          {/* Current step detail */}
          {steps[currentStep] && (
            <StepCard 
              step={steps[currentStep]} 
              isCompleted={completedSteps.has(steps[currentStep].stepNumber)}
              onToggleComplete={() => toggleStepComplete(steps[currentStep].stepNumber)}
              onNext={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
              onPrev={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
            />
          )}
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {proj.code?.filename || "project.ino"}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={copyCode} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{proj.code?.code || "// Code will be generated here"}</code>
                </pre>
              </ScrollArea>
              {proj.code?.explanation && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Code Explanation
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proj.code.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Testing Your Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proj.testing?.map((test, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">{idx + 1}</span>
                    </div>
                    <p className="text-foreground">{test}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proj.troubleshooting?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      {item.problem}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StepCardProps {
  step: InstructionStep;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StepCard = ({ step, isCompleted, onToggleComplete, onNext, onPrev, isFirst, isLast }: StepCardProps) => {
  return (
    <Card className={isCompleted ? "border-primary/50 bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onToggleComplete}
              className="mt-1 shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
            <div>
              <CardTitle className="text-xl">
                Step {step.stepNumber}: {step.title}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground">{step.description}</p>

        {/* Connections */}
        {step.connections && step.connections.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Connections
            </h4>
            <div className="space-y-2">
              {step.connections.map((conn, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Badge variant="outline" className="shrink-0">{conn.from}</Badge>
                  <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30 relative">
                    {conn.wireColor && (
                      <span 
                        className="absolute left-1/2 -translate-x-1/2 -top-3 text-xs px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: conn.wireColor === 'red' ? '#ef4444' : 
                                         conn.wireColor === 'black' ? '#1f2937' :
                                         conn.wireColor === 'yellow' ? '#eab308' :
                                         conn.wireColor === 'green' ? '#22c55e' :
                                         conn.wireColor === 'blue' ? '#3b82f6' :
                                         conn.wireColor === 'orange' ? '#f97316' :
                                         conn.wireColor === 'white' ? '#f3f4f6' : '#6b7280',
                          color: ['yellow', 'white', 'green'].includes(conn.wireColor) ? '#1f2937' : '#fff'
                        }}
                      >
                        {conn.wireColor}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="shrink-0">{conn.to}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual description */}
        {step.imageDescription && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              What it should look like
            </h4>
            <p className="text-sm text-muted-foreground">{step.imageDescription}</p>
          </div>
        )}

        {/* Tips */}
        {step.tips && step.tips.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">💡 Tips</h4>
            <ul className="space-y-1">
              {step.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button 
            variant="outline" 
            onClick={onPrev}
            disabled={isFirst}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button 
            onClick={onToggleComplete}
            variant={isCompleted ? "secondary" : "default"}
          >
            {isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Button>
          <Button 
            variant="outline"
            onClick={onNext}
            disabled={isLast}
            className="gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInstructions;
