import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/gerador-qr-code" },
  title: "Gerador de QR Code Online Grátis",
  description:
    "Gere QR Codes gratuitamente para URLs, textos, WhatsApp, Wi-Fi e mais. Baixe em PNG. Sem cadastro, sem limites.",
  keywords: [
    "gerador qr code",
    "criar qr code",
    "qr code gratis",
    "gerar qr code online",
    "qr code whatsapp",
    "qr code wifi",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
