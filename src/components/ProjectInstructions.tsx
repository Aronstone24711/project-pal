import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowLeft, Code, Loader2, TestTube, Wrench } from "lucide-react";
import type { Component, Project } from "@/types/arduino";
import type { EnglishLevel } from "./EnglishLevelSelector";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useProjectInstructions } from "@/hooks/useProjectInstructions";
import StepProgress from "./instructions/StepProgress";
import StepNavigator from "./instructions/StepNavigator";
import StepCard from "./instructions/StepCard";
import CodePanel from "./instructions/CodePanel";
import TestingPanel from "./instructions/TestingPanel";
import TroubleshootingPanel from "./instructions/TroubleshootingPanel";

interface ProjectInstructionsProps {
  project: Project;
  components: Component[];
  onBack: () => void;
  language: string;
  englishLevel: EnglishLevel;
}

const ProjectInstructions = ({ project, components, onBack, language, englishLevel }: ProjectInstructionsProps) => {
  const online = useOnlineStatus();
  const { instructions, code, isLoading, fromCache, reload, applyFixedCode } = useProjectInstructions({
    project,
    components,
    language,
    englishLevel,
  });

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  const steps = instructions?.project.steps || [];

  const toggleStepComplete = useCallback((stepNumber: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepNumber) ? next.delete(stepNumber) : next.add(stepNumber);
      return next;
    });
  }, []);

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
            <Button onClick={reload} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const proj = instructions.project;
  const step = steps[currentStep];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>
        {(fromCache || !online) && (
          <Badge variant="secondary" className="text-[10px]">
            {online ? "saved copy · works offline" : "offline · saved copy"}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{proj.name}</h1>
        <p className="text-muted-foreground">{proj.overview}</p>
      </div>

      <Tabs defaultValue="build" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="build" className="gap-2"><Wrench className="w-4 h-4" />Build</TabsTrigger>
          <TabsTrigger value="code" className="gap-2"><Code className="w-4 h-4" />Code</TabsTrigger>
          <TabsTrigger value="test" className="gap-2"><TestTube className="w-4 h-4" />Test</TabsTrigger>
          <TabsTrigger value="help" className="gap-2"><AlertTriangle className="w-4 h-4" />Help</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-4">
          <StepProgress completed={completedSteps.size} total={steps.length} />
          <StepNavigator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onSelect={setCurrentStep}
          />
          {step && (
            <StepCard
              step={step}
              isCompleted={completedSteps.has(step.stepNumber)}
              onToggleComplete={() => toggleStepComplete(step.stepNumber)}
              onNext={() => setCurrentStep((p) => Math.min(p + 1, steps.length - 1))}
              onPrev={() => setCurrentStep((p) => Math.max(p - 1, 0))}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
            />
          )}
        </TabsContent>

        <TabsContent value="code">
          <CodePanel
            filename={proj.code?.filename}
            code={code}
            explanation={proj.code?.explanation}
            language={language}
            onCodeFixed={applyFixedCode}
          />
        </TabsContent>

        <TabsContent value="test">
          <TestingPanel testing={proj.testing} />
        </TabsContent>

        <TabsContent value="help">
          <TroubleshootingPanel items={proj.troubleshooting} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectInstructions;
