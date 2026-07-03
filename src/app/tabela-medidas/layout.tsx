import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/tabela-medidas" },
  title: "Tabela de Medidas e Conversao de Tamanhos Online",
  description:
    "Converta tamanhos de roupas, calcados e aneis entre Brasil, EUA e Europa. Tabelas completas masculino e feminino. Gratuito e sem cadastro.",
  keywords: [
    "tabela de medidas",
    "tamanho de roupa",
    "conversao de tamanhos",
    "tamanho de sapato",
    "tamanho brasil eua europa",
    "numero de calcado",
    "tabela de tamanhos",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
