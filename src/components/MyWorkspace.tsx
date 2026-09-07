import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Lightbulb,
  Loader2,
  Trash2,
  Cpu,
  FolderOpen,
  ImagePlus,
  Sparkles,
  WifiOff,
  BookOpen,
  Copy,
  Check,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { useCustomProjects, CustomProject } from "@/hooks/useCustomProjects";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SafetyNotice from "@/components/SafetyNotice";

interface MyWorkspaceProps {
  language?: string;
  englishLevel?: string;
}

const MyWorkspace = ({ language = "en", englishLevel = "easy" }: MyWorkspaceProps) => {
  const { projects, addProject, updateProject, removeProject } = useCustomProjects();
  const online = useOnlineStatus();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [components, setComponents] = useState("");
  const [idea, setIdea] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [openProject, setOpenProject] = useState<CustomProject | null>(null);
  const [copied, setCopied] = useState(false);

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please pick an image under 4MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const generatePlan = async (project: CustomProject, ideaText: string, ideaImage?: string | null) => {
    setBusyId(project.id);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: {
          action: "custom_project",
          idea: ideaText,
          device: project.device,
          ownComponents: project.components,
          language,
          englishLevel,
          imageBase64: ideaImage ?? project.image ?? undefined,
        },
      });
      if (error) throw error;
      if (data?.refused) {
        updateProject(project.id, {
          plan: null,
          image: null,
          blocked: { reason: data.reason || "This idea can't be built safely.", saferAlternative: data.saferAlternative },
        });
        toast({
          title: "Idea not supported",
          description: data.reason || "This idea isn't something we can help build.",
          variant: "destructive",
        });
        return;
      }
      if (!data?.project) throw new Error("The plan came back empty. Please try again.");
      updateProject(project.id, {
        plan: data,
        blocked: null,
        image: null,
        name: data.project.name || project.name,
      });
      toast({ title: "Build plan ready", description: "Saved to your workspace — it opens offline too." });
    } catch (err) {
      if (!navigator.onLine) {
        toast({ title: "Connection lost", description: "Queued — it will build itself when you're back online." });
        return;
      }
      toast({
        title: "Could not build the plan",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  // Anything saved offline (or failed mid-request) is queued and drained on reconnect.
  const queued = useMemo(
    () => projects.filter((p) => !p.plan && !p.blocked && (p.description || p.name)),
    [projects]
  );
  const { syncing } = useOfflineSync(queued, (project) =>
    generatePlan(project, project.description || project.name)
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() && !name.trim()) return;
    setCreating(true);
    const created = addProject({
      name: name.trim() || idea.trim().slice(0, 48),
      description: idea.trim(),
      device: device.trim(),
      components: components.trim(),
      plan: null,
      blocked: null,
      image: online ? null : image,
    });
    const ideaText = idea.trim() || name.trim();
    const ideaImage = image;
    setName("");
    setDevice("");
    setComponents("");
    setIdea("");
    setImage(null);
    setCreating(false);

    if (online && ideaText) {
      await generatePlan(created, ideaText, ideaImage);
    } else if (!online) {
      toast({
        title: "Saved offline",
        description: "Your idea is stored and builds itself the moment you're back online.",
      });
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-5xl mx-auto pt-16" aria-labelledby="your-projects">
      <div className="border-b border-border/60 pb-4">
        <p className="terminal-label">// your workspace</p>
        <h2 id="your-projects" className="text-2xl md:text-3xl font-bold mt-2">
          Projects made by you
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload your own idea — a sentence, or a photo of a sketch — and get a full personalised
          build plan with wiring, steps and code. Everything stays on this device and opens offline.
        </p>
        {(syncing || (!online && queued.length > 0)) && (
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-primary">
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing
              ? `syncing ${queued.length} queued idea${queued.length === 1 ? "" : "s"}…`
              : `${queued.length} idea${queued.length === 1 ? "" : "s"} waiting for network`}
          </p>
        )}
      </div>

      <SafetyNotice />

      <form onSubmit={handleCreate} className="mt-6 glass rounded-lg p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="idea">Your idea</Label>
          <Textarea
            id="idea"
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="A lamp that turns on by itself when my room gets dark, and shows the light level on a small screen."
            className="bg-background/50"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="wp-name">Project name (optional)</Label>
            <Input id="wp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Auto night lamp" className="bg-background/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wp-device">Board / device</Label>
            <Input id="wp-device" value={device} onChange={(e) => setDevice(e.target.value)} placeholder="Arduino Uno" className="bg-background/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wp-components">Parts you have</Label>
            <Input id="wp-components" value={components} onChange={(e) => setComponents(e.target.value)} placeholder="LDR, LED, resistors" className="bg-background/50" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickImage(e.target.files?.[0])}
          />
          <Button type="button" variant="outline" className="gap-2" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="w-4 h-4" /> {image ? "Change picture" : "Upload a sketch or photo"}
          </Button>
          {image && (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <img src={image} alt="Your uploaded idea sketch" className="h-10 w-10 rounded object-cover border border-border" />
              attached
            </span>
          )}
          <Button type="submit" className="gap-2 ml-auto" disabled={creating || (!idea.trim() && !name.trim())}>
            <Sparkles className="w-4 h-4" /> {online ? "Create my project" : "Save offline"}
          </Button>
        </div>

        {!online && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <WifiOff className="w-3.5 h-3.5" /> Offline — your idea is saved now and the plan builds when you reconnect.
          </p>
        )}
      </form>

      {projects.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
          <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No projects yet. Add your own idea above and it will be listed here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id} className="rounded-lg glass p-5 text-left">
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

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {project.device && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                    <Cpu className="w-3 h-3" /> {project.device}
                  </span>
                )}
                <Badge variant={project.plan ? "default" : "secondary"} className="text-[10px]">
                  {project.blocked
                    ? "not supported"
                    : project.plan
                      ? "plan ready · offline"
                      : online
                        ? "building"
                        : "queued · offline"}
                </Badge>
              </div>

              {project.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{project.description}</p>
              )}
              {project.components && (
                <p className="mt-3 text-xs text-muted-foreground/80 font-mono">{project.components}</p>
              )}

              {project.blocked && (
                <div className="mt-3 rounded border border-destructive/40 bg-destructive/10 p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold text-destructive">
                    <ShieldAlert className="w-3.5 h-3.5" /> Can't help with this one
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{project.blocked.reason}</p>
                  {project.blocked.saferAlternative && (
                    <p className="mt-2 text-xs text-foreground">Try instead: {project.blocked.saferAlternative}</p>
                  )}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {project.blocked ? (
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => removeProject(project.id)}>
                    <Trash2 className="w-3.5 h-3.5" /> Remove idea
                  </Button>
                ) : project.plan ? (
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpenProject(project)}>
                    <BookOpen className="w-3.5 h-3.5" /> Open plan
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    disabled={!online || busyId === project.id}
                    onClick={() => generatePlan(project, project.description || project.name)}
                  >
                    {busyId === project.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Building…
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-3.5 h-3.5" /> Build plan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!openProject} onOpenChange={(open) => !open && setOpenProject(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{openProject?.plan?.project.name || openProject?.name}</DialogTitle>
            <DialogDescription>{openProject?.plan?.project.overview}</DialogDescription>
          </DialogHeader>

          {openProject?.plan && (
            <div className="space-y-6">
              <div>
                <p className="terminal-label">// parts</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {openProject.plan.project.components?.map((c, i) => (
                    <li key={i} className="text-muted-foreground">
                      <span className="text-foreground">{c.quantity}× {c.name}</span>
                      {c.notes ? ` — ${c.notes}` : ""}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="terminal-label">// steps</p>
                <ol className="mt-2 space-y-4">
                  {openProject.plan.project.steps?.map((step) => (
                    <li key={step.stepNumber} className="rounded border border-border/60 p-4">
                      <p className="font-semibold text-sm">
                        {step.stepNumber}. {step.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      {step.connections?.length > 0 && (
                        <ul className="mt-3 space-y-1 font-mono text-xs">
                          {step.connections.map((conn, i) => (
                            <li key={i} className="text-primary">
                              {conn.from} → {conn.to}
                              {conn.wireColor ? ` (${conn.wireColor} wire)` : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                      {step.tips?.length > 0 && (
                        <ul className="mt-3 list-disc pl-5 text-xs text-muted-foreground">
                          {step.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {openProject.plan.project.code?.code && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="terminal-label">// {openProject.plan.project.code.filename}</p>
                    <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => copyCode(openProject.plan!.project.code.code)}>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded border border-border bg-background/70 p-4 text-xs">
                    <code>{openProject.plan.project.code.code}</code>
                  </pre>
                  <p className="mt-2 text-sm text-muted-foreground">{openProject.plan.project.code.explanation}</p>
                </div>
              )}

              {openProject.plan.project.troubleshooting?.length > 0 && (
                <div>
                  <p className="terminal-label">// if it does not work</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    {openProject.plan.project.troubleshooting.map((item, i) => (
                      <li key={i}>
                        <span className="text-foreground">{item.problem}</span>
                        <span className="text-muted-foreground"> — {item.solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MyWorkspace;