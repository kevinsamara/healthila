import { JsonLd } from "./JsonLd";

/**
 * Local-search copy + FAQ (FAQPage JSON-LD) under a category grid. Keep the
 * text factual — only things Healthila really does (see /garansi, /langganan).
 */
export function SeoBlock({ title, paragraphs, faq }: { title: string; paragraphs: React.ReactNode[]; faq: [string, string][] }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-3xl font-extrabold text-ink">{title}</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h2 className="mt-10 text-2xl font-extrabold text-ink">Pertanyaan yang sering ditanyakan</h2>
        <div className="mt-4 space-y-3">
          {faq.map(([q, a]) => (
            <details key={q} className="rounded-2xl bg-cream p-4 ring-1 ring-leaf-100">
              <summary className="cursor-pointer font-semibold text-ink">{q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }}
        />
      </div>
    </section>
  );
}
