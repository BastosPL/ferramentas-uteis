import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import ExternalScripts from "./components/ExternalScripts";
import CookieConsent from "./components/CookieConsent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ferramentas Online Grátis - Calculadoras, Geradores e Conversores",
    template: "%s | Ferramentas Online Grátis",
  },
  description:
    "Ferramentas online gratuitas: calculadoras financeiras, geradores de senha e QR Code, conversores e consultas. Sem cadastro, sem instalação.",
  keywords: [
    "ferramentas online",
    "calculadora online",
    "gerador de senha",
    "contador de caracteres",
    "consulta cnpj",
    "calculadora de juros compostos",
    "calculadora IMC",
    "ferramentas gratuitas",
  ],
  metadataBase: new URL("https://ferramentautil.com.br"),
  alternates: { canonical: "/" },
  other: {
    "google-adsense-account": "ca-pub-7284698282537450",
  },
  openGraph: {
    title: "Ferramentas Online Grátis",
    description:
      "Calculadoras, geradores e conversores online gratuitos. Use direto no navegador.",
    type: "website",
    locale: "pt_BR",
    siteName: "FerramentaUtil",
    url: "https://ferramentautil.com.br",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferramentas Online Grátis - Calculadoras, Geradores e Conversores",
    description: "Calculadoras, geradores e conversores online gratuitos. Use direto no navegador.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`} suppressHydrationWarning>
      <head />
      <body className="min-h-screen flex flex-col bg-white font-[family-name:var(--font-inter)]" suppressHydrationWarning>
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <Script
          id="adsense-script"
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7284698282537450"
          crossOrigin="anonymous"
        />
        <ExternalScripts />
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Image src="/logo-icon.png" alt="FerramentaUtil" width={32} height={32} className="rounded-lg" />
              <span><span className="text-blue-600">Ferramenta</span><span className="text-slate-900">Util</span></span>
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/calculadora-juros-compostos" className="hover:text-blue-600 transition-colors">
                Juros Compostos
              </Link>
              <Link href="/gerador-de-senha" className="hover:text-blue-600 transition-colors">
                Gerador de Senha
              </Link>
              <Link href="/contador-de-caracteres" className="hover:text-blue-600 transition-colors">
                Contador de Caracteres
              </Link>
              <Link href="/calculadora-rescisao" className="hover:text-blue-600 transition-colors">
                Rescisão Trabalhista
              </Link>
              <Link href="/calculadora-imc" className="hover:text-blue-600 transition-colors">
                Calculadora IMC
              </Link>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-slate-900 text-slate-400 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-10">
              <Image src="/logo-icon.png" alt="FerramentaUtil" width={36} height={36} className="rounded-lg opacity-90" />
              <div>
                <span className="text-white font-bold text-lg">Ferramenta<span className="text-blue-400">Util</span></span>
                <p className="text-slate-500 text-xs">Ferramentas online gratuitas</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Calculadoras</h3>
                <ul className="space-y-2">
                  <li><Link href="/calculadora-juros-compostos" className="text-sm text-slate-400 hover:text-white transition-colors">Juros Compostos</Link></li>
                  <li><Link href="/calculadora-imc" className="text-sm text-slate-400 hover:text-white transition-colors">IMC</Link></li>
                  <li><Link href="/calculadora-porcentagem" className="text-sm text-slate-400 hover:text-white transition-colors">Porcentagem</Link></li>
                  <li><Link href="/calculadora-combustivel" className="text-sm text-slate-400 hover:text-white transition-colors">Álcool ou Gasolina</Link></li>
                  <li><Link href="/calculadora-rescisao" className="text-sm text-slate-400 hover:text-white transition-colors">Rescisão Trabalhista</Link></li>
                  <li><Link href="/calculadora-calorias" className="text-sm text-slate-400 hover:text-white transition-colors">Calorias Diárias</Link></li>
                  <li><Link href="/calculadora-financiamento" className="text-sm text-slate-400 hover:text-white transition-colors">Financiamento</Link></li>
                  <li><Link href="/calculadora-idade" className="text-sm text-slate-400 hover:text-white transition-colors">Idade</Link></li>
                  <li><Link href="/calculadora-horas" className="text-sm text-slate-400 hover:text-white transition-colors">Horas</Link></li>
                  <li><Link href="/calculadora-desconto" className="text-sm text-slate-400 hover:text-white transition-colors">Desconto</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Geradores</h3>
                <ul className="space-y-2">
                  <li><Link href="/gerador-de-senha" className="text-sm text-slate-400 hover:text-white transition-colors">Gerador de Senha</Link></li>
                  <li><Link href="/gerador-qr-code" className="text-sm text-slate-400 hover:text-white transition-colors">Gerador de QR Code</Link></li>
                  <li><Link href="/gerador-cpf-cnpj" className="text-sm text-slate-400 hover:text-white transition-colors">Gerador CPF/CNPJ</Link></li>
                  <li><Link href="/gerador-contrato" className="text-sm text-slate-400 hover:text-white transition-colors">Gerador de Contrato</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">PDF & Conversores</h3>
                <ul className="space-y-2">
                  <li><Link href="/juntar-pdf" className="text-sm text-slate-400 hover:text-white transition-colors">Juntar PDF</Link></li>
                  <li><Link href="/conversor-moedas" className="text-sm text-slate-400 hover:text-white transition-colors">Conversor de Moedas</Link></li>
                  <li><Link href="/conversor-word-pdf" className="text-sm text-slate-400 hover:text-white transition-colors">Word para PDF</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Utilidades</h3>
                <ul className="space-y-2">
                  <li><Link href="/consulta-cnpj" className="text-sm text-slate-400 hover:text-white transition-colors">Consulta CNPJ</Link></li>
                  <li><Link href="/contador-de-caracteres" className="text-sm text-slate-400 hover:text-white transition-colors">Contador de Caracteres</Link></li>
                  <li><Link href="/tabela-medidas" className="text-sm text-slate-400 hover:text-white transition-colors">Tabela de Medidas</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-sm text-slate-500 mb-4">
              <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
              <span className="text-slate-700">|</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span className="text-slate-700">|</span>
              <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
              <span className="text-slate-700">|</span>
              <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
              <span className="text-slate-700">|</span>
              <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            </div>
            <p className="text-center text-xs text-slate-600 border-t border-slate-800 pt-6 mt-8">
              Ferramentas Online Grátis &copy; {new Date().getFullYear()} &mdash; A maioria das ferramentas funciona diretamente no navegador. Algumas consultas utilizam serviços externos, conforme explicado em nossa <Link href="/privacidade" className="underline hover:text-white transition-colors">Política de Privacidade</Link>.
            </p>
          </div>
        </footer>
        <CookieConsent />
      </body>
    </html>
  );
}
