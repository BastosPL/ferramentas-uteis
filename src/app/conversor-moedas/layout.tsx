import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/conversor-moedas" },
  title: "Conversor de Moedas Online Grátis - Cotação Atualizada",
  description:
    "Converta moedas com cotação atualizada: Dólar, Euro, Libra e mais. Conversor gratuito com taxas de mercado atualizadas.",
  keywords: [
    "conversor de moedas",
    "cotacao dolar",
    "cotacao euro",
    "converter dolar para real",
    "converter euro para real",
    "cambio",
    "moeda hoje",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
