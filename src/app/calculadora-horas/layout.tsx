import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Horas Online Gratis",
  description:
    "Some horas trabalhadas, calcule banco de horas e diferenca entre horarios. Ideal para controle de ponto e jornada de trabalho. Gratuito e sem cadastro.",
  keywords: [
    "calculadora de horas",
    "somar horas",
    "banco de horas",
    "calcular horas trabalhadas",
    "controle de ponto",
    "diferenca entre horarios",
    "horas extras",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
