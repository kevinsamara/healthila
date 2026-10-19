import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Artikel Edukasi",
  description: "Cerita & tips hidup sehat dari Healthila: manfaat buah, jus cold-pressed, dan ide hadiah sehat.",
};

export default function ArtikelPage() {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <section className="bg-leaf-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold text-leaf-900 sm:text-6xl">Artikel Edukasi</h1>
          <p className="mt-3 text-lg text-muted italic">Cerita & tips, supaya hidup sehat gak ribet</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </>
  );
}
