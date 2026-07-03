import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-combustivel" },
  title: "Calculadora Alcool ou Gasolina Online Gratis",
  description:
    "Descubra se vale mais a pena abastecer com alcool ou gasolina. Calculadora baseada na regra dos 70%. Gratuita e sem cadastro.",
  keywords: [
    "alcool ou gasolina",
    "calculadora combustivel",
    "vale a pena alcool",
    "etanol ou gasolina",
    "comparar combustivel",
    "regra dos 70",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
