import type { ReactNode } from "react";

export function RedactedValue({ children, label = "Valor seguro" }: { children: ReactNode; label?: string }) {
  return (
    <span className="redacted-value" title={label}>
      {children}
    </span>
  );
}
