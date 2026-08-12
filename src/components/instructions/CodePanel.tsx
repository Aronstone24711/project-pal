import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Code, Copy, Lightbulb } from "lucide-react";
import CodeFixDialog from "@/components/CodeFixDialog";
import { useToast } from "@/hooks/use-toast";

interface CodePanelProps {
  filename?: string;
  code: string;
  explanation?: string;
  language: string;
  onCodeFixed: (code: string) => void;
}

const CodePanel = ({ filename, code, explanation, language, onCodeFixed }: CodePanelProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Code Copied!", description: "Paste it into your Arduino IDE." });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            {filename || "project.ino"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <CodeFixDialog currentCode={code} language={language} onCodeFixed={onCodeFixed} />
            <Button variant="outline" size="sm" onClick={copyCode} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{code || "// Code will be generated here"}</code>
          </pre>
        </ScrollArea>
        {explanation && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Code Explanation
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(CodePanel);
