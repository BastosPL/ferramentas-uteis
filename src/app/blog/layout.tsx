import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog - Dicas e Guias sobre Ferramentas Online",
  description:
    "Artigos educativos sobre financas, seguranca digital, saude e tecnologia. Dicas praticas e guias completos em portugues.",
  keywords: [
    "blog ferramentas online",
    "dicas financas",
    "seguranca digital",
    "guia pix",
    "como investir",
    "comprimir imagens",
  ],
  openGraph: {
    title: "Blog - Ferramentas Online Grátis",
    description:
      "Artigos educativos e guias praticos sobre financas, seguranca, saude e tecnologia.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
