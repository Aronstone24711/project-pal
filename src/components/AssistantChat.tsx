import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, X, Loader2, MessageSquare, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cn } from "@/lib/utils";
import SafetyNotice from "@/components/SafetyNotice";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AssistantChatProps {
  language: string;
  englishLevel: string;
  context?: string;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assistant-chat`;

const SUGGESTIONS = [
  "Wire an LED to my Arduino",
  "Give me code for a DHT11 sensor",
  "Draw the wiring for a servo on ESP32",
];

const AssistantChat = ({ language, englishLevel, context }: AssistantChatProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const online = useOnlineStatus();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setInput("");
    const history = [...messages, { role: "user" as const, content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: history, language, englishLevel, context }),
      });

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "The assistant is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: answer };
                return next;
              });
            }
          } catch {
            /* partial frame, ignore */
          }
        }
      }

      if (!answer) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "I could not put an answer together. Please ask again.",
          };
          return next;
        });
      }
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-20 right-4 z-50 gap-2 shadow-lg glow-primary"
        aria-label="Open build assistant"
      >
        <Bot className="w-5 h-5" /> Ask Pal
      </Button>
    );
  }

  return (
    <aside
      className="fixed bottom-0 right-0 z-50 flex h-[85vh] w-full max-w-md flex-col glass-strong rounded-t-xl sm:bottom-4 sm:right-4 sm:h-[640px] sm:rounded-xl"
      aria-label="Build assistant"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-primary/15 text-primary">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold leading-none">Pal · build assistant</p>
            <p className="terminal-label mt-1">code · wiring · diagrams</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close assistant">
          <X className="h-4 w-4" />
        </Button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && <SafetyNotice />}
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ask for a circuit and I will give you the wiring table, a text diagram, a picture
              description and working code.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              message.role === "user"
                ? "ml-6 bg-primary/15 text-foreground"
                : "mr-2 bg-card/70 border border-border/60"
            )}
          >
            {message.role === "assistant" && !message.content ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
              </span>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-background/80 prose-pre:border prose-pre:border-border prose-pre:text-xs prose-table:text-xs">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {!online && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <WifiOff className="h-3.5 w-3.5" /> You are offline — the assistant needs a connection.
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border/60 p-3"
      >
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder={online ? "Ask about wiring, code or a diagram…" : "Offline"}
            disabled={!online || busy}
            className="min-h-[44px] resize-none bg-background/60"
          />
          <Button type="submit" size="icon" disabled={!online || busy || !input.trim()} aria-label="Send">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MessageSquare className="h-3 w-3" /> Enter to send · Shift+Enter for a new line
        </p>
      </form>
    </aside>
  );
};

export default AssistantChat;