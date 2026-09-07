export type SafetyDecision = {
  blocked: boolean;
  reason?: string;
  saferAlternative?: string;
};

const unsafePatterns = [
  /\b(?:bomb|explosive|detonator|detonate|grenade|mine|napalm|incendiary)\b/i,
  /\b(?:firearm|gun|rifle|pistol|ghost gun|weapon|missile|warhead)\b/i,
  /\b(?:poison|toxin|nerve agent|bioweapon|drug synthesis|methamphetamine|fentanyl)\b/i,
  /\b(?:malware|ransomware|keylogger|credential theft|botnet|payload)\b/i,
  /\b(?:radio jammer|wifi jammer|cell jammer|bypass (?:a )?(?:lock|alarm|meter|immobilizer))\b/i,
  /\b(?:stalk|spy on|track (?:a|another|someone else's) person|hidden camera)\b/i,
  /\b(?:mains hack|high voltage weapon|electrocute|incapacitate)\b/i,
  /\b(?:sexual exploitation|child sexual|hateful attack)\b/i,
];

const unsafeReason = "I can’t help build weapons, harmful devices, illegal tools, or systems used to harm or target people.";

export function checkSafety(input: string): SafetyDecision {
  const text = input.trim();
  if (unsafePatterns.some((pattern) => pattern.test(text))) {
    return {
      blocked: true,
      reason: unsafeReason,
      saferAlternative: "Try a safe project such as a distance sensor, plant monitor, or enclosed LED alarm for your own workspace.",
    };
  }
  return { blocked: false };
}

export function safeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

export function safeLanguage(value: unknown): string {
  const language = safeString(value, 40);
  return language ?? "en";
}

export function refusalPayload(decision: SafetyDecision) {
  return {
    refused: true,
    reason: decision.reason ?? unsafeReason,
    saferAlternative: decision.saferAlternative,
  };
}