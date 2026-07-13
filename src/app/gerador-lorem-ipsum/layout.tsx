import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/gerador-lorem-ipsum" },
  title: "Gerador de Lorem Ipsum Online Grátis",
  description:
    "Gere textos Lorem Ipsum para preencher layouts e mockups. Escolha paragrafos, frases ou palavras. Copie com um clique. Gratuito e sem cadastro.",
  keywords: [
    "lorem ipsum",
    "gerador de lorem ipsum",
    "texto placeholder",
    "texto de preenchimento",
    "lorem ipsum generator",
    "dummy text",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
