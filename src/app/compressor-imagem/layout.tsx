import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compressor de Imagem Online Gratis — Reduzir JPG, PNG, WebP",
  description:
    "Comprima imagens JPG, PNG e WebP online e gratis. Reduza o tamanho dos arquivos sem perder qualidade. 100% privado, nenhum arquivo e enviado para servidores.",
  keywords:
    "compressor de imagem,comprimir imagem,reduzir tamanho imagem,comprimir jpg,comprimir png,otimizar imagem,compactar foto",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
