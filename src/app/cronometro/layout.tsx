import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/cronometro" },
  title: "Cronometro Online Gratis",
  description:
    "Cronometro online gratuito com contagem progressiva e regressiva. Timer preciso com funcao de voltas. Sem instalacao, funciona no navegador.",
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
