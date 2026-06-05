import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Financiamento Online Gratis",
  description:
    "Simule financiamentos com tabela SAC e Price. Calcule parcelas, juros totais e amortizacao. Ideal para imoveis, veiculos e emprestimos. Gratuito.",
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
