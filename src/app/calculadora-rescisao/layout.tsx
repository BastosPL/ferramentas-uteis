import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Rescisao Trabalhista Online Gratis",
  description:
    "Calcule o valor da sua rescisao trabalhista: saldo de salario, ferias proporcionais, 13o proporcional, aviso previo e multa do FGTS. Gratuito e sem cadastro.",
  keywords: [
    "calculadora rescisao",
    "rescisao trabalhista",
    "calcular rescisao",
    "saldo de salario",
    "ferias proporcionais",
    "multa fgts",
    "aviso previo",
    "13 proporcional",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
