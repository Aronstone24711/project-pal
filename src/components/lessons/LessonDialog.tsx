import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, MessageCircle, Play, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allLessons, tracks, type Level } from "@/data/lessons";
import { BOARDS, starterProjects, type StarterProject } from "@/data/starterProjects";
import { cn } from "@/lib/utils";

interface Props {
  lessonId: string | null;
  onLessonChange: (id: string | null) => void;
  level: Level;
  completed: string[];
  board: string;
  onBoardChange: (b: string) => void;
  onToggleComplete: (id: string) => void;
  onStartProject: (p: StarterProject, board: string) => void;
  onAskPal: (q: string, ctx: string) => void;
}

const LessonDialog = ({ lessonId, onLessonChange, level, completed, board, onBoardChange, onToggleComplete, onStartProject, onAskPal }: Props) => {
  const index = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = index >= 0 ? allLessons[index] : null;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { setAnswers({}); titleRef.current?.focus(); }, [lessonId]);

  if (!lesson) return null;
  const track = tracks.find((t) => t.lessons.some((l) => l.id === lesson.id))!;
  const pos = track.lessons.findIndex((l) => l.id === lesson.id);
  const done = completed.includes(lesson.id);
  const go = (d: number) => { const n = allLessons[index + d]; if (n) onLessonChange(n.id); };

  return (
    <Dialog open onOpenChange={(o) => !o && onLessonChange(null)}>
      <DialogContent className="max-w-5xl w-[calc(100vw-1rem)] h-[90vh] p-0 gap-0 flex overflow-hidden">
        <nav aria-label="Lessons" className="hidden md:block w-64 shrink-0 border-r border-border overflow-y-auto p-3">
          {tracks.map((t) => (
            <div key={t.id} className="mb-4">
              <p className="terminal-label px-2 mb-1">{t.title}</p>
              {t.lessons.map((l) => (
                <button key={l.id} onClick={() => onLessonChange(l.id)} aria-current={l.id === lesson.id ? "page" : undefined}
                  className={cn("w-full flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", l.id === lesson.id && "bg-primary/10 text-primary")}>
                  {completed.includes(l.id) ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" /> : <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />}
                  <span className="truncate">{l.title}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="md:hidden flex gap-1 px-4 pt-4" aria-label="Lesson stepper">
            {track.lessons.map((l, i) => (
              <button key={l.id} aria-label={`Lesson ${i + 1}: ${l.title}`} onClick={() => onLessonChange(l.id)}
                className={cn("h-1.5 flex-1 rounded-full", i === pos ? "bg-primary" : completed.includes(l.id) ? "bg-primary/50" : "bg-muted")} />
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <DialogHeader className="text-left">
              <p className="terminal-label">{track.title} · {pos + 1}/{track.lessons.length}</p>
              <DialogTitle ref={titleRef} tabIndex={-1} className="text-2xl outline-none">{lesson.title}</DialogTitle>
              <DialogDescription>{lesson.intro[level]}</DialogDescription>
            </DialogHeader>

            <ol className="space-y-4">
              {lesson.sections.map((s, i) => (
                <li key={s.title} className="rounded-lg glass p-4">
                  <h3 className="font-semibold"><span className="font-mono text-xs text-primary mr-2">0{i + 1}</span>{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  {s.analogy && <p className="mt-2 flex gap-2 text-sm"><Lightbulb className="h-4 w-4 shrink-0 text-primary mt-0.5" />{s.analogy}</p>}
                </li>
              ))}
            </ol>

            <section>
              <h3 className="font-semibold mb-2">Key terms</h3>
              <dl className="grid gap-2 sm:grid-cols-2">
                {lesson.keyTerms.map((k) => (
                  <div key={k.term} className="rounded border border-border p-2 text-sm"><dt className="font-mono text-primary">{k.term}</dt><dd className="text-muted-foreground">{k.meaning}</dd></div>
                ))}
              </dl>
            </section>

            {lesson.safety && (
              <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
                <ShieldAlert className="h-4 w-4 shrink-0 text-destructive mt-0.5" /><p><strong>Safety note: </strong>{lesson.safety}</p>
              </div>
            )}

            <section>
              <h3 className="font-semibold mb-2">Quick quiz</h3>
              <div className="space-y-4">
                {lesson.quiz.map((qq, qi) => {
                  const picked = answers[qi];
                  return (
                    <fieldset key={qq.question} className="rounded-lg glass p-4">
                      <legend className="sr-only">{qq.question}</legend>
                      <p className="text-sm font-medium">{qi + 1}. {qq.question}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {qq.options.map((o, oi) => (
                          <Button key={o} size="sm" variant={picked === oi ? (oi === qq.answer ? "default" : "destructive") : "outline"}
                            onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))} aria-pressed={picked === oi}>{o}</Button>
                        ))}
                      </div>
                      {picked !== undefined && (
                        <p role="status" className="mt-2 flex gap-2 text-sm">
                          {picked === qq.answer ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                          {picked === qq.answer ? "Correct! " : "Not quite. "}{qq.explanation}
                        </p>
                      )}
                    </fieldset>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-semibold">Build it</h3>
                <Select value={board} onValueChange={onBoardChange}>
                  <SelectTrigger className="w-40" aria-label="Board"><SelectValue /></SelectTrigger>
                  <SelectContent>{BOARDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.projects.map((pid) => starterProjects[pid]).filter(Boolean).map((p) => (
                  <div key={p.id} className="rounded-lg glass overflow-hidden">
                    <img src={p.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                    <div className="p-3">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                      <Button size="sm" className="mt-3 gap-2" onClick={() => onStartProject(p, board)}><Play className="h-3.5 w-3.5" />Start this project</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="border-t border-border p-3 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous lesson"><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" variant={done ? "secondary" : "default"} onClick={() => onToggleComplete(lesson.id)} className="gap-1">
              <CheckCircle2 className="h-4 w-4" />{done ? "Completed" : "Mark complete"}
            </Button>
            <Button size="sm" variant="ghost" className="gap-1" onClick={() => onAskPal(`Help me understand "${lesson.title}". `, `Lesson: ${lesson.title} — ${lesson.summary}. Key ideas: ${lesson.sections.map((s) => s.title).join(", ")}. Board: ${board}`)}>
              <MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">Ask Pal about this lesson</span><span className="sm:hidden">Ask Pal</span>
            </Button>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => go(1)} disabled={index === allLessons.length - 1} aria-label="Next lesson"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog;
