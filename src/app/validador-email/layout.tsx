import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/validador-email" },
  title: "Validador de Email Online Gratis",
  description:
    "Verifique se um endereco de email tem formato valido. Validacao de sintaxe, dominio e sugestoes de correcao. Gratuito e sem cadastro.",
  keywords: [
    "validador de email",
    "verificar email",
    "email valido",
    "validar email online",
    "checar email",
    "formato de email",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
