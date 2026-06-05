import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador e Conversor de Cores Online Gratis",
  description:
    "Gere e converta cores entre HEX, RGB, HSL. Color picker visual, paletas aleatorias e copie codigos com um clique. Gratuito para designers e devs.",
  keywords: [
    "gerador de cores",
    "conversor de cores",
    "hex para rgb",
    "rgb para hex",
    "color picker",
    "paleta de cores",
    "cores para site",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
