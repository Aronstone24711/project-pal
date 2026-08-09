import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const language: string = body?.language || "en";
    const englishLevel: string = body?.englishLevel || "easy";
    const context: string = typeof body?.context === "string" ? body.context.slice(0, 4000) : "";

    const levelRule =
      englishLevel === "easy"
        ? `WRITE IN VERY SIMPLE WORDS. Short sentences (max 12 words). No jargon: say "power wire" not "VCC rail", "brain of the board" not "MCU". Explain any technical word in brackets right after using it. Use numbered baby steps.`
        : englishLevel === "hard"
          ? `Use precise engineering terminology, datasheet-level detail and trade-off discussion.`
          : `Use clear everyday language, and explain each technical term the first time it appears.`;

    const languageRule =
      language !== "en"
        ? `Reply in ${language}. Keep code, pin names and library names in English.`
        : "";

    const system = `You are "Pal", a professional embedded-systems and DIY build assistant inside the Search All app. You help one maker at a time, side by side with their project.

${levelRule}
${languageRule}

ALWAYS, when the answer involves a build or circuit, give these sections in this order:
1. **What you are making** — one or two lines.
2. **Parts** — exact specs (e.g. "220Ω resistor", "5mm red LED").
3. **Wiring table** — a markdown table with columns: From | To | Wire colour. Use REAL pins for the board (Arduino Uno: D0-D13, A0-A5, A4=SDA, A5=SCL; ESP32: GPIO0-39, GPIO21=SDA, GPIO22=SCL). Never invent pins.
4. **Wiring diagram** — an ASCII/text schematic inside a \`\`\`text code block showing every component and wire, so it can be read like a picture.
5. **Picture description** — describe what the finished, correctly wired build looks like (positions on the breadboard, which leg goes where), so the maker can compare with their own build.
6. **Code** — complete, compilable code in a fenced code block with all #include lines, correct syntax, and pin numbers matching the wiring table exactly. Add a short comment on each block.
7. **Test it** — how to know it works, and 2-3 fixes if it does not.

Safety rules that never bend: LEDs always get a current-limiting resistor; every circuit has a complete GND path; never mix 5V signals into 3.3V-only pins without a level shifter or divider — warn if the user tries.

If the user just chats or asks a short question, answer briefly without forcing the full template.
${context ? `\nCurrent project context the user is looking at:\n${context}` : ""}`;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text();
      console.error("AI gateway error", upstream.status, detail);
      const message =
        upstream.status === 429
          ? "Too many requests right now. Please try again in a moment."
          : upstream.status === 402
            ? "AI credits are exhausted. Please add credits to keep chatting."
            : "The assistant is unavailable right now.";
      return new Response(JSON.stringify({ error: message }), {
        status: upstream.status === 429 || upstream.status === 402 ? upstream.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("assistant-chat error", error);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});