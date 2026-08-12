import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StepProgressProps {
  completed: number;
  total: number;
}

const StepProgress = ({ completed, total }: StepProgressProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Progress</span>
        <span className="text-sm text-muted-foreground">
          {completed} of {total} steps
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
        />
      </div>
    </CardContent>
  </Card>
);

export default memo(StepProgress);
