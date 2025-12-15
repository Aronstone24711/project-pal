import { useState } from "react";
import { Helmet } from "react-helmet";
import CameraScanner from "@/components/CameraScanner";
import ComponentsList from "@/components/ComponentsList";
import ProjectSuggestions from "@/components/ProjectSuggestions";
import ProjectInstructions from "@/components/ProjectInstructions";
import { Component, Project } from "@/types/arduino";

type AppState = "scan" | "components" | "projects" | "instructions";

const Index = () => {
  const [state, setState] = useState<AppState>("scan");
  const [components, setComponents] = useState<Component[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleComponentsIdentified = (identifiedComponents: Component[]) => {
    setComponents(identifiedComponents);
    setState("components");
  };

  const handleProceedToProjects = () => {
    setState("projects");
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setState("instructions");
  };

  const handleBack = () => {
    if (state === "instructions") {
      setState("projects");
    } else if (state === "projects") {
      setState("components");
    } else if (state === "components") {
      setState("scan");
    }
  };

  const handleReset = () => {
    setComponents([]);
    setProjects([]);
    setSelectedProject(null);
    setState("scan");
  };

  return (
    <>
      <Helmet>
        <title>Arduino Project Builder | Scan Components & Build Projects</title>
        <meta name="description" content="Scan your Arduino and electronic components, get AI-powered project suggestions, and follow step-by-step visual instructions to build amazing projects." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Arduino Builder</h1>
                <p className="text-xs text-muted-foreground">Scan • Discover • Create</p>
              </div>
            </div>
            
            {state !== "scan" && (
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {state === "scan" && (
            <CameraScanner onComponentsIdentified={handleComponentsIdentified} />
          )}
          
          {state === "components" && (
            <ComponentsList
              components={components}
              onProceed={handleProceedToProjects}
              onBack={handleBack}
            />
          )}
          
          {state === "projects" && (
            <ProjectSuggestions
              components={components}
              projects={projects}
              setProjects={setProjects}
              onProjectSelect={handleProjectSelect}
              onBack={handleBack}
            />
          )}
          
          {state === "instructions" && selectedProject && (
            <ProjectInstructions
              project={selectedProject}
              components={components}
              onBack={handleBack}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default Index;
