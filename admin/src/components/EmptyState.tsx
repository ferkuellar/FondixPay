export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <section className="state">
      <strong>{title}</strong>
      <p>{message}</p>
    </section>
  );
}
