import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Link from "next/link";
import ExternalScripts from "./components/ExternalScripts";
import CookieConsent from "./components/CookieConsent";

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
  other: {
    "google-adsense-account": "ca-pub-7284698282537450",
  },
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
    <html lang="pt-BR" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7284698282537450"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-[family-name:var(--font-inter)]" suppressHydrationWarning>
        <ExternalScripts />
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
              <Link href="/blog" className="hover:text-blue-600 transition-colors font-medium">
                Blog
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
                  <li><Link href="/calculadora-porcentagem" className="hover:text-blue-600">Porcentagem</Link></li>
                  <li><Link href="/calculadora-combustivel" className="hover:text-blue-600">Alcool ou Gasolina</Link></li>
                  <li><Link href="/calculadora-rescisao" className="hover:text-blue-600">Rescisao Trabalhista</Link></li>
                  <li><Link href="/calculadora-calorias" className="hover:text-blue-600">Calorias Diarias</Link></li>
                  <li><Link href="/calculadora-financiamento" className="hover:text-blue-600">Financiamento</Link></li>
                  <li><Link href="/calculadora-idade" className="hover:text-blue-600">Idade</Link></li>
                  <li><Link href="/calculadora-horas" className="hover:text-blue-600">Horas</Link></li>
                  <li><Link href="/calculadora-desconto" className="hover:text-blue-600">Desconto</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Geradores</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/gerador-de-senha" className="hover:text-blue-600">Gerador de Senha</Link></li>
                  <li><Link href="/gerador-qr-code" className="hover:text-blue-600">Gerador de QR Code</Link></li>
                  <li><Link href="/gerador-cpf-cnpj" className="hover:text-blue-600">Gerador CPF/CNPJ</Link></li>
                  <li><Link href="/gerador-cores" className="hover:text-blue-600">Gerador de Cores</Link></li>
                  <li><Link href="/gerador-contrato" className="hover:text-blue-600">Gerador de Contrato</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">PDF & Conversores</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/juntar-pdf" className="hover:text-blue-600 font-medium">Juntar PDF</Link></li>
                  <li><Link href="/imagem-para-pdf" className="hover:text-blue-600 font-medium">Imagem para PDF</Link></li>
                  <li><Link href="/conversor-de-unidades" className="hover:text-blue-600">Conversor de Unidades</Link></li>
                  <li><Link href="/conversor-moedas" className="hover:text-blue-600">Conversor de Moedas</Link></li>
                  <li><Link href="/conversor-texto" className="hover:text-blue-600">Conversor de Texto</Link></li>
                  <li><Link href="/conversor-word-pdf" className="hover:text-blue-600 font-medium">Word ⇄ PDF</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Utilidades</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><Link href="/consulta-cnpj" className="hover:text-blue-600 font-medium">Consulta CNPJ</Link></li>
                  <li><Link href="/contador-de-caracteres" className="hover:text-blue-600">Contador de Caracteres</Link></li>
                  <li><Link href="/cronometro" className="hover:text-blue-600">Cronometro Online</Link></li>
                  <li><Link href="/gerador-lorem-ipsum" className="hover:text-blue-600">Lorem Ipsum</Link></li>
                  <li><Link href="/validador-email" className="hover:text-blue-600">Validador de Email</Link></li>
                  <li><Link href="/tabela-medidas" className="hover:text-blue-600">Tabela de Medidas</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
              <Link href="/sobre" className="hover:text-blue-600 transition-colors">Sobre</Link>
              <span className="text-gray-300">|</span>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
              <span className="text-gray-300">|</span>
              <Link href="/contato" className="hover:text-blue-600 transition-colors">Contato</Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacidade" className="hover:text-blue-600 transition-colors">Privacidade</Link>
              <span className="text-gray-300">|</span>
              <Link href="/termos" className="hover:text-blue-600 transition-colors">Termos de Uso</Link>
            </div>
            <p className="text-center text-xs text-gray-400">
              Ferramentas Online Gratis &copy; {new Date().getFullYear()} &mdash; Todas as ferramentas funcionam direto no navegador. Nenhum dado e enviado para servidores.
            </p>
          </div>
        </footer>
        <CookieConsent />
      </body>
    </html>
  );
}
