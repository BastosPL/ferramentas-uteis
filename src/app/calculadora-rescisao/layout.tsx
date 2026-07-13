import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-rescisao" },
  title: "Calculadora de Rescisão Trabalhista Online Grátis",
  description:
    "Calcule o valor da sua rescisão trabalhista: saldo de salário, férias proporcionais, 13º proporcional, aviso prévio e multa do FGTS. Gratuito e sem cadastro.",
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
