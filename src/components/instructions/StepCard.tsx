import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Lightbulb } from "lucide-react";
import type { InstructionStep } from "@/types/arduino";
import ConnectionList from "./ConnectionList";
import BreadboardPanel from "./BreadboardPanel";

export interface StepCardProps {
  step: InstructionStep;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StepCard = ({ step, isCompleted, onToggleComplete, onNext, onPrev, isFirst, isLast }: StepCardProps) => (
  <Card className={isCompleted ? "border-primary/50 bg-primary/5" : ""}>
    <CardHeader>
      <div className="flex items-start gap-3">
        <button onClick={onToggleComplete} className="mt-1 shrink-0" aria-label={isCompleted ? "Mark step incomplete" : "Mark step complete"}>
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
        <CardTitle className="text-xl">
          Step {step.stepNumber}: {step.title}
        </CardTitle>
      </div>
    </CardHeader>

    <CardContent className="space-y-6">
      <p className="text-foreground">{step.description}</p>

      <ConnectionList connections={step.connections || []} />
      <BreadboardPanel connections={step.connections || []} />

      {step.imageDescription && (
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            What it should look like
          </h4>
          <p className="text-sm text-muted-foreground">{step.imageDescription}</p>
        </div>
      )}

      {step.tips && step.tips.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Tips</h4>
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

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onPrev} disabled={isFirst} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button onClick={onToggleComplete} variant={isCompleted ? "secondary" : "default"}>
          {isCompleted ? "Mark Incomplete" : "Mark Complete"}
        </Button>
        <Button variant="outline" onClick={onNext} disabled={isLast} className="gap-2">
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default memo(StepCard);
