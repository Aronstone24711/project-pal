import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, GraduationCap, Microchip, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Lesson {
  title: string;
  summary: string;
  takeaway: string;
}

const tracks: Array<{
  id: "beginner" | "expert";
  label: string;
  title: string;
  description: string;
  lessons: Lesson[];
}> = [
  {
    id: "beginner",
    label: "Start here",
    title: "Beginner electronics",
    description: "Small wins that make circuits feel clear, safe, and friendly.",
    lessons: [
      { title: "How a circuit flows", summary: "See power, ground, and the complete path around a circuit.", takeaway: "A circuit needs a complete loop from power back to ground." },
      { title: "Your first LED", summary: "Use a resistor, identify the LED legs, and make it blink.", takeaway: "The longer LED leg is usually positive. Always limit current." },
      { title: "Read a light sensor", summary: "Turn changing light into a number your board can understand.", takeaway: "Sensors provide readings; your code decides what they mean." },
    ],
  },
  {
    id: "expert",
    label: "Go deeper",
    title: "Expert systems",
    description: "Engineering habits for reliable, expandable, real-world builds.",
    lessons: [
      { title: "Power budgeting", summary: "Estimate current draw before motors and radios create failures.", takeaway: "Budget peak current, not only the average shown in a datasheet." },
      { title: "Reliable I²C buses", summary: "Choose pull-ups, cable lengths, and recovery behavior with intent.", takeaway: "A working bus is a timing and electrical system, not just two wires." },
      { title: "Design with state machines", summary: "Replace tangled delays with clear states and transitions.", takeaway: "Name each system state, then define what changes it." },
    ],
  },
];

const LearningTracks = () => {
  const [activeTrack, setActiveTrack] = useState<typeof tracks[number] | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  return (
    <section className="max-w-5xl mx-auto pt-20" aria-labelledby="learning-tracks">
      <div className="border-b border-border/60 pb-4">
        <p className="terminal-label">// learn at your pace</p>
        <h2 id="learning-tracks" className="mt-2 text-2xl md:text-3xl font-bold">Lessons for first builds and serious systems</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Choose a track, open a lesson, and learn the idea before you wire it.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tracks.map((track) => (
          <article key={track.id} className="rounded-lg glass p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                {track.id === "beginner" ? <GraduationCap className="h-5 w-5" /> : <Microchip className="h-5 w-5" />}
              </div>
              <Badge variant="outline">{track.label}</Badge>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{track.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>
            <ul className="mt-5 space-y-2">
              {track.lessons.map((lesson, index) => (
                <li key={lesson.title}>
                  <Button variant="ghost" className="h-auto w-full justify-between gap-3 px-2 py-2 text-left" onClick={() => { setActiveTrack(track); setActiveLesson(lesson); }}>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                      <span className="truncate text-sm">{lesson.title}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <Dialog open={Boolean(activeLesson)} onOpenChange={(open) => { if (!open) { setActiveLesson(null); setActiveTrack(null); } }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary"><BookOpen className="h-4 w-4" /><span className="terminal-label">{activeTrack?.title}</span></div>
            <DialogTitle>{activeLesson?.title}</DialogTitle>
            <DialogDescription>{activeLesson?.summary}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{activeLesson?.takeaway}</p>
          </div>
          <Button variant="outline" onClick={() => { setActiveLesson(null); setActiveTrack(null); }} className="gap-2"><X className="h-4 w-4" />Close lesson</Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LearningTracks;