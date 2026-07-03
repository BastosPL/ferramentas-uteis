import type { MetadataRoute } from "next";
import { allArticles } from "../lib/articles";

const BASE_URL = "https://ferramentautil.com.br";

const tools = [
  "", "calculadora-juros-compostos", "gerador-de-senha", "contador-de-caracteres",
  "conversor-de-unidades", "calculadora-imc", "calculadora-porcentagem", "cronometro",
  "calculadora-combustivel", "gerador-qr-code", "calculadora-rescisao", "gerador-cpf-cnpj",
  "calculadora-calorias", "juntar-pdf", "imagem-para-pdf", "gerador-lorem-ipsum",
  "calculadora-financiamento", "conversor-moedas", "gerador-cores",
  "calculadora-idade", "conversor-texto",
  "calculadora-horas", "gerador-contrato", "calculadora-desconto",
  "validador-email", "tabela-medidas",
  "consulta-cnpj",
  "conversor-word-pdf",
  "compressor-imagem",
  "gerador-pix",
  "calculadora-investimentos",
  "consulta-cep",
  "sobre",
  "contato",
  "privacidade",
  "termos",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((slug) => ({
    url: slug ? `${BASE_URL}/${slug}` : BASE_URL,
    lastModified: new Date(),
    changeFrequency: slug ? "monthly" as const : "weekly" as const,
    priority: slug ? 0.9 : 1,
  }));

  const blogIndex = {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  const blogArticles = allArticles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...toolPages, blogIndex, ...blogArticles];
}
