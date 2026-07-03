import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacidade" },
  title: "Politica de Privacidade — FerramentasUteis",
  description:
    "Politica de Privacidade do FerramentasUteis. Saiba como protegemos seus dados. Todas as ferramentas funcionam 100% no navegador.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
