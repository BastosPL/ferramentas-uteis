import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contador de Caracteres e Palavras Online Gratis",
  description:
    "Conte caracteres, palavras, frases e paragrafos. Verifique limites do Twitter, Instagram, SEO e mais. Gratuito e sem cadastro.",
  keywords: [
    "contador de caracteres",
    "contador de palavras",
    "contar caracteres",
    "contar palavras",
    "limite twitter",
    "meta description tamanho",
    "contador de texto",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
