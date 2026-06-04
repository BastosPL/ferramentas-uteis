import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversor de Unidades Online Gratis",
  description:
    "Converta unidades de comprimento, peso, temperatura, volume, area e velocidade. Conversor rapido, preciso e gratuito.",
  keywords: [
    "conversor de unidades",
    "converter metros",
    "converter quilos",
    "celsius para fahrenheit",
    "converter litros",
    "converter milhas",
    "conversor online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
