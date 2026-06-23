import Link from "next/link";
import { allArticles } from "../../lib/articles";

const categoryColors: Record<string, string> = {
  Financas: "bg-green-100 text-green-700",
  Seguranca: "bg-red-100 text-red-700",
  Saude: "bg-purple-100 text-purple-700",
  Negocios: "bg-blue-100 text-blue-700",
  Tecnologia: "bg-orange-100 text-orange-700",
};

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 mb-12 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span>📚</span> Artigos e Guias
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Blog
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Dicas praticas, guias completos e artigos educativos sobre financas,
            seguranca digital, saude e tecnologia.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  categoryColors[article.category] || "bg-gray-100 text-gray-700"
                }`}
              >
                {article.category}
              </span>
              <span className="text-xs text-gray-400">{article.readTime} de leitura</span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
              {article.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              {article.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {new Date(article.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm font-medium text-blue-600 group-hover:underline">
                Ler artigo →
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
          ← Voltar para as ferramentas
        </Link>
      </section>
    </div>
  );
}
