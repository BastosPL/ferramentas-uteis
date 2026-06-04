import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de CPF e CNPJ para Testes Online Gratis",
  description:
    "Gere CPFs e CNPJs validos para testes de software e desenvolvimento. Numeros ficticios com digitos verificadores corretos. Gratuito e sem cadastro.",
  keywords: [
    "gerador de cpf",
    "gerador de cnpj",
    "cpf para teste",
    "cnpj para teste",
    "gerar cpf valido",
    "cpf ficticio",
    "validar cpf",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
