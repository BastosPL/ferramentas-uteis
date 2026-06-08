import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o FerramentasUteis — Quem Somos",
  description:
    "Conheca o FerramentasUteis: portal brasileiro de ferramentas online 100% gratuitas. Calculadoras, geradores e conversores que funcionam direto no navegador.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
