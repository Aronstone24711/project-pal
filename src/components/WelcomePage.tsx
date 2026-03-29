import { Button } from "@/components/ui/button";
import searchAllLogo from "@/assets/searchall-logo.png";

interface WelcomePageProps {
  onContinue: () => void;
}

const WelcomePage = ({ onContinue }: WelcomePageProps) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-2xl">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-8">
          <svg className="w-12 h-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
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
