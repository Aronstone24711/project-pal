/** Static lesson content — bundled with the app so it works fully offline. */
export type Level = "easy" | "medium" | "hard";

export interface LessonSection {
  title: string;
  body: string;
  analogy?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  intro: Record<Level, string>;
  sections: LessonSection[];
  keyTerms: Array<{ term: string; meaning: string }>;
  safety?: string;
  quiz: QuizQuestion[];
  /** Keys into starterProjects. */
  projects: string[];
}

export interface Track {
  id: "beginner" | "expert";
  label: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const q = (question: string, options: string[], answer: number, explanation: string): QuizQuestion => ({ question, options, answer, explanation });

const beginner: Lesson[] = [
  {
    id: "b-circuit",
    title: "What is a circuit?",
    summary: "Voltage, current, resistance, and Ohm's law with a worked example.",
    intro: {
      easy: "A circuit is a loop. Electricity leaves the battery, does a job, and comes back. If the loop is broken, nothing works.",
      medium: "A circuit is a closed path that lets current flow from a source, through a load, and back. Three quantities describe it: voltage, current, and resistance.",
      hard: "A circuit is a closed conductive path between potentials. Its behavior is governed by V = I × R for resistive elements and Kirchhoff's current and voltage laws.",
    },
    sections: [
      { title: "Voltage is the push", body: "Voltage (V) is the difference in electrical 'pressure' between two points. A 5V pin pushes harder than a 3.3V pin.", analogy: "Like water pressure in a pipe — higher pressure pushes more strongly." },
      { title: "Current is the flow", body: "Current (I) is how much charge moves per second, measured in amps (A) or milliamps (mA). Parts are damaged by too much current.", analogy: "Like how many litres of water pass each second." },
      { title: "Resistance slows the flow", body: "Resistance (R), in ohms (Ω), limits current. Resistors are parts made just to do this.", analogy: "Like a narrow section of pipe." },
      { title: "Ohm's law ties them together", body: "V = I × R. Worked example: 5V across a 1000Ω resistor gives I = 5 ÷ 1000 = 0.005A = 5mA. Want 10mA from 5V? R = 5 ÷ 0.010 = 500Ω.", analogy: "More push or a wider pipe means more flow." },
      { title: "The loop must close", body: "Current only flows when there is an unbroken path from + through the load back to − (GND). Every part needs a ground connection." },
    ],
    keyTerms: [
      { term: "Voltage (V)", meaning: "Electrical push between two points." },
      { term: "Current (A)", meaning: "Amount of charge flowing per second." },
      { term: "Resistance (Ω)", meaning: "How much a part limits current." },
      { term: "GND", meaning: "The 0V reference every circuit returns to." },
    ],
    safety: "Never connect + directly to GND (a short circuit) — it can overheat wires and damage your board or battery. Never work on mains (wall) electricity.",
    quiz: [
      q("Using V = I × R, what current flows through 220Ω at 5V?", ["~2.3mA", "~23mA", "~230mA"], 1, "5 ÷ 220 ≈ 0.0227A, which is about 23mA."),
      q("What happens if the circuit loop is broken?", ["Current flows faster", "No current flows", "Voltage doubles"], 1, "Current needs a complete path; an open circuit stops it."),
      q("Which unit measures resistance?", ["Volt", "Amp", "Ohm"], 2, "Resistance is measured in ohms (Ω)."),
    ],
    projects: ["blink-led"],
  },
  {
    id: "b-breadboard",
    title: "Reading a breadboard",
    summary: "Learn which holes are connected so you can build without soldering.",
    intro: {
      easy: "A breadboard is a board full of holes. Some holes are joined together inside. Knowing which ones lets you build circuits fast.",
      medium: "A breadboard has internal metal strips that connect groups of holes, so you can prototype circuits without soldering.",
      hard: "Solderless breadboards use spring-clip strips: 5-hole terminal rows per side of the center channel and full-length power rails, with roughly 2–5pF inter-row capacitance.",
    },
    sections: [
      { title: "Terminal rows", body: "Each short row of 5 holes (a–e or f–j) is connected inside. Parts in the same row are joined.", analogy: "Like a row of seats on one bench." },
      { title: "The center gap", body: "The gap in the middle separates the two halves. Chips (ICs) and buttons sit across it so their pins are not shorted." },
      { title: "Power rails", body: "The long red (+) and blue (−) lines down the sides run the full length. Connect your board's 5V or 3.3V and GND here.", analogy: "Like a power strip you can plug into anywhere." },
      { title: "Check split rails", body: "On some full-size boards the rails break in the middle. Bridge them with a jumper if you need power along the whole length." },
    ],
    keyTerms: [
      { term: "Terminal strip", meaning: "A group of 5 connected holes." },
      { term: "Power rail", meaning: "Long strip for + or GND." },
      { term: "Jumper wire", meaning: "Wire that links two holes." },
    ],
    safety: "Unplug USB power before moving wires. A misplaced wire across the rails can short + to GND.",
    quiz: [
      q("Are holes a5 and e5 connected?", ["Yes", "No"], 0, "a–e in the same numbered row share one strip."),
      q("Why do chips sit across the center gap?", ["To look neat", "So opposite pins aren't shorted", "It cools them"], 1, "Each side of the gap is a separate strip, keeping pins apart."),
      q("What are the long side strips for?", ["Power and ground", "Only signals", "Nothing"], 0, "They are power rails for + and GND."),
    ],
    projects: ["blink-led"],
  },
  {
    id: "b-led",
    title: "LEDs and resistors",
    summary: "Identify LED legs, pick a resistor, and light it safely.",
    intro: {
      easy: "An LED is a tiny light. It only works one way round, and it always needs a resistor to stop too much electricity.",
      medium: "LEDs are diodes: they conduct in one direction and drop a roughly fixed voltage. A series resistor sets a safe current.",
      hard: "An LED has a forward voltage Vf (≈1.8–2.2V red, ≈3V blue/white). Series resistance R = (Vsupply − Vf) ÷ If sets forward current.",
    },
    sections: [
      { title: "Find the legs", body: "The longer leg is the anode (+). The shorter leg, near the flat edge of the case, is the cathode (−) and goes toward GND." },
      { title: "Why the resistor?", body: "An LED has very little resistance once it turns on, so without a resistor current rises until it burns out — or damages your pin.", analogy: "Like a speed bump that keeps traffic slow and safe." },
      { title: "Calculate it", body: "R = (Supply − LED voltage) ÷ current. For 5V, red LED ≈2V, 10mA: (5 − 2) ÷ 0.010 = 300Ω → use 330Ω. On 3.3V boards: (3.3 − 2) ÷ 0.006 ≈ 217Ω → use 220Ω or 330Ω." },
      { title: "Wire it", body: "Board pin → resistor → LED anode (long leg) → LED cathode (short leg) → GND. The resistor may go on either side of the LED." },
    ],
    keyTerms: [
      { term: "Anode", meaning: "LED + leg (longer)." },
      { term: "Cathode", meaning: "LED − leg (shorter, flat side)." },
      { term: "Forward voltage", meaning: "Voltage an LED uses when lit." },
    ],
    safety: "Always use a current-limiting resistor. Keep each pin's current low (around 10mA on Arduino, 6mA or less on ESP32/Raspberry Pi 3.3V pins).",
    quiz: [
      q("Which LED leg goes toward GND?", ["Longer leg", "Shorter leg"], 1, "The shorter leg is the cathode (−)."),
      q("Supply 5V, LED 2V, 10mA. What resistor?", ["30Ω", "300Ω (use 330Ω)", "3000Ω"], 1, "(5 − 2) ÷ 0.01 = 300Ω; round up to 330Ω."),
      q("What happens without a resistor?", ["LED is dimmer", "Too much current can burn it", "Nothing"], 1, "Current is not limited and can destroy the LED or the pin."),
    ],
    projects: ["blink-led", "night-lamp"],
  },
  {
    id: "b-button",
    title: "Buttons, pull-up and pull-down",
    summary: "Read a button reliably without random 'floating' values.",
    intro: {
      easy: "A button tells your board when you press it. A small helper resistor keeps the reading steady when you are not pressing.",
      medium: "Digital inputs need a defined level when the button is open. Pull-up or pull-down resistors provide it.",
      hard: "An unconnected CMOS input floats and picks up noise. A pull resistor (typically 10kΩ, or the MCU's internal ~20–50kΩ) defines the idle state; mechanical bounce must also be filtered.",
    },
    sections: [
      { title: "Floating inputs", body: "If a pin is connected to nothing, it can read HIGH or LOW randomly.", analogy: "Like a flag in the wind with no one holding it." },
      { title: "Pull-up", body: "A resistor to + keeps the pin HIGH. Pressing the button connects it to GND, so pressed = LOW. Most boards have a built-in pull-up (INPUT_PULLUP)." },
      { title: "Pull-down", body: "A resistor to GND keeps the pin LOW. Pressing connects it to +, so pressed = HIGH." },
      { title: "Debounce", body: "Metal contacts bounce for a few milliseconds, creating several presses. Ignore changes for ~20–50ms after the first one." },
    ],
    keyTerms: [
      { term: "Floating", meaning: "An input with no defined level." },
      { term: "Pull-up", meaning: "Resistor that holds a pin HIGH." },
      { term: "Debounce", meaning: "Filtering out contact bounce." },
    ],
    safety: "On 3.3V boards (ESP32, Raspberry Pi), pull up to 3.3V — never 5V — or you can damage the pin.",
    quiz: [
      q("With INPUT_PULLUP, what does a pressed button read?", ["HIGH", "LOW"], 1, "The button connects the pin to GND, so it reads LOW."),
      q("Why do inputs need a pull resistor?", ["To save power", "So they don't float", "To make LEDs brighter"], 1, "It gives the pin a defined level when the button is open."),
      q("What is bounce?", ["Contacts making several quick presses", "A loose wire", "A slow board"], 0, "Mechanical contacts chatter briefly before settling."),
    ],
    projects: ["button-toggle"],
  },
  {
    id: "b-analog-digital",
    title: "Analog vs digital signals",
    summary: "Understand on/off signals versus smooth ranges of values.",
    intro: {
      easy: "Digital means only ON or OFF. Analog means any value in between, like a dimmer instead of a switch.",
      medium: "Digital signals have two states (HIGH/LOW); analog signals vary continuously. Boards read analog through an ADC.",
      hard: "Digital I/O resolves to logic thresholds (e.g. VIH/VIL); analog inputs are sampled and quantized by an ADC into an integer code.",
    },
    sections: [
      { title: "Digital", body: "A digital pin reads or writes HIGH (near supply voltage) or LOW (near 0V). Buttons and LEDs on/off are digital.", analogy: "A light switch." },
      { title: "Analog", body: "An analog value can be anything in a range, like 0V–5V. Knobs, light, and temperature are analog.", analogy: "A volume knob." },
      { title: "Converting with an ADC", body: "An analog-to-digital converter turns voltage into a number. Arduino Uno: 0–1023 for 0–5V. ESP32: 0–4095 for about 0–3.3V." },
      { title: "Raspberry Pi note", body: "Raspberry Pi has no analog inputs. Use an external ADC chip such as the MCP3008 over SPI." },
    ],
    keyTerms: [
      { term: "HIGH / LOW", meaning: "The two digital states." },
      { term: "ADC", meaning: "Analog-to-digital converter." },
      { term: "Resolution", meaning: "How many steps the ADC has." },
    ],
    safety: "Don't feed more than the board's voltage into an analog pin — 3.3V max on ESP32.",
    quiz: [
      q("A button is usually which kind of signal?", ["Analog", "Digital"], 1, "It is either pressed or not."),
      q("Uno analogRead returns 512. Roughly what voltage?", ["~1.2V", "~2.5V", "~5V"], 1, "512/1023 × 5V ≈ 2.5V."),
      q("How can a Raspberry Pi read analog?", ["analogRead()", "With an external ADC", "It can't, ever"], 1, "Use an ADC chip like MCP3008."),
    ],
    projects: ["led-dimmer", "night-lamp"],
  },
  {
    id: "b-sensors",
    title: "Reading sensors",
    summary: "Turn light, moisture, and temperature into numbers your code can use.",
    intro: {
      easy: "Sensors are your project's eyes and ears. They give a number, and your code decides what it means.",
      medium: "Sensors convert physical quantities into voltage or digital data. You read them, then calibrate and act on the values.",
      hard: "Sensors are either analog (ratiometric voltage), or digital (I2C/SPI/1-Wire). Calibration maps raw codes to physical units; filtering reduces noise.",
    },
    sections: [
      { title: "Voltage divider sensors", body: "An LDR (light sensor) changes resistance with light. Put it in series with a 10kΩ resistor; the middle point goes to an analog pin.", analogy: "Two people sharing a rope — the middle point moves as one pulls harder." },
      { title: "Read raw values", body: "Print readings to the Serial Monitor first. Note values in bright light and darkness, or in dry and wet soil." },
      { title: "Calibrate", body: "Use map() or your own math to turn raw numbers into 0–100% or real units using the min/max you measured." },
      { title: "Decide with thresholds", body: "if (light < 300) turn LED on. Add a small gap (hysteresis) so it doesn't flicker near the threshold." },
    ],
    keyTerms: [
      { term: "Voltage divider", meaning: "Two resistors that split a voltage." },
      { term: "Calibration", meaning: "Matching raw values to real meaning." },
      { term: "Hysteresis", meaning: "A gap between on and off thresholds." },
    ],
    safety: "Use capacitive soil sensors where possible and keep water away from the board and USB cable.",
    quiz: [
      q("What do you pair with an LDR to read it?", ["A fixed resistor (voltage divider)", "A capacitor only", "Nothing"], 0, "The divider turns resistance change into a voltage change."),
      q("Why print raw values first?", ["To calibrate", "It's required by law", "To save power"], 0, "You need real min/max readings to calibrate."),
      q("What stops a lamp flickering at the threshold?", ["Hysteresis", "More current", "A bigger LED"], 0, "Separate on/off thresholds prevent rapid toggling."),
    ],
    projects: ["night-lamp", "plant-monitor"],
  },
  {
    id: "b-multimeter",
    title: "Using a multimeter",
    summary: "Measure voltage, check continuity, and confirm resistor values.",
    intro: {
      easy: "A multimeter is a tool that tells you what's happening in your circuit, like a doctor's thermometer for electronics.",
      medium: "A multimeter measures voltage, resistance, continuity, and current — your main tool for debugging circuits.",
      hard: "Use DC voltage mode in parallel, resistance on unpowered circuits only, and current mode in series with the fused input matched to the expected range.",
    },
    sections: [
      { title: "Measure voltage", body: "Set to DC V (V⎓). Black probe on GND, red probe on the point to test. A 5V rail should read about 4.8–5.1V." },
      { title: "Check continuity", body: "Use the beep mode with power OFF. A beep means two points are connected — great for finding broken wires.", analogy: "Like checking if a pipe is blocked by blowing through it." },
      { title: "Measure resistance", body: "Set to Ω with the part out of the circuit or power off. Compare with the color bands." },
      { title: "Measuring current", body: "Current mode goes in series (break the circuit). Move the red lead back to V afterwards — leaving it in A mode can blow the fuse next time." },
    ],
    keyTerms: [
      { term: "DC V", meaning: "Steady voltage mode." },
      { term: "Continuity", meaning: "Beep test for connections." },
      { term: "Series", meaning: "In the path of the current." },
    ],
    safety: "Never measure mains. Never measure resistance or continuity on a powered circuit.",
    quiz: [
      q("Which mode finds a broken wire?", ["Continuity", "AC V", "Current"], 0, "It beeps when two points connect."),
      q("Is the circuit powered when measuring resistance?", ["Yes", "No"], 1, "Power must be off for accurate, safe readings."),
      q("How is current measured?", ["In parallel", "In series"], 1, "The meter must be part of the current path."),
    ],
    projects: ["blink-led"],
  },
  {
    id: "b-pwm",
    title: "PWM and dimming",
    summary: "Fake 'in-between' power by switching very fast.",
    intro: {
      easy: "PWM turns a light on and off so fast your eyes see it as dimmer or brighter.",
      medium: "Pulse-width modulation varies the fraction of time a pin is HIGH (duty cycle) to control average power.",
      hard: "PWM sets duty cycle D at fixed frequency f; average voltage ≈ D × Vcc. Choose f above flicker (>~500Hz for LEDs) and suitable for the load (e.g. ~20kHz for motors).",
    },
    sections: [
      { title: "Duty cycle", body: "0% = always off, 50% = half the time on, 100% = always on. Arduino analogWrite uses 0–255.", analogy: "Flicking a light switch very fast." },
      { title: "Which pins?", body: "Arduino Uno PWM pins are marked ~ (3, 5, 6, 9, 10, 11). ESP32 can use LEDC on most outputs. Raspberry Pi supports software PWM via gpiozero." },
      { title: "Fade an LED", body: "Read a potentiometer (0–1023), divide by 4 to get 0–255, then analogWrite it to the LED pin." },
      { title: "Bigger loads", body: "Motors need a transistor or driver; the pin only provides the control signal." },
    ],
    keyTerms: [
      { term: "PWM", meaning: "Pulse-width modulation." },
      { term: "Duty cycle", meaning: "% of time the signal is HIGH." },
      { term: "Frequency", meaning: "How many pulses per second." },
    ],
    safety: "Never drive a motor directly from a board pin — use a driver and separate power.",
    quiz: [
      q("analogWrite(pin, 128) is about what duty cycle?", ["25%", "50%", "100%"], 1, "128/255 ≈ 50%."),
      q("Which Uno pin supports PWM?", ["Pin 2", "Pin 9", "Pin 4"], 1, "Pin 9 has the ~ mark."),
      q("Why does a PWM LED look dim, not flickery?", ["It switches too fast to see", "The resistor smooths it", "It doesn't work"], 0, "Your eyes average the fast pulses."),
    ],
    projects: ["led-dimmer"],
  },
];

const expert: Lesson[] = [
  {
    id: "e-power",
    title: "Power budgeting",
    summary: "Estimate current draw before motors and radios create failures.",
    intro: {
      easy: "Every part uses some electricity. Add it all up so your battery or power supply is big enough.",
      medium: "A power budget sums the current of every part, including peaks, to size regulators, batteries, and wiring.",
      hard: "Budget average and peak current per rail, regulator dissipation (P = (Vin − Vout) × I for linear regulators), and battery life = capacity ÷ average current, with margin.",
    },
    sections: [
      { title: "List every load", body: "Board, sensors, LEDs, radios, motors. Use datasheet typical and maximum values." },
      { title: "Peaks matter", body: "ESP32 Wi-Fi transmit can spike to ~250–350mA; a motor stall can draw several amps. Size for peaks, not averages.", analogy: "Plan a bridge for the heaviest truck, not the average car." },
      { title: "Regulator heat", body: "A linear regulator dropping 9V to 5V at 300mA burns (9 − 5) × 0.3 = 1.2W as heat. Use a buck converter for large drops." },
      { title: "Battery life", body: "2000mAh ÷ 80mA average ≈ 25 hours, minus ~20% margin ≈ 20 hours." },
      { title: "Separate noisy loads", body: "Give motors their own supply and join only the grounds. Add bulk capacitors near the load." },
    ],
    keyTerms: [
      { term: "Peak current", meaning: "Short-term maximum draw." },
      { term: "Buck converter", meaning: "Efficient step-down regulator." },
      { term: "Brownout", meaning: "Reset caused by voltage sagging." },
    ],
    safety: "Lithium cells can catch fire if shorted or over-discharged — use protected cells and proper chargers. Never use mains-powered builds without proper enclosures and expertise.",
    quiz: [
      q("Linear regulator 12V→5V at 200mA dissipates?", ["0.4W", "1.4W", "2.4W"], 1, "(12 − 5) × 0.2 = 1.4W."),
      q("1000mAh at 50mA average lasts roughly?", ["2h", "20h", "200h"], 1, "1000 ÷ 50 = 20h before margin."),
      q("Why size for peak current?", ["Peaks cause brownouts", "Averages are illegal", "Peaks save power"], 0, "Short spikes sag the rail and reset the MCU."),
    ],
    projects: ["obstacle-rover", "weather-logger"],
  },
  {
    id: "e-buses",
    title: "I2C and SPI buses",
    summary: "Choose and wire serial buses for sensors and displays.",
    intro: {
      easy: "I2C and SPI are ways for your board to talk to sensors and screens using just a few wires.",
      medium: "I2C uses two shared wires with addresses; SPI uses separate select lines and is faster.",
      hard: "I2C is open-drain (SDA/SCL) needing pull-ups sized for bus capacitance; SPI is push-pull with SCLK/MOSI/MISO/CS and configurable mode (CPOL/CPHA).",
    },
    sections: [
      { title: "I2C basics", body: "Two wires: SDA (data) and SCL (clock). Each device has an address like 0x3C. Run an I2C scanner to find them." , analogy: "A group chat where each member has a name." },
      { title: "Pull-ups", body: "I2C lines need pull-up resistors (2.2k–10kΩ) to the bus voltage. Many modules include them; too many in parallel makes the bus too strong." },
      { title: "SPI basics", body: "SCLK, MOSI, MISO, plus one CS (chip select) per device. Faster than I2C — good for displays and SD cards.", analogy: "Separate phone lines to each person." },
      { title: "Voltage levels", body: "Mixing 5V modules with 3.3V boards needs a level shifter, or modules that run at 3.3V." },
      { title: "Keep wires short", body: "I2C is designed for on-board distances. Long cables add capacitance and errors; slow the clock or use a bus extender." },
    ],
    keyTerms: [
      { term: "SDA/SCL", meaning: "I2C data and clock." },
      { term: "Address", meaning: "Unique I2C device ID." },
      { term: "Chip select", meaning: "SPI line choosing a device." },
    ],
    safety: "Don't pull I2C lines up to 5V when connected to a 3.3V board such as ESP32 or Raspberry Pi.",
    quiz: [
      q("How many signal wires does I2C use?", ["2", "4", "8"], 0, "SDA and SCL (plus power and GND)."),
      q("Why does I2C need pull-ups?", ["Lines are open-drain", "To add speed", "For decoration"], 0, "Devices only pull low; resistors return the line high."),
      q("Adding a 3rd SPI device needs?", ["Another CS line", "A new address", "Nothing"], 0, "Each SPI device gets its own chip select."),
    ],
    projects: ["plant-monitor", "weather-logger"],
  },
  {
    id: "e-adc",
    title: "ADC resolution and noise",
    summary: "Get stable, accurate analog readings.",
    intro: {
      easy: "Analog readings can jump around. A few tricks make them calm and accurate.",
      medium: "ADC accuracy depends on resolution, reference voltage, and noise. Averaging and good wiring help.",
      hard: "Effective resolution is limited by reference accuracy, INL/DNL, and noise. Oversampling by 4ⁿ adds ~n bits; source impedance must suit the sample-and-hold.",
    },
    sections: [
      { title: "Resolution", body: "10-bit = 1024 steps. At 5V that's ~4.9mV per step. 12-bit at 3.3V ≈ 0.8mV per step." },
      { title: "Reference voltage", body: "Readings are relative to the reference. If USB 5V is really 4.8V, all readings shift. Use a stable reference where possible." },
      { title: "Average samples", body: "Take 16 readings and average them to reduce random noise.", analogy: "Asking 16 people the time and averaging." },
      { title: "ESP32 quirks", body: "The ESP32 ADC is non-linear near 0V and the top of the range, and ADC2 can't be used while Wi-Fi is on. Use ADC1 pins and calibration APIs." },
      { title: "Hardware filtering", body: "A 100nF capacitor from the analog pin to GND near the board smooths fast noise." },
    ],
    keyTerms: [
      { term: "LSB", meaning: "Voltage of one ADC step." },
      { term: "Vref", meaning: "Voltage the ADC compares against." },
      { term: "Oversampling", meaning: "Averaging many samples." },
    ],
    quiz: [
      q("Volts per step for 10-bit at 5V?", ["~4.9mV", "~49mV", "~0.49mV"], 0, "5 ÷ 1024 ≈ 4.9mV."),
      q("Which ESP32 ADC works with Wi-Fi on?", ["ADC1", "ADC2"], 0, "ADC2 is shared with the Wi-Fi driver."),
      q("A simple fix for noisy readings?", ["Average samples", "Raise voltage", "Longer wires"], 0, "Averaging reduces random noise."),
    ],
    projects: ["plant-monitor"],
  },
  {
    id: "e-interrupts",
    title: "Interrupts vs polling",
    summary: "React instantly to events without blocking your loop.",
    intro: {
      easy: "Polling means checking again and again. Interrupts mean the board taps you on the shoulder when something happens.",
      medium: "Polling checks inputs in the loop; interrupts run a short function the moment a pin changes.",
      hard: "ISRs preempt main code; keep them minimal, mark shared variables volatile, guard multi-byte access, and defer work to the main loop.",
    },
    sections: [
      { title: "Polling", body: "loop() reads the pin each pass. Simple, but a long delay() means you miss events.", analogy: "Checking your mailbox every five minutes." },
      { title: "Interrupts", body: "attachInterrupt(pin, isr, FALLING) runs isr() immediately on a falling edge.", analogy: "A doorbell." },
      { title: "Keep ISRs short", body: "Set a flag or count, then return. No Serial printing or delay() inside an ISR." },
      { title: "Shared variables", body: "Mark them volatile. On 8-bit boards, read multi-byte values with interrupts briefly disabled." },
      { title: "When to choose which", body: "Poll for slow things (temperature). Use interrupts for fast or rare events (encoder pulses, wake-up buttons)." },
    ],
    keyTerms: [
      { term: "ISR", meaning: "Interrupt service routine." },
      { term: "volatile", meaning: "Tells compiler a variable changes unexpectedly." },
      { term: "Edge", meaning: "A change from LOW→HIGH or HIGH→LOW." },
    ],
    quiz: [
      q("Should you use delay() in an ISR?", ["Yes", "No"], 1, "ISRs must be fast and non-blocking."),
      q("Shared ISR variables should be?", ["volatile", "const", "static only"], 0, "volatile prevents the compiler caching stale values."),
      q("Best for counting fast encoder pulses?", ["Polling with delay", "Interrupts"], 1, "Interrupts catch each edge."),
    ],
    projects: ["button-toggle", "obstacle-rover"],
  },
  {
    id: "e-state",
    title: "Design with state machines",
    summary: "Replace tangled delays with clear states and transitions.",
    intro: {
      easy: "A state machine is a list of moods your project can be in, and rules for when it switches mood.",
      medium: "A finite state machine models behavior as named states with transitions triggered by events or timers.",
      hard: "Implement FSMs with an enum, a switch on current state, entry actions, and millis()-based non-blocking timing for deterministic, testable control.",
    },
    sections: [
      { title: "Name the states", body: "A rover might have DRIVING, OBSTACLE, TURNING, STOPPED.", analogy: "Traffic lights: green, yellow, red." },
      { title: "Define transitions", body: "DRIVING → OBSTACLE when distance < 20cm. OBSTACLE → TURNING after stopping. TURNING → DRIVING after 600ms." },
      { title: "Use millis(), not delay()", body: "Store when a state started; compare millis() − start to the duration. The loop keeps running and stays responsive." },
      { title: "One switch statement", body: "switch(state) { case DRIVING: ... } — each case does its job and decides the next state." },
    ],
    keyTerms: [
      { term: "State", meaning: "A mode the system is in." },
      { term: "Transition", meaning: "A rule that changes the state." },
      { term: "Non-blocking", meaning: "Code that never waits idle." },
    ],
    safety: "Always include a safe STOPPED state that motors enter on errors or lost sensor readings.",
    quiz: [
      q("Why prefer millis() timing?", ["It keeps the loop responsive", "It uses less flash", "It's required"], 0, "delay() blocks everything else."),
      q("What triggers a transition?", ["An event or timer", "Random chance", "Power-off only"], 0, "Transitions are rule-based."),
      q("A good fallback state for a robot?", ["STOPPED", "FULL_SPEED"], 0, "Fail safe by stopping motors."),
    ],
    projects: ["obstacle-rover"],
  },
  {
    id: "e-sleep",
    title: "Low-power sleep design",
    summary: "Run for months on batteries by sleeping between tasks.",
    intro: {
      easy: "If your project naps between jobs, its battery lasts much longer.",
      medium: "Sleep modes switch off most of the chip between tasks, cutting average current from tens of mA to µA.",
      hard: "Average current = (I_active × t_active + I_sleep × t_sleep) ÷ period. Minimize wake time, quiescent current of regulators, and leakage through dividers and LEDs.",
    },
    sections: [
      { title: "Duty cycling", body: "Wake, measure, send, sleep. Active 2s at 80mA, sleeping 298s at 10µA ≈ 0.54mA average.", analogy: "A guard who only checks the door every five minutes." },
      { title: "ESP32 deep sleep", body: "esp_sleep_enable_timer_wakeup(us); esp_deep_sleep_start(); RAM is lost — use RTC memory for counters." },
      { title: "Hidden drains", body: "Power LEDs, USB-serial chips, and linear regulators can waste mA. Dev boards rarely reach datasheet sleep figures." },
      { title: "Switch sensors off", body: "Power sensors from a GPIO or a MOSFET so they draw nothing while sleeping." },
    ],
    keyTerms: [
      { term: "Deep sleep", meaning: "Lowest-power mode, most of chip off." },
      { term: "Quiescent current", meaning: "Current a regulator uses idle." },
      { term: "Wake source", meaning: "Timer or pin that wakes the chip." },
    ],
    safety: "Use protected lithium cells and a proper charger; never leave charging batteries unattended.",
    quiz: [
      q("What's lost in ESP32 deep sleep?", ["Normal RAM", "Flash", "RTC memory"], 0, "Normal RAM is powered off; RTC memory survives."),
      q("Biggest win for battery life?", ["Shorter wake time", "Brighter LED", "Faster clock always"], 0, "Average current is dominated by active time."),
      q("Why might a dev board sleep at 10mA?", ["Power LED & regulator drain", "Bad code only", "It can't sleep"], 0, "On-board parts draw current regardless."),
    ],
    projects: ["weather-logger"],
  },
];

export const tracks: Track[] = [
  { id: "beginner", label: "Start here", title: "Beginner electronics", description: "Small wins that make circuits feel clear, safe, and friendly.", lessons: beginner },
  { id: "expert", label: "Go deeper", title: "Expert systems", description: "Engineering habits for reliable, expandable, real-world builds.", lessons: expert },
];

export const allLessons: Lesson[] = tracks.flatMap((t) => t.lessons);
