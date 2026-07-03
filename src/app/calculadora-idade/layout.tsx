import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-idade" },
  title: "Calculadora de Idade Online Gratis",
  description:
    "Calcule sua idade exata em anos, meses e dias. Descubra quantos dias voce ja viveu, seu proximo aniversario e seu signo. Gratuito e sem cadastro.",
  keywords: [
    "calculadora de idade",
    "calcular idade",
    "quantos anos tenho",
    "idade exata",
    "dias vividos",
    "proximo aniversario",
    "calculadora idade online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
