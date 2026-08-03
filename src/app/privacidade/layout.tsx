import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacidade" },
  title: "Politica de Privacidade — FerramentaUtil",
  description:
    "Politica de Privacidade do FerramentaUtil. Saiba como protegemos seus dados. A maioria das ferramentas processa os dados diretamente no navegador. Algumas consultas utilizam servicos externos, conforme detalhado nesta Politica de Privacidade.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
