export function LoadingState({ label = "Cargando datos operativos..." }: { label?: string }) {
  return <div className="state state-loading">{label}</div>;
}
