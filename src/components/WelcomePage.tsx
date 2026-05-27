import { Button } from "@/components/ui/button";
import searchAllLogo from "@/assets/searchall-logo.png";
import { Wrench, ScanLine } from "lucide-react";

interface WelcomePageProps {
  onContinue: () => void;
  onDebug: () => void;
}

const WelcomePage = ({ onContinue, onDebug }: WelcomePageProps) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-2xl">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-background flex items-center justify-center overflow-hidden mb-8">
          <img src={searchAllLogo} alt="Search All Logo" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-screen" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Welcome to Search All
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Scan any items you have - electronics, paper, household objects - and discover exciting projects with step-by-step visual instructions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" onClick={onContinue} className="gap-2">
            <ScanLine className="w-5 h-5" /> Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={onDebug} className="gap-2">
            <Wrench className="w-5 h-5" /> Debug a Project
          </Button>
        </div>
        <p className="text-sm text-muted-foreground pt-2">
          Have code or a project that isn't working? Let AI diagnose and fix it.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
