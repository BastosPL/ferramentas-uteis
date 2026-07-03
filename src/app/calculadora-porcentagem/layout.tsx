import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-porcentagem" },
  title: "Calculadora de Porcentagem Online Gratis",
  description:
    "Calcule porcentagens de forma rapida: quanto e X% de Y, aumento percentual, desconto, diferenca entre valores. Calculadora gratuita e sem cadastro.",
  keywords: [
    "calculadora de porcentagem",
    "calcular porcentagem",
    "porcentagem online",
    "calcular desconto",
    "aumento percentual",
    "quanto e x por cento",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
