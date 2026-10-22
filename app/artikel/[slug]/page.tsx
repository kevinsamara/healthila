import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, ArticleCover } from "@/components/ArticleCard";
import { categoryTone, getArticle, getArticles } from "@/lib/articles";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/artikel/[slug]">): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  return a
    ? { title: a.title, description: a.excerpt, openGraph: { type: "article" } }
    : { title: "Artikel tidak ditemukan", alternates: { canonical: null } };
}

export default async function ArticlePage({
  params,
}: PageProps<"/artikel/[slug]">) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const others = (await getArticles())
    .filter((x) => x.slug !== a.slug)
    .slice(0, 2);

  return (
    <article>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <nav className="text-sm text-muted">
          <Link href="/artikel" className="hover:text-leaf-700">
            Artikel
          </Link>{" "}
          / <span className={categoryTone(a.category)}>{a.category}</span>
        </nav>
        <h1 className="mt-4 text-4xl leading-tight font-extrabold text-ink sm:text-5xl">
          {a.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {new Date(a.date + "T00:00").toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {a.readMinutes} menit baca
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl px-4">
        <ArticleCover article={a} className="aspect-[21/9] rounded-3xl" />
      </div>

      <div className="prose-healthila mx-auto max-w-3xl px-4 py-10 text-lg">
        <p className="text-ink!">{a.excerpt}</p>
        {a.body.map((block, i) =>
          block.startsWith("## ") ? (
            <h2 key={i}>{block.slice(3)}</h2>
          ) : block.startsWith("- ") ? (
            <ul key={i}>
              {block.split("\n").map((li) => (
                <li key={li}>{li.replace(/^- /, "")}</li>
              ))}
            </ul>
          ) : (
            <p key={i}>{block}</p>
          ),
        )}
        {a.related && (
          <div className="not-prose mt-10">
            <Link
              href={a.related.href}
              className="inline-flex h-12 items-center rounded-full bg-leaf-700 px-6 text-base font-bold text-white hover:bg-leaf-900"
            >
              {a.related.label} →
            </Link>
          </div>
        )}
      </div>

      {others.length > 0 && (
        <section className="bg-leaf-50">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="text-3xl font-extrabold text-ink">Baca juga</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {others.map((o) => (
                <ArticleCard key={o.slug} article={o} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
