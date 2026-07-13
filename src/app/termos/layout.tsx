import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/termos" },
  title: "Termos de Uso — FerramentaUtil",
  description:
    "Termos de Uso do FerramentaUtil. Regras de utilizacao das ferramentas online gratuitas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
