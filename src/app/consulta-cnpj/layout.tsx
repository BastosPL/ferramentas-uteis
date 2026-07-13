import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/consulta-cnpj" },
  title: "Consulta CNPJ Grátis - Receita Federal | Dados Completos da Empresa",
  description:
    "Consulte CNPJ gratis com dados da Receita Federal: razao social, situacao cadastral, CNAE, endereco, socios e capital social. Validador de CNPJ e Inscricao Estadual.",
  keywords:
    "consulta cnpj,consultar cnpj,receita federal cnpj,situacao cadastral,cnpj empresa,validar cnpj,inscricao estadual,consulta cnpj gratis",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
