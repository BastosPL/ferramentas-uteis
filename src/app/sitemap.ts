import type { MetadataRoute } from "next";

const BASE_URL = "https://ferramentautil.com.br";

const tools = [
  "", "calculadora-juros-compostos", "gerador-de-senha", "contador-de-caracteres",
  "conversor-de-unidades", "calculadora-imc", "calculadora-porcentagem", "cronometro",
  "calculadora-combustivel", "gerador-qr-code", "calculadora-rescisao", "gerador-cpf-cnpj",
  "calculadora-calorias", "juntar-pdf", "imagem-para-pdf", "gerador-lorem-ipsum",
  "calculadora-financiamento", "conversor-moedas", "gerador-cores",
  "calculadora-idade", "conversor-texto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return tools.map((slug) => ({
    url: slug ? `${BASE_URL}/${slug}` : BASE_URL,
    lastModified: new Date(),
    changeFrequency: slug ? "monthly" as const : "weekly" as const,
    priority: slug ? 0.9 : 1,
  }));
}
