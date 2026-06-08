import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de QR Code PIX Online Gratis — Copia e Cola",
  description:
    "Gere QR Code PIX para receber pagamentos. Crie codigo PIX copia e cola com chave, valor e descricao. 100% gratis e instantaneo.",
  keywords:
    "gerador pix,qr code pix,pix copia e cola,gerar pix,pix gratis,codigo pix,receber pix",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
