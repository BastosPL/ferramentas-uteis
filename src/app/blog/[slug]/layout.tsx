import type { Metadata } from "next";
import { getArticle, allArticles } from "../../../lib/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: "Artigo nao encontrado" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [article.category.toLowerCase(), "guia", "dicas", "ferramentas online"],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      locale: "pt_BR",
      publishedTime: article.date,
    },
  };
}

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
