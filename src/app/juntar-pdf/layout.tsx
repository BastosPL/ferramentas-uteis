import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/juntar-pdf" },
  title: "Juntar PDF Online Grátis - Combinar Arquivos PDF",
  description:
    "Junte e combine varios arquivos PDF em um so. 100% gratis, sem upload para servidores. Seus arquivos nunca saem do seu navegador.",
  keywords: [
    "juntar pdf",
    "combinar pdf",
    "unir pdf",
    "merge pdf",
    "juntar arquivos pdf",
    "combinar pdf online",
    "pdf gratis",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
