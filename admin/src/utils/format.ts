export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "No disponible";
  }
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function formatMoney(minor: number | null | undefined, currency = "MXN"): string {
  if (minor === null || minor === undefined) {
    return "No disponible";
  }
  return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(minor / 100);
}

export function labelize(value: string | null | undefined): string {
  if (!value) {
    return "No disponible";
  }
  return value.replaceAll("_", " ");
}
