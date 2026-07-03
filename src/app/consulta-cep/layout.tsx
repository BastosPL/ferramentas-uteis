import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulta CEP Grátis - Endereço Completo por CEP | FerramentaUtil",
  description:
    "Consulte qualquer CEP do Brasil gratuitamente. Encontre endereço completo, bairro, cidade e estado. Busque também o CEP pelo nome da rua. Rápido e gratuito.",
  keywords:
    "consulta cep,buscar cep,cep correios,encontrar cep,cep por endereco,consulta cep gratis,cep brasil,busca cep online",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
