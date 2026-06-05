import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversor de Moedas Online Gratis - Cotacao em Tempo Real",
  description:
    "Converta moedas com cotacao atualizada: Dolar, Euro, Libra, Bitcoin e mais. Conversor gratuito com taxas do Banco Central.",
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
