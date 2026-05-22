import { labelize } from "../utils/format";
import { statusTone } from "../utils/status";

export function StatusBadge({ value }: { value: string | null | undefined }) {
  return <span className={`status-badge tone-${statusTone(value)}`}>{labelize(value)}</span>;
}
