import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import WelcomePage from "@/components/WelcomePage";
import LanguageSelector from "@/components/LanguageSelector";
import AgeSelector from "@/components/AgeSelector";
import EnglishLevelSelector, { EnglishLevel } from "@/components/EnglishLevelSelector";
import CameraScanner from "@/components/CameraScanner";
import ComponentsList from "@/components/ComponentsList";
import ProjectSuggestions from "@/components/ProjectSuggestions";
import ProjectInstructions from "@/components/ProjectInstructions";
import HeaderMenu from "@/components/HeaderMenu";
import LocationSelector from "@/components/LocationSelector";
import WeatherDisplay from "@/components/WeatherDisplay";
import SettingsDialog from "@/components/SettingsDialog";
import { useTheme } from "@/contexts/ThemeContext";
import searchAllLogo from "@/assets/searchall-logo.png";
import { Component, Project } from "@/types/arduino";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

type AppState = "welcome" | "location" | "language" | "age" | "englishLevel" | "scan" | "components" | "projects" | "instructions";

const Index = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>("welcome");
  const [isGuest, setIsGuest] = useState(false);
  const [language, setLanguage] = useState<Language | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [isChild, setIsChild] = useState(false);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>("easy");
  const [components, setComponents] = useState<Component[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { weatherData } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleWelcomeContinue = () => {
    setState("location");
  };

  const handleLocationSet = () => {
    setState("language");
  };

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    // If user is changing language mid-flow, return to where they were
    if (age !== null) {
      if (components.length > 0) {
        setState("components");
      } else {
        setState("scan");
      }
    } else {
      setState("age");
    }
  };

  const handleAgeSelect = (selectedAge: number, childStatus: boolean) => {
    setAge(selectedAge);
    setIsChild(childStatus);
    if (childStatus) {
      // Children get easy English automatically
      setEnglishLevel("easy");
      setState("scan");
    } else {
      // Adults choose their English level
      setState("englishLevel");
    }
  };

  const handleEnglishLevelSelect = (level: EnglishLevel) => {
    setEnglishLevel(level);
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
      if (isChild) {
        setState("age");
      } else {
        setState("englishLevel");
      }
    } else if (state === "englishLevel") {
      setState("age");
    } else if (state === "age") {
      setState("language");
    } else if (state === "language") {
      setState("location");
    } else if (state === "location") {
      setState("welcome");
    }
  };

  const handleReset = () => {
    setComponents([]);
    setProjects([]);
    setSelectedProject(null);
    setIsGuest(false);
    setAge(null);
    setIsChild(false);
    setEnglishLevel("easy");
    setState("welcome");
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleChangeLanguage = () => {
    setState("language");
  };

  return (
    <>
      <Helmet>
        <title>Search All | Scan Items & Discover Projects</title>
        <meta name="description" content="Scan any items - electronics, paper, household objects - and get AI-powered project suggestions with step-by-step visual instructions." />
      </Helmet>
      
      <div className="min-h-screen bg-background starry-bg">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center overflow-hidden sunny-glow">
                <img src={searchAllLogo} alt="Search All Logo" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-screen" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Search All</h1>
                <p className="text-xs text-muted-foreground">Place Where Ideas Meet Innovation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {weatherData && <WeatherDisplay />}
              {state !== "welcome" && state !== "location" && state !== "language" && language && (
                <button
                  onClick={handleChangeLanguage}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
                  title="Change language"
                >
                  {language.flag} {language.name}
                </button>
              )}
              {state !== "welcome" && (
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

        <main className="container mx-auto px-4 py-6 pb-24">
          {state === "welcome" && (
            <WelcomePage onContinue={handleWelcomeContinue} />
          )}

          {state === "location" && (
            <LocationSelector onLocationSet={handleLocationSet} />
          )}
          
          {state === "language" && (
            <LanguageSelector onLanguageSelect={handleLanguageSelect} />
          )}

          {state === "age" && (
            <AgeSelector onAgeSelect={handleAgeSelect} />
          )}

          {state === "englishLevel" && (
            <EnglishLevelSelector onLevelSelect={handleEnglishLevelSelect} />
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
              englishLevel={englishLevel}
            />
          )}
          
          {state === "instructions" && selectedProject && (
            <ProjectInstructions
              project={selectedProject}
              components={components}
              onBack={handleBack}
              language={language?.code || "en"}
              englishLevel={englishLevel}
            />
          )}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm border-t border-border/40">
          Created by Leeroy Bansal
        </footer>

        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onReset={handleReset}
          onChangeLanguage={handleChangeLanguage}
        />
      </div>
    </>
  );
};

export default Index;
