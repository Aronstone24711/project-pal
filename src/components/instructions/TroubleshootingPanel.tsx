import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Troubleshooting } from "@/types/arduino";

const TroubleshootingPanel = ({ items = [] }: { items?: Troubleshooting[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Troubleshooting
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item, idx) => (
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
);

export default memo(TroubleshootingPanel);
