# Electronics Knowledge Assistant

Add a built-in "Board Knowledge" section that explains microcontroller boards (starting with Arduino Uno) in a structured, beginner-friendly way — pin functions, basic components, and practical examples — without needing the AI service, so it also works offline.

## What you'll see

- A new **"Know your board"** section on the home page, below the lessons.
- A board picker (Arduino Uno, ESP32, Raspberry Pi, plus any custom boards the user added).
- For each board, three beginner-friendly tabs:
  1. **Pins explained** — every pin group (power, digital, analog, communication) in plain language, with what each one is for and a caution where needed (e.g. "3.3V only").
  2. **Basic components** — LED, resistor, button, sensor, buzzer: what they do, how to identify legs/polarity, and how they connect to the board. Resistor help includes reading color bands, choosing a suitable value (including an LED current-limiting example), checking with a multimeter, and safe placement in a circuit; explain that ordinary resistors have no polarity.
  3. **Try it examples** — 2–3 tiny practical examples per board (e.g. blink an LED, read a button) with a short wiring list and a minimal code snippet matching the app's instruction style.
- Language level selector (easy/medium/hard) already chosen by the user adjusts the wording: easy = very simple words, hard = datasheet-style terms.
- A "Ask Pal about this board" button that opens the existing side assistant with the board's context pre-filled, for follow-up questions.

## Technical details

- New static data module `src/data/boardKnowledge.ts` with typed entries: pin groups, components, and examples per board — no network needed, fully offline.
- New component `src/components/BoardKnowledge.tsx` (tabs via existing shadcn `Tabs`, semantic colors only, matches the terminal/glass design).
- Rendered in `WelcomePage.tsx` between `LearningTracks` and `FeatureGrid`.
- Wording variants per `englishLevel` stored in the data module; the existing `englishLevel` prop is passed down.
- Resistor examples include a clear wiring walkthrough and simple value calculation, with safe limits tailored to the selected board's logic voltage.
- "Ask Pal" reuses `AssistantChat` by passing the board summary as `context`.
- No backend changes; no new dependencies. Verify with a production build and a browser check of the new section.
