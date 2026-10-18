export function ContentPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-leaf-900 sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 text-sm text-muted">Terakhir diperbarui: {updated}</p>}
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
      <div className="prose-healthila mt-6">{children}</div>
    </div>
  );
}
