import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/contato" },
  title: "Fale Conosco — FerramentasUteis",
  description:
    "Entre em contato com o FerramentasUteis. Envie sugestoes de ferramentas, reporte problemas ou tire duvidas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
