import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Senha Segura Online Gratis",
  description:
    "Gere senhas fortes e aleatorias com criptografia do navegador. Escolha tamanho, maiusculas, numeros e simbolos. 100% gratis e privado.",
  keywords: [
    "gerador de senha",
    "senha segura",
    "senha forte",
    "gerar senha aleatoria",
    "password generator",
    "criar senha",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
