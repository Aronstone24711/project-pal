export interface Component {
  name: string;
  type: "sensor" | "actuator" | "module" | "board" | "passive" | "wire" | "power";
  quantity: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  estimatedTime: string;
  componentsUsed: string[];
  tags: string[];
}

export interface Connection {
  from: string;
  to: string;
  wireColor?: string;
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  connections: Connection[];
  tips: string[];
  imageDescription: string;
}

export interface Troubleshooting {
  problem: string;
  solution: string;
}

export interface ProjectInstructions {
  project: {
    name: string;
    overview: string;
    components: Array<{
      name: string;
      quantity: number;
      notes?: string;
    }>;
    steps: InstructionStep[];
    code: {
      filename: string;
      code: string;
      explanation: string;
    };
    testing: string[];
    troubleshooting: Troubleshooting[];
  };
}
