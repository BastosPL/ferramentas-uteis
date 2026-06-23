import Link from "next/link";
import { getArticle, allArticles } from "../../../lib/articles";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  // Get other articles for "read more" section (exclude current)
  const otherArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{article.title}</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
              {article.category}
            </span>
            <span className="text-sm text-gray-400">
              {article.readTime} de leitura
            </span>
            <span className="text-sm text-gray-400">
              {new Date(article.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-strong:text-gray-900
            prose-ul:my-4 prose-ul:space-y-1
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA - Related Tools */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Ferramentas relacionadas
          </h3>
          <p className="text-gray-600 mb-4">
            Experimente nossas ferramentas gratuitas mencionadas neste artigo:
          </p>
          <div className="flex flex-wrap gap-3">
            {article.relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                {tool.name} →
              </Link>
            ))}
          </div>
        </div>
      </article>

      {/* More Articles */}
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Outros artigos
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {otherArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <span className="text-xs font-semibold text-blue-600 mb-2 block">
                {a.category}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                {a.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Back links */}
      <div className="mt-12 text-center flex justify-center gap-6">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          ← Todos os artigos
        </Link>
        <Link
          href="/"
          className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
        >
          Ir para as ferramentas
        </Link>
      </div>
    </div>
  );
}
