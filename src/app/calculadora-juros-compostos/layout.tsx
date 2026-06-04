import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Juros Compostos Online Gratis",
  description:
    "Calcule juros compostos com aporte mensal. Simule investimentos e descubra quanto seu dinheiro pode render. Calculadora gratuita, sem cadastro.",
  keywords: [
    "calculadora juros compostos",
    "juros compostos",
    "simulador investimento",
    "calculadora rendimento",
    "juros sobre juros",
    "calculadora poupanca",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
