import { ArrowRight, Clock, Cpu, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import projectNightLamp from "@/assets/project-night-lamp.jpg";
import projectPlantMonitor from "@/assets/project-plant-monitor.jpg";
import projectRover from "@/assets/project-rover.jpg";

interface FeaturedProjectsProps {
  onStart: () => void;
}

const projects = [
  {
    name: "Auto Night Lamp",
    level: "Beginner",
    time: "30 minutes",
    description: "Learn light sensing, safe LED wiring, and your first board program.",
    image: projectNightLamp,
    parts: "Arduino · LDR · LED",
  },
  {
    name: "Plant Care Monitor",
    level: "Intermediate",
    time: "1–2 hours",
    description: "Measure soil moisture and turn a plant's needs into useful feedback.",
    image: projectPlantMonitor,
    parts: "ESP32 · Sensor · OLED",
  },
  {
    name: "Obstacle Rover",
    level: "Expert",
    time: "3+ hours",
    description: "Combine motors, distance sensing, and control logic into a moving robot.",
    image: projectRover,
    parts: "Board · Motors · Ultrasonic",
  },
];

const FeaturedProjects = ({ onStart }: FeaturedProjectsProps) => (
  <section className="max-w-5xl mx-auto pt-20" aria-labelledby="featured-projects">
    <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
      <div>
        <p className="terminal-label">// project library</p>
        <h2 id="featured-projects" className="mt-2 text-2xl md:text-3xl font-bold">
          Start with a project you can see
        </h2>
      </div>
      <Sparkles className="hidden sm:block h-5 w-5 text-primary" aria-hidden="true" />
    </div>

    <ul className="mt-6 grid gap-4 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.name} className="group overflow-hidden rounded-lg glass">
          <img
            src={project.image}
            alt={`${project.name} electronics project`}
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">{project.name}</h3>
              <Badge variant="outline">{project.level}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{project.time}</span>
              <span className="inline-flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" />{project.parts}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onStart} className="mt-5 gap-2">
              Use my parts <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default FeaturedProjects;