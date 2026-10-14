import { Suspense, lazy, useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, GraduationCap, Microchip, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { allLessons, tracks, type Level } from "@/data/lessons";
import type { StarterProject } from "@/data/starterProjects";
import { useLessonProgress } from "@/hooks/useLessonProgress";

const LessonDialog = lazy(() => import("@/components/lessons/LessonDialog"));

interface Props {
  englishLevel?: string;
  onStartProject: (p: StarterProject, board: string) => void;
  onAskPal: (q: string, ctx: string) => void;
}

const LearningTracks = ({ englishLevel = "easy", onStartProject, onAskPal }: Props) => {
  const progress = useLessonProgress();
  const [openId, setOpenId] = useState<string | null>(null);
  const level = (["easy", "medium", "hard"].includes(englishLevel) ? englishLevel : "easy") as Level;
  const pct = (ids: string[]) => Math.round((ids.filter((id) => progress.completed.includes(id)).length / ids.length) * 100);
  const overall = pct(allLessons.map((l) => l.id));

  const open = (id: string | null) => { setOpenId(id); if (id) progress.setLastLesson(id); };
  const resume = progress.lastLesson ?? allLessons.find((l) => !progress.completed.includes(l.id))?.id ?? allLessons[0].id;

  useEffect(() => {
    const h = () => open(resume);
    window.addEventListener("searchall:open-learn", h);
    return () => window.removeEventListener("searchall:open-learn", h);
  });

  return (
    <section id="learn" className="max-w-5xl mx-auto pt-20 scroll-mt-24" aria-labelledby="learning-tracks">
      <div className="border-b border-border/60 pb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="terminal-label">// learn electronics</p>
          <h2 id="learning-tracks" className="mt-2 text-2xl md:text-3xl font-bold">Learn the idea, then build it</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Full lessons with quizzes and hands-on projects. Works offline.</p>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Overall</span><span>{overall}%</span></div>
          <Progress value={overall} aria-label="Overall progress" />
          <Button size="sm" className="mt-3 gap-2 w-full" onClick={() => open(resume)}>
            <PlayCircle className="h-4 w-4" />{progress.completed.length ? "Resume learning" : "Start learning"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tracks.map((track) => {
          const p = pct(track.lessons.map((l) => l.id));
          return (
            <article key={track.id} className="rounded-lg glass p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                  {track.id === "beginner" ? <GraduationCap className="h-5 w-5" /> : <Microchip className="h-5 w-5" />}
                </div>
                <Badge variant="outline">{track.label}</Badge>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{track.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>
              <div className="mt-3 flex items-center gap-2"><Progress value={p} className="h-1.5" aria-label={`${track.title} progress`} /><span className="text-xs font-mono text-muted-foreground">{p}%</span></div>
              <ul className="mt-4 space-y-1">
                {track.lessons.map((lesson, index) => (
                  <li key={lesson.id}>
                    <Button variant="ghost" className="h-auto w-full justify-between gap-3 px-2 py-2 text-left" onClick={() => open(lesson.id)}>
                      <span className="flex min-w-0 items-center gap-3">
                        {progress.completed.includes(lesson.id) ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : <span className="font-mono text-xs text-muted-foreground w-4">0{index + 1}</span>}
                        <span className="truncate text-sm">{lesson.title}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      {openId && (
        <Suspense fallback={null}>
          <LessonDialog
            lessonId={openId}
            onLessonChange={open}
            level={level}
            completed={progress.completed}
            board={progress.board}
            onBoardChange={progress.setBoard}
            onToggleComplete={progress.toggleComplete}
            onStartProject={(p, b) => { setOpenId(null); onStartProject(p, b); }}
            onAskPal={onAskPal}
          />
        </Suspense>
      )}
    </section>
  );
};

export default LearningTracks;
