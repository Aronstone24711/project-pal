import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail } from "lucide-react";
import PhoneAuthForm from "./PhoneAuthForm";

interface WelcomePageProps {
  onContinue: (isGuest: boolean) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

type AuthMode = "choice" | "phone" | "email";

const WelcomePage = ({ onContinue, onLoginClick, onSignupClick }: WelcomePageProps) => {
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("choice");

  const handleGuestContinue = () => {
    setShowLoginDialog(false);
    onContinue(true);
  };

  const handleEmailLogin = () => {
    setShowLoginDialog(false);
    onLoginClick();
  };

  const handleEmailSignup = () => {
    setShowLoginDialog(false);
    onSignupClick();
  };

  const handlePhoneSuccess = () => {
    setShowLoginDialog(false);
    onContinue(false);
  };

  const resetAuthMode = () => {
    setAuthMode("choice");
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-2xl">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-8">
          <svg className="w-12 h-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Welcome to Arduino Builder
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Scan your electronic components, discover exciting projects, and follow step-by-step visual instructions to bring your ideas to life.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => setShowLoginDialog(true)}>
            Get Started
          </Button>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={(open) => {
        setShowLoginDialog(open);
        if (!open) resetAuthMode();
      }}>
        <DialogContent className="sm:max-w-md">
          {authMode === "choice" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">Welcome!</DialogTitle>
                <DialogDescription className="text-center">
                  Sign in to save your projects and preferences, or continue as a guest.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-3 mt-4">
                <Button 
                  onClick={() => setAuthMode("phone")} 
                  className="w-full" 
                  size="lg"
                  variant="default"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Sign in with Phone
                </Button>
                
                <Button 
                  onClick={handleEmailLogin} 
                  className="w-full" 
                  size="lg"
                  variant="outline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Sign in with Email
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button 
                  onClick={handleEmailSignup} 
                  variant="secondary" 
                  className="w-full" 
                  size="lg"
                >
                  Create an Account
                </Button>

                <Button 
                  onClick={handleGuestContinue} 
                  variant="ghost" 
                  className="w-full" 
                  size="lg"
                >
                  Continue as Guest
                </Button>
              </div>
            </>
          )}

          {authMode === "phone" && (
            <PhoneAuthForm 
              onSuccess={handlePhoneSuccess} 
              onBack={resetAuthMode} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomePage;
