import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/compressor-imagem" },
  title: "Compressor de Imagem Online Grátis — Reduzir JPG, PNG, WebP",
  description:
    "Comprima imagens JPG, PNG e WebP online e gratis. Ajuste o nivel de compressao e reduza o tamanho dos arquivos com controle de qualidade. 100% privado, nenhum arquivo e enviado para servidores.",
  keywords:
    "compressor de imagem,comprimir imagem,reduzir tamanho imagem,comprimir jpg,comprimir png,otimizar imagem,compactar foto",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
