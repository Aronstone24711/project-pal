import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type EnglishLevel = "easy" | "medium" | "hard";

interface EnglishLevelSelectorProps {
  onLevelSelect: (level: EnglishLevel) => void;
}

const levels = [
  {
    id: "easy" as EnglishLevel,
    label: "Easy",
    icon: "📗",
    description: "Simple words and short sentences. Best for beginners.",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    id: "medium" as EnglishLevel,
    label: "Medium",
    icon: "📘",
    description: "Standard vocabulary with clear explanations. Good for most users.",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    id: "hard" as EnglishLevel,
    label: "Advanced",
    icon: "📕",
    description: "Technical terms and detailed explanations. For experienced makers.",
    color: "from-red-500/20 to-red-500/5",
  },
];

const EnglishLevelSelector = ({ onLevelSelect }: EnglishLevelSelectorProps) => {
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | null>(null);

  const handleSelect = (level: EnglishLevel) => {
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      onLevelSelect(selectedLevel);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose English Level</h2>
        <p className="text-muted-foreground">
          Select how detailed and technical you want the instructions to be
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {levels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all hover:scale-[1.01] ${
              selectedLevel === level.id
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleSelect(level.id)}
          >
            <CardContent className={`flex items-center gap-4 p-6 bg-gradient-to-r ${level.color} rounded-lg`}>
              <span className="text-5xl">{level.icon}</span>
              <div>
                <p className="font-bold text-lg text-foreground">{level.label}</p>
                <p className="text-muted-foreground">{level.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedLevel}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
};

export default EnglishLevelSelector;
