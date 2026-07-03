import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-desconto" },
  title: "Calculadora de Desconto Online Gratis",
  description:
    "Calcule descontos em porcentagem sobre qualquer valor. Descubra o preco final com desconto, economia e compare precos. Gratuito e sem cadastro.",
  keywords: [
    "calculadora de desconto",
    "calcular desconto",
    "porcentagem de desconto",
    "preco com desconto",
    "black friday",
    "desconto online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
