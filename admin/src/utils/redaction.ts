const SENSITIVE_KEYS = ["pan", "cvv", "secret", "token", "raw_payload", "provider_payload"];

export function maskPhone(value: string | null | undefined): string {
  if (!value) {
    return "No disponible";
  }
  return `${"*".repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}`;
}

export function maskEmail(value: string | null | undefined): string {
  if (!value) {
    return "No disponible";
  }
  const [local, domain] = value.split("@");
  if (!domain) {
    return "[REDACTED]";
  }
  return `${local.slice(0, 1)}${"*".repeat(Math.max(local.length - 1, 1))}@${domain}`;
}

export function maskReference(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "No disponible";
  }
  const text = String(value);
  if (text.length <= 4) {
    return "*".repeat(text.length);
  }
  return `${"*".repeat(Math.min(text.length - 4, 8))}${text.slice(-4)}`;
}

export function safeDisplay(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "No disponible";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function detectSensitiveLeak(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }
  return Object.keys(value as Record<string, unknown>).some((key) =>
    SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive)),
  );
}
