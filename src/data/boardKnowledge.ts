export interface BoardKnowledgeEntry {
  label: string;
  overview: string;
  pins: Array<{ group: string; pins: string; purpose: string; caution?: string }>;
  components: Array<{ name: string; job: string; use: string; caution?: string }>;
  examples: Array<{ title: string; parts: string[]; wiring: string[]; code?: string; note?: string }>;
}

export const boardKnowledge: Record<string, BoardKnowledgeEntry> = {
  Arduino: {
    label: "Arduino Uno",
    overview: "A friendly 5V board for learning inputs, outputs, and simple control.",
    pins: [
      { group: "Power", pins: "5V, 3.3V, GND, VIN", purpose: "5V and 3.3V supply small circuits; GND is the return path; VIN is for a suitable external supply.", caution: "Never connect 5V to a 3.3V-only part. Do not feed power into 5V and VIN at the same time." },
      { group: "Digital", pins: "D0–D13", purpose: "Read HIGH/LOW signals or switch small loads on and off. D0 and D1 are also used for USB serial.", caution: "Do not connect motors directly to a pin. Use a driver and a suitable separate supply." },
      { group: "Analog input", pins: "A0–A5", purpose: "Measure changing voltages, such as a potentiometer or light sensor. A4/A5 also share I²C." },
      { group: "PWM", pins: "D3, D5, D6, D9, D10, D11", purpose: "Create a fast on/off signal for dimming LEDs or controlling a compatible driver. These are marked ~." },
      { group: "Communication", pins: "UART: D0/D1 · I²C: A4/A5 · SPI: D10–D13", purpose: "Share data with sensors, displays, and other boards." },
    ],
    components: [
      { name: "Resistor", job: "Limits current or divides voltage; it has no positive or negative leg.", use: "Put it in series with an LED. For a 5V Uno, a red LED, and about 10mA: (5V − 2V) ÷ 0.01A = 300Ω, so a common 330Ω resistor is a safe starting choice.", caution: "A resistor does not have polarity. Do not use it alone to make 5V safe for every 3.3V input; choose a proper divider or level shifter." },
      { name: "LED", job: "Makes light when current flows the correct way.", use: "Long leg is usually anode (+); short leg / flat edge is cathode (−). Add a series resistor, then connect to a pin and GND." },
      { name: "Push button", job: "Lets a person make an input change.", use: "Connect between a digital input and GND, then enable the board's internal pull-up in code." },
      { name: "Sensor", job: "Measures something, such as light, temperature, or distance.", use: "Check its supply voltage and signal type first. Connect power, GND, and its output or data pins." },
      { name: "Buzzer", job: "Makes a tone or beep.", use: "Check whether it is an active or passive buzzer and whether the pin can safely drive it; use a transistor for higher current." },
    ],
    examples: [
      { title: "Blink a protected LED", parts: ["Arduino Uno", "LED", "330Ω resistor", "jumper wires"], wiring: ["D9 → 330Ω resistor → LED long leg", "LED short leg → GND"], code: "const int ledPin = 9;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(500);\n  digitalWrite(ledPin, LOW);\n  delay(500);\n}", note: "Resistor band example: orange-orange-brown-gold = 330Ω ±5%. A ¼W resistor is ample for this example." },
      { title: "Read a button", parts: ["Arduino Uno", "push button", "jumper wires"], wiring: ["Button between D2 and GND", "Use INPUT_PULLUP; no external resistor is needed for this simple input."], code: "const int buttonPin = 2;\n\nvoid setup() {\n  pinMode(buttonPin, INPUT_PULLUP);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  Serial.println(digitalRead(buttonPin) == LOW ? \"Pressed\" : \"Released\");\n  delay(50);\n}" },
    ],
  },
  ESP32: {
    label: "ESP32 development board",
    overview: "A 3.3V microcontroller family with Wi-Fi and Bluetooth. Pin labels and capabilities vary by board.",
    pins: [
      { group: "Power", pins: "3V3, GND, USB/5V or VIN (board-dependent)", purpose: "3V3 supplies compatible sensors; GND completes the circuit.", caution: "ESP32 GPIO is 3.3V logic and is generally not 5V tolerant. Confirm your exact board's power-pin rules." },
      { group: "Digital GPIO", pins: "GPIO numbers printed on your board", purpose: "Read buttons and control simple logic-level signals.", caution: "Some pins affect boot, are input-only, or are used by flash. Check the exact board pinout before wiring." },
      { group: "ADC", pins: "ADC-capable GPIO (varies by chip/board)", purpose: "Read analog sensor voltages within the chip's permitted range." },
      { group: "Communication", pins: "I²C, SPI, UART pins are often configurable", purpose: "Connect displays, sensors, and serial devices; use the pin assignments for your exact board and code." },
    ],
    components: [
      { name: "Resistor", job: "Limits current; it has no polarity.", use: "For a 3.3V GPIO driving a red LED (about 2V) at roughly 6mA: (3.3V − 2V) ÷ 0.006A ≈ 217Ω. A common 220Ω or 330Ω series resistor is a reasonable starting point; confirm the LED and board limits.", caution: "Do not use a resistor as a blanket guarantee that a 5V signal is safe. Use a level shifter or a properly calculated divider where needed." },
      { name: "LED", job: "Emits light when connected in the correct direction.", use: "Long leg usually goes toward GPIO through a series resistor; short leg goes to GND. Use a low current and check GPIO limits." },
      { name: "Push button", job: "Provides a manual digital input.", use: "Connect between a safe GPIO and GND; configure a pull-up in code. Avoid boot-strapping pins unless you understand their startup behavior." },
      { name: "Sensor", job: "Measures the world and sends a signal.", use: "Check supply voltage and output voltage; a 5V sensor output can damage a 3.3V GPIO." },
      { name: "Buzzer", job: "Makes a beep or tone.", use: "Use a compatible low-current buzzer or a transistor driver. Never exceed the GPIO current rating." },
    ],
    examples: [
      { title: "Blink an LED (check your board pinout)", parts: ["ESP32 development board", "LED", "330Ω resistor"], wiring: ["A known safe output GPIO → 330Ω resistor → LED long leg", "LED short leg → GND"], code: "const int ledPin = 2; // Change to a safe output pin on your board\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(500);\n  digitalWrite(ledPin, LOW);\n  delay(500);\n}", note: "GPIO2 is common on some boards but not universal. Verify its role before connecting anything." },
      { title: "Read a button", parts: ["ESP32 board", "push button", "jumper wires"], wiring: ["Button between a safe GPIO (example: GPIO18) and GND", "Enable an internal pull-up; confirm the selected pin supports it."], code: "const int buttonPin = 18; // Verify for your board\n\nvoid setup() {\n  pinMode(buttonPin, INPUT_PULLUP);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  Serial.println(digitalRead(buttonPin) == LOW ? \"Pressed\" : \"Released\");\n  delay(50);\n}", note: "Use only 3.3V-safe signals on ESP32 GPIO." },
    ],
  },
  "Raspberry Pi": {
    label: "Raspberry Pi (40-pin GPIO models)",
    overview: "A small Linux computer. Its GPIO pins use 3.3V logic and are not like the pins on an Arduino.",
    pins: [
      { group: "Power and ground", pins: "Physical pins 1/17: 3V3 · 2/4: 5V · several GND pins", purpose: "Power compatible external circuits and provide a shared ground." },
      { group: "Digital GPIO", pins: "BCM GPIO numbering differs from physical pin numbering", purpose: "Read buttons and control low-current logic signals from a program.", caution: "GPIO is 3.3V only and is not 5V tolerant. Never connect 5V to a GPIO pin." },
      { group: "I²C", pins: "Commonly GPIO2/SDA and GPIO3/SCL", purpose: "Connect compatible I²C sensors and displays. Check the model and pinout." },
      { group: "SPI / UART", pins: "Dedicated alternate-function GPIO pins", purpose: "Communicate with peripherals; avoid pins already needed by other hardware." },
      { group: "Analog input", pins: "No built-in analog inputs on standard GPIO", purpose: "Use a suitable external ADC to read analog sensors." },
    ],
    components: [
      { name: "Resistor", job: "Limits LED current; it has no polarity.", use: "Use a series resistor with every LED. For a 3.3V GPIO and red LED, 330Ω is a conservative beginner example; never drive a load directly if it exceeds GPIO limits.", caution: "Never connect a 5V signal to GPIO. A resistor alone is not always a safe level converter." },
      { name: "LED", job: "Emits light when current flows the correct way.", use: "Long leg usually toward GPIO through a series resistor; short leg to GND. Keep current low." },
      { name: "Push button", job: "Creates a digital input when pressed.", use: "Connect between a GPIO and GND and use an appropriate software pull-up; identify pins by BCM or physical numbering, not interchangeably." },
      { name: "Sensor", job: "Measures values such as temperature or motion.", use: "Check 3.3V compatibility. For analog sensors, add a suitable ADC between the sensor and Pi." },
      { name: "Buzzer", job: "Provides an audible alert.", use: "Use a transistor or driver if the buzzer needs more current than a GPIO can provide." },
    ],
    examples: [
      { title: "Blink an LED with Python", parts: ["40-pin Raspberry Pi", "LED", "330Ω resistor"], wiring: ["BCM GPIO17 (physical pin 11) → 330Ω resistor → LED long leg", "LED short leg → a GND pin (for example, physical pin 6)"], code: "from gpiozero import LED\nfrom time import sleep\n\nled = LED(17)  # BCM numbering\nwhile True:\n    led.on()\n    sleep(0.5)\n    led.off()\n    sleep(0.5)", note: "This example uses the gpiozero library. Confirm your model has a 40-pin header and use BCM numbering in code." },
      { title: "Read a button with Python", parts: ["Raspberry Pi", "push button", "jumper wires"], wiring: ["Button between BCM GPIO2? No — choose a free GPIO such as BCM GPIO27 and GND", "The example enables a software pull-up."], code: "from gpiozero import Button\nfrom signal import pause\n\nbutton = Button(27, pull_up=True)\nbutton.when_pressed = lambda: print(\"Pressed\")\nbutton.when_released = lambda: print(\"Released\")\npause()", note: "Use BCM GPIO numbering in code. Avoid pins used by I²C, SPI, or your other hardware." },
    ],
  },
  STM32: {
    label: "STM32 development board",
    overview: "STM32 boards vary widely. Use the exact board's pinout and voltage limits before connecting parts.",
    pins: [
      { group: "Power", pins: "3V3, GND, and board-specific VIN/5V", purpose: "Supply the board and give circuits a shared return path.", caution: "Many STM32 GPIO pins are 3.3V logic. Do not assume 5V tolerance; check the exact chip and board." },
      { group: "GPIO", pins: "Port and pin labels such as PA0 or PB6", purpose: "Digital inputs and outputs, with alternate functions assigned by the chip." },
      { group: "Analog", pins: "ADC-capable pins listed in the board pinout", purpose: "Measure analog signals that stay within the specified reference and input limits." },
      { group: "Communication", pins: "UART, I²C, SPI pin choices vary by package and board", purpose: "Use the board schematic and firmware pin mapping to identify valid connections." },
    ],
    components: [
      { name: "Resistor", job: "Limits current or sets signal levels; it has no polarity.", use: "For an LED, calculate (GPIO voltage − LED forward voltage) ÷ desired current, then choose the next common value above the result; verify pin current limits.", caution: "Do not assume a GPIO is 5V tolerant. A resistor divider is not a substitute for checking the chip's absolute maximum ratings." },
      { name: "LED", job: "Emits light when current flows in one direction.", use: "Place a current-limiting resistor in series. Long leg is usually anode; short leg / flat edge is usually cathode." },
      { name: "Push button", job: "Creates a human-operated input.", use: "Connect to a configured input and a valid logic level; use an internal pull-up/down or an external resistor as the design requires." },
      { name: "Sensor", job: "Measures a physical value.", use: "Check supply, signal voltage, interface, and pin alternate function for the exact board." },
      { name: "Buzzer", job: "Makes a tone or alert.", use: "Use a driver when current exceeds the GPIO rating; confirm voltage and active/passive type." },
    ],
    examples: [
      { title: "Blink an LED", parts: ["Exact STM32 board", "LED", "series resistor"], wiring: ["A confirmed output pin → calculated series resistor → LED anode", "LED cathode → GND"], note: "Pin names and code depend on the board and development environment. Use its official pinout and starter project; do not copy an Arduino pin number blindly." },
      { title: "Read a button", parts: ["Exact STM32 board", "push button"], wiring: ["Connect the button to a confirmed input and the board's valid logic level", "Set the matching pull-up/down in your firmware."], note: "The correct pin and firmware code depend on the specific STM32 board and framework." },
    ],
  },
};

export const resistorColorGuide = [
  { digit: "0", color: "Black" }, { digit: "1", color: "Brown" }, { digit: "2", color: "Red" },
  { digit: "3", color: "Orange" }, { digit: "4", color: "Yellow" }, { digit: "5", color: "Green" },
  { digit: "6", color: "Blue" }, { digit: "7", color: "Violet" }, { digit: "8", color: "Grey" },
  { digit: "9", color: "White" },
];