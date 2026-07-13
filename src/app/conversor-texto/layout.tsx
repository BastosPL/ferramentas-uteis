import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/conversor-texto" },
  title: "Conversor de Texto Online Grátis",
  description:
    "Converta textos para maiusculas, minusculas, titulo, frase e mais. Remova acentos, conte palavras e copie com um clique. Gratuito e sem cadastro.",
  keywords: [
    "conversor de texto",
    "texto maiusculo",
    "texto minusculo",
    "remover acentos",
    "converter texto online",
    "maiusculas e minusculas",
    "transformar texto",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
