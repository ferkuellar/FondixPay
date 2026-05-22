export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

export function statusTone(value: string | null | undefined): StatusTone {
  const status = (value ?? "").toLowerCase();
  if (["success", "succeeded", "generated", "confirmed", "resolved"].includes(status)) {
    return "success";
  }
  if (["pending", "open", "assigned", "investigating", "waiting_provider", "waiting_user", "timeout"].includes(status)) {
    return "warning";
  }
  if (["failed", "unavailable", "closed", "urgent"].includes(status)) {
    return "danger";
  }
  if (["manual_review_required", "not_implemented", "escalated"].includes(status)) {
    return "info";
  }
  return "neutral";
}
