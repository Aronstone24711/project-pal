import { useState } from "react";
import { Helmet } from "react-helmet";
import LanguageSelector from "@/components/LanguageSelector";
import CameraScanner from "@/components/CameraScanner";
import ComponentsList from "@/components/ComponentsList";
import ProjectSuggestions from "@/components/ProjectSuggestions";
import ProjectInstructions from "@/components/ProjectInstructions";
import HeaderMenu from "@/components/HeaderMenu";
import { Component, Project } from "@/types/arduino";
import { toast } from "sonner";
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

type AppState = "language" | "scan" | "components" | "projects" | "instructions";

const Index = () => {
  const [state, setState] = useState<AppState>("language");
  const [language, setLanguage] = useState<Language | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setState("scan");
  };
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
    } else if (state === "scan") {
      setState("language");
    }
  };

  const handleReset = () => {
    setComponents([]);
    setProjects([]);
    setSelectedProject(null);
    setState("language");
  };

  const handleLoginClick = () => {
    toast.info("Login feature coming soon!");
  };

  const handleSignupClick = () => {
    toast.info("Sign up feature coming soon!");
  };

  const handleSettingsClick = () => {
    toast.info("Settings feature coming soon!");
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
            
            <div className="flex items-center gap-4">
              {state !== "language" && language && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {language.flag} {language.name}
                </span>
              )}
              {state !== "language" && (
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
                >
                  Start Over
                </button>
              )}
              <HeaderMenu
                onLoginClick={handleLoginClick}
                onSignupClick={handleSignupClick}
                onSettingsClick={handleSettingsClick}
              />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {state === "language" && (
            <LanguageSelector onLanguageSelect={handleLanguageSelect} />
          )}
          
          {state === "scan" && (
            <CameraScanner onComponentsIdentified={handleComponentsIdentified} language={language?.code || "en"} />
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
              language={language?.code || "en"}
            />
          )}
          
          {state === "instructions" && selectedProject && (
            <ProjectInstructions
              project={selectedProject}
              components={components}
              onBack={handleBack}
              language={language?.code || "en"}
            />
          )}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm border-t border-border/40">
          Created by Leeroy Bansal
        </footer>
      </div>
    </>
  );
};

export default Index;
