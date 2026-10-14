import projectNightLamp from "@/assets/project-night-lamp.jpg";
import projectPlantMonitor from "@/assets/project-plant-monitor.jpg";
import projectRover from "@/assets/project-rover.jpg";
import type { Component, Project } from "@/types/arduino";

export interface StarterProject {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Expert";
  difficulty: Project["difficulty"];
  time: string;
  description: string;
  image: string;
  /** Parts besides the board. */
  parts: Array<{ name: string; quantity: number; description: string }>;
  tags: string[];
}

export const BOARDS = ["Arduino", "ESP32", "Raspberry Pi", "STM32"] as const;
export type BoardName = (typeof BOARDS)[number];

const part = (name: string, quantity: number, description: string) => ({ name, quantity, description });

export const starterProjects: Record<string, StarterProject> = {
  "blink-led": {
    id: "blink-led", name: "Blinking LED", level: "Beginner", difficulty: "beginner", time: "15 minutes",
    description: "Wire one LED with a resistor and make it blink on a timer.", image: projectNightLamp,
    parts: [part("Red LED", 1, "5mm LED"), part("330Ω resistor", 1, "Current limiter"), part("Breadboard", 1, "Solderless"), part("Jumper wires", 3, "Male-male")],
    tags: ["led", "digital output"],
  },
  "night-lamp": {
    id: "night-lamp", name: "Auto Night Lamp", level: "Beginner", difficulty: "beginner", time: "30 minutes",
    description: "Learn light sensing, safe LED wiring, and your first board program.", image: projectNightLamp,
    parts: [part("LDR light sensor", 1, "Photoresistor"), part("10kΩ resistor", 1, "Voltage divider"), part("LED", 1, "5mm"), part("330Ω resistor", 1, "Current limiter"), part("Breadboard", 1, "Solderless"), part("Jumper wires", 6, "Male-male")],
    tags: ["sensor", "led", "analog"],
  },
  "button-toggle": {
    id: "button-toggle", name: "Button Toggle Light", level: "Beginner", difficulty: "beginner", time: "20 minutes",
    description: "Press a button once to turn an LED on, press again to turn it off.", image: projectNightLamp,
    parts: [part("Push button", 1, "Tactile switch"), part("LED", 1, "5mm"), part("330Ω resistor", 1, "Current limiter"), part("Breadboard", 1, "Solderless"), part("Jumper wires", 5, "Male-male")],
    tags: ["button", "input"],
  },
  "led-dimmer": {
    id: "led-dimmer", name: "Knob LED Dimmer", level: "Beginner", difficulty: "beginner", time: "25 minutes",
    description: "Turn a knob to fade an LED smoothly using PWM.", image: projectNightLamp,
    parts: [part("10kΩ potentiometer", 1, "Rotary knob"), part("LED", 1, "5mm"), part("330Ω resistor", 1, "Current limiter"), part("Breadboard", 1, "Solderless"), part("Jumper wires", 6, "Male-male")],
    tags: ["pwm", "analog"],
  },
  "plant-monitor": {
    id: "plant-monitor", name: "Plant Care Monitor", level: "Intermediate", difficulty: "intermediate", time: "1–2 hours",
    description: "Measure soil moisture and turn a plant's needs into useful feedback.", image: projectPlantMonitor,
    parts: [part("Capacitive soil moisture sensor", 1, "Analog output"), part("0.96in OLED display (I2C)", 1, "SSD1306"), part("Jumper wires", 8, "Male-female")],
    tags: ["sensor", "i2c", "display"],
  },
  "obstacle-rover": {
    id: "obstacle-rover", name: "Obstacle Rover", level: "Expert", difficulty: "advanced", time: "3+ hours",
    description: "Combine motors, distance sensing, and control logic into a moving robot.", image: projectRover,
    parts: [part("HC-SR04 ultrasonic sensor", 1, "Distance sensor"), part("L298N motor driver", 1, "Dual H-bridge"), part("DC gear motors", 2, "With wheels"), part("Battery pack 2S", 1, "7.4V"), part("Robot chassis", 1, "2WD")],
    tags: ["motors", "state machine", "power"],
  },
  "weather-logger": {
    id: "weather-logger", name: "Low-Power Weather Logger", level: "Expert", difficulty: "advanced", time: "2–3 hours",
    description: "Read a BME280 over I2C, log it, and deep-sleep between readings to save battery.", image: projectPlantMonitor,
    parts: [part("BME280 sensor (I2C)", 1, "Temp/humidity/pressure"), part("18650 battery with holder", 1, "3.7V"), part("4.7kΩ resistors", 2, "I2C pull-ups"), part("Jumper wires", 6, "Male-female")],
    tags: ["i2c", "low power", "sleep"],
  },
};

/** Turn a starter into the Project + Component list the instruction flow expects. */
export const toProjectFlow = (starter: StarterProject, board: string) => {
  const components: Component[] = [
    { name: board, type: "electronic", quantity: 1, description: "Microcontroller board" },
    ...starter.parts.map((p) => ({ ...p, type: "electronic" as const })),
  ];
  const project: Project = {
    id: `${starter.id}-${board.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${starter.name} (${board})`,
    difficulty: starter.difficulty,
    description: starter.description,
    estimatedTime: starter.time,
    componentsUsed: components.map((c) => c.name),
    tags: starter.tags,
  };
  return { project, components };
};
