import { memo } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { InstructionStep } from "@/types/arduino";

interface StepNavigatorProps {
  steps: InstructionStep[];
  currentStep: number;
  completedSteps: Set<number>;
  onSelect: (index: number) => void;
}

const StepNavigator = ({ steps, currentStep, completedSteps, onSelect }: StepNavigatorProps) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {steps.map((step, idx) => (
      <Button
        key={idx}
        variant={currentStep === idx ? "default" : completedSteps.has(step.stepNumber) ? "secondary" : "outline"}
        size="sm"
        onClick={() => onSelect(idx)}
        className="shrink-0"
      >
        {completedSteps.has(step.stepNumber) ? (
          <CheckCircle2 className="w-4 h-4 mr-1" />
        ) : (
          <span className="w-4 h-4 mr-1 flex items-center justify-center text-xs">{step.stepNumber}</span>
        )}
        {step.title.slice(0, 20)}
        {step.title.length > 20 ? "..." : ""}
      </Button>
    ))}
  </div>
);

export default memo(StepNavigator);
