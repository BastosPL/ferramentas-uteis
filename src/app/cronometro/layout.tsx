import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/cronometro" },
  title: "Cronômetro Online Grátis",
  description:
    "Cronômetro online gratuito com contagem progressiva e regressiva. Timer preciso com função de voltas. Sem instalação, funciona no navegador.",
  keywords: [
    "cronometro online",
    "timer online",
    "cronometro gratis",
    "contagem regressiva",
    "temporizador",
    "stopwatch",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
