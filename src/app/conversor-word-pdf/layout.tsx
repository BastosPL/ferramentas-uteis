import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/conversor-word-pdf" },
  title: "Conversor Word para PDF e PDF para Word Online Gratis",
  description:
    "Converta arquivos Word (DOCX) para PDF e PDF para Word online e gratis. 100% privado, nenhum arquivo e enviado para servidores. Funciona direto no navegador.",
  keywords:
    "word para pdf,pdf para word,converter docx pdf,converter pdf docx,conversor word pdf gratis,docx to pdf online",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
