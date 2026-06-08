import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — FerramentasUteis",
  description:
    "Termos de Uso do FerramentasUteis. Regras de utilizacao das ferramentas online gratuitas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
