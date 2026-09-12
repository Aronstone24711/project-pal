import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Loader2, Sparkles, ChevronRight, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Component, Project } from "@/types/arduino";
import { EnglishLevel } from "./EnglishLevelSelector";
import projectNightLamp from "@/assets/project-night-lamp.jpg";
import projectPlantMonitor from "@/assets/project-plant-monitor.jpg";
import projectRover from "@/assets/project-rover.jpg";

interface ProjectSuggestionsProps {
  components: Component[];
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onProjectSelect: (project: Project) => void;
  onBack: () => void;
  language: string;
  englishLevel: EnglishLevel;
}

const difficultyColors = {
  beginner: "bg-primary/10 text-primary border-primary/20",
  intermediate: "bg-accent/10 text-accent-foreground border-accent/20",
  advanced: "bg-destructive/10 text-destructive border-destructive/20",
};

const projectImage = (project: Project) => {
  const text = `${project.name} ${project.tags?.join(" ") || ""}`.toLowerCase();
  if (text.includes("plant") || text.includes("moisture")) return projectPlantMonitor;
  if (text.includes("rover") || text.includes("robot") || project.difficulty === "advanced") return projectRover;
  return projectNightLamp;
};

const ProjectSuggestions = ({ 
  components, 
  projects, 
  setProjects, 
  onProjectSelect, 
  onBack,
  language,
  englishLevel
}: ProjectSuggestionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: { 
          action: "suggest_projects",
          components: components.map(c => ({ name: c.name, type: c.type, quantity: c.quantity })),
          language,
          englishLevel
        }
      });

      if (error) throw error;

      if (data.projects && data.projects.length > 0) {
        setProjects(data.projects);
        toast({
          title: "Projects Found!",
          description: `${data.projects.length} projects you can build.`
        });
      } else {
        toast({
          title: "No Projects Found",
          description: "Try scanning more components.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to Get Suggestions",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Project Ideas</h2>
          <p className="text-sm text-muted-foreground">Choose a project to build</p>
        </div>
        <div className="w-20" />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Finding creative projects...</p>
              <p className="text-sm text-muted-foreground">Analyzing your components</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
              onClick={() => onProjectSelect(project)}
            >
              <img src={projectImage(project)} alt={`${project.name} project example`} width={1024} height={1024} loading="lazy" className="aspect-[16/9] w-full object-cover rounded-t-lg" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={difficultyColors[project.difficulty]}>
                    {project.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {project.estimatedTime}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(project.tags || []).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                     Uses: {(project.componentsUsed || []).slice(0, 3).join(", ") || "Your scanned parts"}
                     {(project.componentsUsed || []).length > 3 && ` +${project.componentsUsed.length - 3} more`}
                  </p>
                </div>
                <Button
                  type="button"
                  className="mt-4 w-full gap-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    onProjectSelect(project);
                  }}
                >
                  <Play className="w-4 h-4" />
                  Start project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && projects.length > 0 && (
        <div className="text-center">
          <Button variant="outline" onClick={fetchProjects} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Get Different Ideas
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectSuggestions;
