import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-financiamento" },
  title: "Calculadora de Financiamento Online Grátis",
  description:
    "Simule financiamentos com tabela SAC e Price. Calcule parcelas, juros totais e amortização. Ideal para imóveis, veículos e empréstimos. Gratuito.",
  keywords: [
    "calculadora financiamento",
    "simular financiamento",
    "tabela sac",
    "tabela price",
    "financiamento imovel",
    "financiamento carro",
    "parcela financiamento",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
