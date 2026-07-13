import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/gerador-contrato" },
  title: "Gerador de Contrato Online Grátis",
  description:
    "Gere modelos de contrato de prestacao de servico prontos para usar. Preencha os dados e baixe em PDF. Gratuito e sem cadastro.",
  keywords: [
    "gerador de contrato",
    "modelo de contrato",
    "contrato de prestacao de servico",
    "contrato simples",
    "contrato online",
    "modelo contrato gratis",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
