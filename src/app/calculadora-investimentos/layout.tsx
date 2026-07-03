import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/calculadora-investimentos" },
  title: "Calculadora de Investimentos Online Gratis — CDB, LCI, LCA, Tesouro Direto",
  description:
    "Simule investimentos em CDB, LCI, LCA e Tesouro Direto. Compare rentabilidades liquidas com desconto de IR. Calculadora gratis e sem cadastro.",
  keywords:
    "calculadora investimentos,simulador cdb,simulador lci,simulador lca,tesouro direto,rendimento cdb,investimento renda fixa",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
