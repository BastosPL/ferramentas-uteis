import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-imc" },
  title: "Calculadora de IMC Online Gratis",
  description:
    "Calcule seu Indice de Massa Corporal (IMC) e descubra se esta no peso ideal. Tabela completa de classificacao da OMS. Gratuito e sem cadastro.",
  keywords: [
    "calculadora imc",
    "calcular imc",
    "indice massa corporal",
    "peso ideal",
    "imc online",
    "calculadora peso",
    "tabela imc",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
