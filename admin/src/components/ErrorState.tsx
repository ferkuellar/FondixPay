export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <section className="state state-error" role="alert">
      <strong>{title}</strong>
      <p>{message}</p>
    </section>
  );
}
