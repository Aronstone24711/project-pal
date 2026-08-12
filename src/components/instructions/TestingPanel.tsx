import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube } from "lucide-react";

const TestingPanel = ({ testing = [] }: { testing?: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TestTube className="w-5 h-5" />
        Testing Your Project
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {testing.map((test, idx) => (
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
);

export default memo(TestingPanel);
