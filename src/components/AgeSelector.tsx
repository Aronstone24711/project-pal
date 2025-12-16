import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AgeSelectorProps {
  onAgeSelect: (age: number, isChild: boolean) => void;
}

const ageGroups = [
  { min: 6, max: 8, label: "6-8 years", icon: "🧒", description: "Young learner" },
  { min: 9, max: 11, label: "9-11 years", icon: "👦", description: "Growing explorer" },
  { min: 12, max: 15, label: "12-15 years", icon: "🧑", description: "Teen maker" },
  { min: 16, max: 20, label: "16-20 years", icon: "👨‍🎓", description: "Young adult" },
  { min: 21, max: 100, label: "21+ years", icon: "👨‍💻", description: "Adult" },
];

const AgeSelector = ({ onAgeSelect }: AgeSelectorProps) => {
  const [selectedGroup, setSelectedGroup] = useState<typeof ageGroups[0] | null>(null);

  const handleSelect = (group: typeof ageGroups[0]) => {
    setSelectedGroup(group);
  };

  const handleContinue = () => {
    if (selectedGroup) {
      const isChild = selectedGroup.max < 12;
      onAgeSelect(selectedGroup.min, isChild);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">What's your age?</h2>
        <p className="text-muted-foreground">
          This helps us provide instructions at the right level for you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {ageGroups.map((group) => (
          <Card
            key={group.label}
            className={`cursor-pointer transition-all hover:scale-[1.02] ${
              selectedGroup?.label === group.label
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleSelect(group)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <span className="text-4xl">{group.icon}</span>
              <div>
                <p className="font-semibold text-foreground">{group.label}</p>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedGroup}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
};

export default AgeSelector;
