import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { allArticles } from "../../lib/articles";

const categoryColors: Record<string, string> = {
  Financas: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Seguranca: "bg-red-50 text-red-700 border border-red-200",
  Saude: "bg-violet-50 text-violet-700 border border-violet-200",
  Negocios: "bg-blue-50 text-blue-700 border border-blue-200",
  Tecnologia: "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 mb-12 text-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[360px] opacity-[0.07]">
          <Image src="/logo-full.png" alt="" width={800} height={450} className="w-full h-auto" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Artigos e Guias
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Dicas pr&aacute;ticas, guias completos e artigos educativos sobre finan&ccedil;as,
            seguran&ccedil;a digital, sa&uacute;de e tecnologia.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  categoryColors[article.category] || "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
              {article.title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              {article.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {new Date(article.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                Ler artigo
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Back to tools */}
      <section className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para as ferramentas
        </Link>
      </section>
    </div>
  );
}
