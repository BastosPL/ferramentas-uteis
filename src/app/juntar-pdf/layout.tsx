import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/juntar-pdf" },
  title: "Juntar PDF e Converter Imagens para PDF Online Gratis",
  description:
    "Junte varios PDFs em um so ou converta imagens JPG e PNG para PDF. 100% gratis, sem upload para servidores. Processamento local no navegador.",
  keywords: [
    "juntar pdf",
    "combinar pdf",
    "unir pdf",
    "merge pdf",
    "imagem para pdf",
    "converter jpg para pdf",
    "converter png para pdf",
    "juntar arquivos pdf",
    "foto para pdf",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
