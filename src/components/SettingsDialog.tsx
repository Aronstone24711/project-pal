import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, RotateCcw, FolderOpen, Trash2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

interface SavedProject {
  id: string;
  project_name: string;
  created_at: string;
}

const SettingsDialog = ({ open, onOpenChange, onReset }: SettingsDialogProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_projects")
        .select("id, project_name, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleMyProjects = async () => {
    if (!user) {
      toast.error("Please login to view your projects");
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    
    setShowProjects(true);
    await fetchProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("saved_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      
      setSavedProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleAddAccount = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  const handleResetAll = () => {
    onReset();
    // Clear local storage data
    localStorage.removeItem("searchall-location");
    localStorage.removeItem("searchall-preferences");
    toast.success("All data has been reset");
    onOpenChange(false);
  };

  const handleBack = () => {
    setShowProjects(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {showProjects ? "My Projects" : "Settings"}
          </DialogTitle>
        </DialogHeader>

        {showProjects ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-2 text-muted-foreground"
            >
              ← Back to Settings
            </Button>
            
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading projects...
              </div>
            ) : savedProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No saved projects yet
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{project.project_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleAddAccount}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Add Account</p>
                  <p className="text-sm text-muted-foreground">
                    {user ? "Switch or add another account" : "Login or create account"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <Separator />

            <button
              onClick={handleMyProjects}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">My Projects</p>
                  <p className="text-sm text-muted-foreground">View and manage saved projects</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <Separator />

            <button
              onClick={handleResetAll}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-destructive/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-destructive">Reset All</p>
                  <p className="text-sm text-muted-foreground">Clear all preferences and start fresh</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
