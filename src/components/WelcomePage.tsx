import { Button } from "@/components/ui/button";
import searchAllLogo from "@/assets/searchall-logo.png";

interface WelcomePageProps {
  onContinue: () => void;
}

const WelcomePage = ({ onContinue }: WelcomePageProps) => {
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
          <Button size="lg" onClick={onContinue}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
