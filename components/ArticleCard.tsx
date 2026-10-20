import Image from "next/image";
import Link from "next/link";
import { categoryTone, type Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf-900/10"
    >
      <ArticleCover article={article} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6">
        <p className={`text-xs font-bold tracking-widest uppercase ${categoryTone(article.category)}`}>{article.category}</p>
        <h3 className="mt-3 font-display text-xl leading-snug font-bold text-ink group-hover:text-leaf-700">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
        <p className="mt-auto pt-4 text-xs text-muted">{article.readMinutes} menit baca</p>
      </div>
    </Link>
  );
}

export function ArticleCover({ article, className = "" }: { article: Article; className?: string }) {
  if (article.cover.url) {
    return (
      <div className={`relative overflow-hidden bg-leaf-50 ${className}`}>
        <Image
          src={article.cover.url}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${article.cover.gradient} ${className}`}>
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/15" />
      <div className="absolute -right-8 -bottom-12 h-48 w-48 rounded-full bg-white/10" />
      <span className="relative text-7xl drop-shadow-sm transition duration-500 group-hover:scale-110 sm:text-8xl">{article.cover.emoji}</span>
    </div>
  );
}
