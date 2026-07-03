import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/imagem-para-pdf" },
  title: "Converter Imagem para PDF Online Gratis",
  description:
    "Converta imagens JPG, PNG e WebP para PDF gratuitamente. Combine varias imagens em um unico PDF. 100% privado, sem upload para servidores.",
  keywords: [
    "imagem para pdf",
    "converter jpg para pdf",
    "converter png para pdf",
    "foto para pdf",
    "imagem pdf online",
    "jpg to pdf",
    "converter imagem",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
