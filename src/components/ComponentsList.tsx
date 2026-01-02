import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Cpu, Scissors, Home, Wrench, Recycle, Leaf, FileText, HelpCircle } from "lucide-react";
import { Component } from "@/types/arduino";

interface ComponentsListProps {
  components: Component[];
  onProceed: () => void;
  onBack: () => void;
}

const typeIcons: Record<Component["type"], React.ReactNode> = {
  electronic: <Cpu className="w-5 h-5" />,
  craft: <Scissors className="w-5 h-5" />,
  household: <Home className="w-5 h-5" />,
  tool: <Wrench className="w-5 h-5" />,
  recycled: <Recycle className="w-5 h-5" />,
  natural: <Leaf className="w-5 h-5" />,
  office: <FileText className="w-5 h-5" />,
  other: <HelpCircle className="w-5 h-5" />,
};

const typeColors: Record<Component["type"], string> = {
  electronic: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  craft: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  household: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  tool: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  recycled: "bg-green-500/10 text-green-600 dark:text-green-400",
  natural: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  office: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  other: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const ComponentsList = ({ components, onProceed, onBack }: ComponentsListProps) => {
  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.type]) {
      acc[component.type] = [];
    }
    acc[component.type].push(component);
    return acc;
  }, {} as Record<string, Component[]>);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Identified Items</h2>
          <p className="text-sm text-muted-foreground">{components.length} items found</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="space-y-4">
        {Object.entries(groupedComponents).map(([type, items]) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg capitalize">
                <span className={`p-2 rounded-lg ${typeColors[type as Component["type"]]}`}>
                  {typeIcons[type as Component["type"]]}
                </span>
                {type}s
                <Badge variant="secondary" className="ml-auto">
                  {items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((component, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{component.name}</span>
                        {component.quantity > 1 && (
                          <Badge variant="outline" className="text-xs">
                            ×{component.quantity}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Ready to discover projects?</h3>
              <p className="text-sm text-muted-foreground">
                We'll suggest creative projects you can build with these components
              </p>
            </div>
            <Button onClick={onProceed} size="lg" className="gap-2 shrink-0">
              Find Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentsList;
