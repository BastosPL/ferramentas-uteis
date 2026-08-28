import type { MetadataRoute } from "next";
import { allArticles } from "../lib/articles";

const BASE_URL = "https://ferramentautil.com.br";

const tools = [
  "", "calculadora-juros-compostos", "gerador-de-senha", "contador-de-caracteres",
  "calculadora-imc", "calculadora-porcentagem",
  "calculadora-combustivel", "gerador-qr-code", "calculadora-rescisao", "gerador-cpf-cnpj",
  "calculadora-calorias", "juntar-pdf",
  "calculadora-financiamento", "conversor-moedas",
  "calculadora-idade",
  "calculadora-horas", "gerador-contrato", "calculadora-desconto",
  "tabela-medidas",
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
    changeFrequency: slug ? "monthly" as const : "weekly" as const,
    priority: slug ? 0.9 : 1,
  }));

  const blogIndex = {
    url: `${BASE_URL}/blog`,
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
