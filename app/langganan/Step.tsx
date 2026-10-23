import { Check } from "lucide-react";

export function Step({
  n,
  title,
  done,
  summary,
  onEdit,
  children,
}: {
  n: number;
  title: string;
  done: boolean;
  summary: string | null;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-leaf-100 sm:p-6">
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${done ? "bg-leaf-700 text-white" : "bg-leaf-50 text-leaf-700"}`}>
          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : n}
        </span>
        <h2 className="flex-1 text-lg font-bold text-ink">{title}</h2>
        {done && summary && (
          <>
            <span className="hidden text-sm font-semibold text-leaf-700 sm:inline">{summary}</span>
            {onEdit && (
              <button type="button" onClick={onEdit} className="text-xs text-muted underline hover:text-ink">
                ubah
              </button>
            )}
          </>
        )}
      </div>
      {done && summary && <p className="mt-1 pl-11 text-sm font-semibold text-leaf-700 sm:hidden">{summary}</p>}
      {!done && <div className="mt-4">{children}</div>}
    </section>
  );
}
