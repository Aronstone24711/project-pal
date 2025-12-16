import { useState, useEffect } from "react";
import { User, Settings, LogIn, LogOut, UserPlus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderMenuProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onSettingsClick: () => void;
}

const HeaderMenu = ({ onLoginClick, onSignupClick, onSettingsClick }: HeaderMenuProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50">
        {user ? (
          <>
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground">Logged in</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              View Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLoginClick} className="cursor-pointer">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Another Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">Guest</p>
              <p className="text-xs text-muted-foreground">Not logged in</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLoginClick} className="cursor-pointer">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignupClick} className="cursor-pointer">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;
