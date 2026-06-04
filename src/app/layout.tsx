import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ferramentas Online Gratis - Calculadoras, Geradores e Conversores",
    template: "%s | Ferramentas Online Gratis",
  },
  description:
    "Ferramentas online gratuitas: calculadoras, geradores de senha, contador de caracteres, conversor de unidades e muito mais. Sem cadastro, sem instalacao.",
  keywords: [
    "ferramentas online",
    "calculadora online",
    "gerador de senha",
    "contador de caracteres",
    "conversor de unidades",
    "calculadora de juros compostos",
    "calculadora IMC",
    "ferramentas gratuitas",
  ],
  openGraph: {
    title: "Ferramentas Online Gratis",
    description:
      "Calculadoras, geradores e conversores online gratuitos. Use direto no navegador.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7284698282537450"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-[family-name:var(--font-inter)]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              🔧 FerramentasUteis
            </Link>
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/calculadora-juros-compostos" className="hover:text-blue-600 transition-colors">
                Juros Compostos
              </Link>
              <Link href="/gerador-de-senha" className="hover:text-blue-600 transition-colors">
                Gerador de Senha
              </Link>
              <Link href="/contador-de-caracteres" className="hover:text-blue-600 transition-colors">
                Contador de Caracteres
              </Link>
              <Link href="/conversor-de-unidades" className="hover:text-blue-600 transition-colors">
                Conversor de Unidades
              </Link>
              <Link href="/calculadora-imc" className="hover:text-blue-600 transition-colors">
                Calculadora IMC
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2 text-sm">Calculadoras</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/calculadora-juros-compostos" className="hover:text-blue-600">Juros Compostos</Link></li>
                  <li><Link href="/calculadora-imc" className="hover:text-blue-600">IMC</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Geradores</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/gerador-de-senha" className="hover:text-blue-600">Gerador de Senha</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Conversores</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/conversor-de-unidades" className="hover:text-blue-600">Conversor de Unidades</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Texto</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/contador-de-caracteres" className="hover:text-blue-600">Contador de Caracteres</Link></li>
                </ul>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400">
              Ferramentas Online Gratis &copy; {new Date().getFullYear()} &mdash; Todas as ferramentas funcionam direto no navegador. Nenhum dado e enviado para servidores.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
