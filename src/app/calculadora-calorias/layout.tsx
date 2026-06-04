import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Calorias Diarias Online Gratis",
  description:
    "Calcule quantas calorias voce precisa por dia para emagrecer, manter ou ganhar peso. Baseada na formula de Harris-Benedict. Gratuita e sem cadastro.",
  keywords: [
    "calculadora de calorias",
    "quantas calorias por dia",
    "calorias para emagrecer",
    "taxa metabolica basal",
    "tmb",
    "gasto calorico",
    "dieta calorias",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
