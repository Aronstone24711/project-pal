import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Cpu, FolderOpen } from "lucide-react";
import { useCustomProjects } from "@/hooks/useCustomProjects";

const CustomProjects = () => {
  const { projects, addProject, removeProject } = useCustomProjects();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [components, setComponents] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      device: device.trim(),
      components: components.trim(),
      description: description.trim(),
    });
    setName("");
    setDevice("");
    setComponents("");
    setDescription("");
    setOpen(false);
  };

  return (
    <section className="w-full max-w-5xl mx-auto pt-16" aria-labelledby="your-projects">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="terminal-label">// your workspace</p>
          <h2 id="your-projects" className="text-2xl md:text-3xl font-bold mt-2">
            Projects made by you
          </h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Add project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a custom project</DialogTitle>
              <DialogDescription>
                Save your own build so it stays on this device and shows up below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cp-name">Project name</Label>
                <Input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Smart plant monitor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-device">Board / device</Label>
                <Input id="cp-device" value={device} onChange={(e) => setDevice(e.target.value)} placeholder="ESP32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-components">Components used</Label>
                <Input id="cp-components" value={components} onChange={(e) => setComponents(e.target.value)} placeholder="DHT11, OLED, relay" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp-description">What it does</Label>
                <Textarea id="cp-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Reads soil moisture and waters the plant automatically." />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!name.trim()}>Save project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
          <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No projects yet. Add your own build and it will be listed here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id} className="rounded-lg border border-border bg-card p-5 text-left">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-base leading-tight">{project.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeProject(project.id)}
                  aria-label={`Delete ${project.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {project.device && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary">
                  <Cpu className="w-3 h-3" /> {project.device}
                </p>
              )}
              {project.description && (
                <p className="mt-3 text-sm text-muted-foreground">{project.description}</p>
              )}
              {project.components && (
                <p className="mt-3 text-xs text-muted-foreground/80 font-mono">{project.components}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CustomProjects;
