"use client";

import Link from "next/link";
import { Shield, Zap, Lock, Smartphone, Clock, Sparkles, ArrowRight, BookOpen, Mail } from "lucide-react";
import { WebsiteSchema } from "./components/SchemaOrg";
import { allArticles } from "../lib/articles";
import { getToolIcon } from "@/lib/tool-icons";

const tools = [
  {
    slug: "calculadora-juros-compostos",
    name: "Calculadora de Juros Compostos",
    description: "Simule investimentos com juros compostos. Descubra quanto seu dinheiro pode render ao longo do tempo.",
    href: "/calculadora-juros-compostos",
  },
  {
    slug: "gerador-de-senha",
    name: "Gerador de Senha Segura",
    description: "Gere senhas fortes e aleatórias com letras, números e símbolos. Proteja suas contas online.",
    href: "/gerador-de-senha",
  },
  {
    slug: "contador-de-caracteres",
    name: "Contador de Caracteres e Palavras",
    description: "Conte caracteres, palavras, frases e parágrafos. Ideal para redes sociais, SEO e redações.",
    href: "/contador-de-caracteres",
  },
  {
    slug: "conversor-de-unidades",
    name: "Conversor de Unidades",
    description: "Converta unidades de comprimento, peso, temperatura, volume e área de forma rápida e precisa.",
    href: "/conversor-de-unidades",
  },
  {
    slug: "calculadora-imc",
    name: "Calculadora de IMC",
    description: "Calcule seu Índice de Massa Corporal e descubra se você está no peso ideal.",
    href: "/calculadora-imc",
  },
  {
    slug: "calculadora-porcentagem",
    name: "Calculadora de Porcentagem",
    description: "Calcule porcentagens: quanto é X% de Y, aumentos, descontos e diferença entre valores.",
    href: "/calculadora-porcentagem",
  },
  {
    slug: "cronometro",
    name: "Cronômetro Online",
    description: "Cronômetro preciso com contagem progressiva e regressiva. Timer com função de voltas.",
    href: "/cronometro",
  },
  {
    slug: "calculadora-combustivel",
    name: "Álcool ou Gasolina?",
    description: "Descubra se vale mais a pena abastecer com álcool ou gasolina. Regra dos 70%.",
    href: "/calculadora-combustivel",
  },
  {
    slug: "gerador-qr-code",
    name: "Gerador de QR Code",
    description: "Gere QR Codes para URLs, WhatsApp, Wi-Fi e mais. Baixe em PNG gratuitamente.",
    href: "/gerador-qr-code",
  },
  {
    slug: "calculadora-rescisao",
    name: "Calculadora de Rescisão",
    description: "Calcule sua rescisão trabalhista: saldo de salário, férias, 13º, aviso prévio e multa FGTS.",
    href: "/calculadora-rescisao",
  },
  {
    slug: "gerador-cpf-cnpj",
    name: "Gerador de CPF/CNPJ",
    description: "Gere CPFs e CNPJs válidos para testes de software. Valide números existentes.",
    href: "/gerador-cpf-cnpj",
  },
  {
    slug: "calculadora-calorias",
    name: "Calculadora de Calorias",
    description: "Descubra quantas calorias você precisa por dia para emagrecer, manter ou ganhar peso.",
    href: "/calculadora-calorias",
  },
  {
    slug: "juntar-pdf",
    name: "Juntar PDF",
    description: "Combine vários arquivos PDF em um só. 100% grátis e privado — nada é enviado para servidores.",
    href: "/juntar-pdf",
  },
  {
    slug: "imagem-para-pdf",
    name: "Imagem para PDF",
    description: "Converta imagens JPG e PNG para PDF. Combine várias imagens em um único arquivo.",
    href: "/imagem-para-pdf",
  },
  {
    slug: "gerador-lorem-ipsum",
    name: "Gerador de Lorem Ipsum",
    description: "Gere textos placeholder para layouts e mockups. Parágrafos, frases ou palavras.",
    href: "/gerador-lorem-ipsum",
  },
  {
    slug: "calculadora-financiamento",
    name: "Calculadora de Financiamento",
    description: "Simule financiamentos com tabela SAC e Price. Parcelas, juros e evolução mês a mês.",
    href: "/calculadora-financiamento",
  },
  {
    slug: "conversor-moedas",
    name: "Conversor de Moedas",
    description: "Converta moedas com cotação atualizada: Dólar, Euro, Libra e mais.",
    href: "/conversor-moedas",
  },
  {
    slug: "gerador-cores",
    name: "Gerador de Cores",
    description: "Gere paletas, converta HEX/RGB/HSL e visualize cores. Color picker para designers.",
    href: "/gerador-cores",
  },
  {
    slug: "calculadora-idade",
    name: "Calculadora de Idade",
    description: "Calcule sua idade exata em anos, meses e dias. Descubra dias vividos, próximo aniversário e signo.",
    href: "/calculadora-idade",
  },
  {
    slug: "conversor-texto",
    name: "Conversor de Texto",
    description: "Converta textos para maiúsculas, minúsculas, título, slug e mais. Remova acentos facilmente.",
    href: "/conversor-texto",
  },
  {
    slug: "calculadora-horas",
    name: "Calculadora de Horas",
    description: "Some horas trabalhadas, calcule banco de horas e diferença entre horários. Controle de ponto.",
    href: "/calculadora-horas",
  },
  {
    slug: "gerador-contrato",
    name: "Gerador de Contrato",
    description: "Gere modelos de contrato de prestação de serviço prontos para usar. Baixe gratuitamente.",
    href: "/gerador-contrato",
  },
  {
    slug: "calculadora-desconto",
    name: "Calculadora de Desconto",
    description: "Calcule descontos em porcentagem, descubra o preço final e compare ofertas.",
    href: "/calculadora-desconto",
  },
  {
    slug: "validador-email",
    name: "Validador de Email",
    description: "Verifique se endereços de email têm formato válido. Detecta erros e sugere correções.",
    href: "/validador-email",
  },
  {
    slug: "tabela-medidas",
    name: "Tabela de Medidas",
    description: "Converta tamanhos de roupas, calçados e anéis entre Brasil, EUA e Europa.",
    href: "/tabela-medidas",
  },
  {
    slug: "consulta-cnpj",
    name: "Consulta CNPJ",
    description: "Consulte dados da Receita Federal: razão social, situação cadastral, CNAE, endereço, sócios e capital social.",
    href: "/consulta-cnpj",
  },
  {
    slug: "conversor-word-pdf",
    name: "Conversor Word / PDF",
    description: "Converta Word para PDF e PDF para Word online. 100% privado, nenhum arquivo sai do seu navegador.",
    href: "/conversor-word-pdf",
  },
  {
    slug: "compressor-imagem",
    name: "Compressor de Imagem",
    description: "Comprima imagens JPG, PNG e WebP online. Reduza o tamanho sem perder qualidade. 100% privado.",
    href: "/compressor-imagem",
  },
  {
    slug: "gerador-pix",
    name: "Gerador de QR Code PIX",
    description: "Gere QR Code PIX para receber pagamentos. Crie código PIX copia e cola instantaneamente.",
    href: "/gerador-pix",
  },
  {
    slug: "calculadora-investimentos",
    name: "Calculadora de Investimentos",
    description: "Simule e compare CDB, LCI/LCA e Tesouro Direto. Veja o rendimento líquido com desconto de IR.",
    href: "/calculadora-investimentos",
  },
  {
    slug: "consulta-cep",
    name: "Consulta CEP",
    description: "Encontre endereços completos por CEP ou descubra o CEP de qualquer rua do Brasil. Dados oficiais dos Correios.",
    href: "/consulta-cep",
  },
];

const featuredSlugs = ["consulta-cnpj", "juntar-pdf", "gerador-pix", "calculadora-investimentos"];
const featuredTools = featuredSlugs.map((slug) => tools.find((t) => t.slug === slug)!);

export default function Home() {
  return (
    <div className="min-h-screen">
        <WebsiteSchema />

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50/80 via-white to-violet-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <span className="inline-block rounded-full bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 mb-6">
                30+ Ferramentas Gratuitas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Ferramentas Online{" "}
                <span className="text-blue-600">Gratuitas</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
                Calculadoras, geradores e conversores gratuitos, sem cadastro e sem instalação.
                A maioria das ferramentas processa os dados diretamente no navegador.
              </p>
              <Link
                href="#ferramentas"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 cta-pulse"
              >
                Explorar Ferramentas
                <ArrowRight size={18} />
              </Link>
              <div className="flex justify-center gap-8 mt-10">
                <span className="text-slate-500 text-sm flex items-center gap-2">
                  <Shield size={16} className="text-slate-400" />
                  100% Gratuito
                </span>
                <span className="text-slate-500 text-sm flex items-center gap-2">
                  <Zap size={16} className="text-slate-400" />
                  Sem Cadastro
                </span>
                <span className="text-slate-500 text-sm flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" />
                  Dados Seguros
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Em Destaque
              </h2>
              <Link
                href="#ferramentas"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredTools.map((tool) => {
                const { icon: Icon, category } = getToolIcon(tool.slug);
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative bg-white rounded-2xl border border-slate-200 p-6 card-interactive scroll-fade-up"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${category.bg} mb-4`}>
                      <Icon className={category.text} size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Tools Grid */}
        <section id="ferramentas" className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                Todas as Ferramentas
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Escolha a ferramenta que você precisa. Sem instalar nada e sem criar conta.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tools.map((tool) => {
                const { icon: Icon, category } = getToolIcon(tool.slug);
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative bg-white rounded-2xl border border-slate-200 p-5 card-interactive scroll-scale-in"
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${category.bg} mb-3`}>
                      <Icon className={category.text} size={20} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {tool.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}

              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 flex flex-col items-center justify-center text-center">
                <Sparkles size={28} className="text-blue-600 mb-3" />
                <h3 className="text-base font-semibold text-blue-700 mb-1">
                  Mais ferramentas em breve
                </h3>
                <p className="text-blue-600/70 text-sm">
                  Novas ferramentas são adicionadas toda semana. Salve nos favoritos!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Por que usar */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                Por que usar nossas ferramentas?
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Praticidade, segurança e velocidade — tudo em um só lugar.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 scroll-fade-up">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 mb-4">
                  <Zap className="text-emerald-600" size={24} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Rápido e Simples</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Interface limpa e direta. Sem popups, sem distração. Resultado instantâneo.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 scroll-fade-up scroll-delay-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Privacidade</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  A maioria das ferramentas processa os dados diretamente no navegador. Quando uma consulta utiliza um serviço externo, isso é informado na própria ferramenta e na Política de Privacidade.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 scroll-fade-up scroll-delay-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 mb-4">
                  <Smartphone className="text-violet-600" size={24} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Responsivo</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Funciona perfeitamente no celular, tablet e computador. Use onde quiser.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 scroll-fade-up scroll-delay-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 mb-4">
                  <Clock className="text-amber-600" size={24} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">100% Gratuito</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Todas as ferramentas são totalmente gratuitas, sem limites de uso e sem cadastro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* O que é o FerramentaUtil */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                  <BookOpen className="text-blue-600" size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                  O que é o FerramentaUtil
                </h2>
              </div>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>
                  O FerramentaUtil é um portal brasileiro de ferramentas online gratuitas, mantido pelo Grupo Bastos em Recife/PE.
                  As calculadoras, geradores e conversores do site são voltados para quem precisa resolver tarefas do dia a dia
                  de forma rápida — estudantes, profissionais, empreendedores ou qualquer pessoa que precise de um cálculo
                  confiável sem instalar software.
                </p>
                <p>
                  Cada ferramenta apresenta a metodologia utilizada, exemplos verificáveis e as limitações do resultado.
                  Quando uma fórmula segue uma convenção específica — como a regra dos 70% na calculadora de combustível
                  ou a fórmula de Harris-Benedict na calculadora de calorias — isso é explicado na própria página,
                  para que o usuário entenda o que está sendo calculado e possa conferir o resultado.
                </p>
                <p>
                  A maioria das ferramentas processa os dados diretamente no navegador, sem enviar informações para servidores externos.
                  Algumas consultas — como CEP, CNPJ e cotação de moedas — dependem de APIs externas para obter dados atualizados.
                  Nesses casos, a ferramenta informa qual serviço é utilizado e quais dados são enviados. Os detalhes completos
                  estão na <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link>.
                </p>
                <p>
                  Se você encontrar um erro em alguma ferramenta, tiver uma sugestão ou quiser propor uma nova funcionalidade,
                  use a página de <Link href="/contato" className="text-blue-600 hover:underline">contato</Link>.
                  Todas as mensagens são lidas e respondidas em até 48 horas úteis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias de Ferramentas */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                Ferramentas por Categoria
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Mais de 30 ferramentas organizadas para facilitar a busca.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Calculadoras Financeiras</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  Juros compostos, financiamento (SAC e Price), investimentos (CDB, LCI/LCA, Tesouro Direto), rescisão trabalhista e descontos.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/calculadora-juros-compostos" className="text-xs text-blue-600 hover:underline">Juros Compostos</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/calculadora-financiamento" className="text-xs text-blue-600 hover:underline">Financiamento</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/calculadora-investimentos" className="text-xs text-blue-600 hover:underline">Investimentos</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/calculadora-desconto" className="text-xs text-blue-600 hover:underline">Desconto</Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Calculadoras do Dia a Dia</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  IMC, calorias, idade, horas trabalhadas, porcentagem e combustível. Cada uma explica a fórmula utilizada e suas limitações.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/calculadora-imc" className="text-xs text-blue-600 hover:underline">IMC</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/calculadora-idade" className="text-xs text-blue-600 hover:underline">Idade</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/calculadora-horas" className="text-xs text-blue-600 hover:underline">Horas</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/calculadora-combustivel" className="text-xs text-blue-600 hover:underline">Combustível</Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Geradores</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  Senhas seguras, QR Codes, QR Code PIX, CPF/CNPJ para testes, Lorem Ipsum, contratos e paletas de cores.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/gerador-de-senha" className="text-xs text-blue-600 hover:underline">Senhas</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/gerador-pix" className="text-xs text-blue-600 hover:underline">PIX</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/gerador-qr-code" className="text-xs text-blue-600 hover:underline">QR Code</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/gerador-contrato" className="text-xs text-blue-600 hover:underline">Contrato</Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Conversores</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  Unidades de medida, moedas com cotação atualizada, texto entre formatos e Word/PDF.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/conversor-de-unidades" className="text-xs text-blue-600 hover:underline">Unidades</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/conversor-moedas" className="text-xs text-blue-600 hover:underline">Moedas</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/conversor-texto" className="text-xs text-blue-600 hover:underline">Texto</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/tabela-medidas" className="text-xs text-blue-600 hover:underline">Medidas</Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Ferramentas de PDF e Imagem</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  Juntar PDFs, converter imagens para PDF, comprimir imagens e converter Word/PDF — tudo processado no navegador.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/juntar-pdf" className="text-xs text-blue-600 hover:underline">Juntar PDF</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/imagem-para-pdf" className="text-xs text-blue-600 hover:underline">Imagem → PDF</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/compressor-imagem" className="text-xs text-blue-600 hover:underline">Compressor</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/conversor-word-pdf" className="text-xs text-blue-600 hover:underline">Word/PDF</Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Consultas e Utilidades</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  Consulta CNPJ e CEP com dados oficiais, validador de e-mail, contador de caracteres e cronômetro.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/consulta-cnpj" className="text-xs text-blue-600 hover:underline">CNPJ</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/consulta-cep" className="text-xs text-blue-600 hover:underline">CEP</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/validador-email" className="text-xs text-blue-600 hover:underline">Validador E-mail</Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/contador-de-caracteres" className="text-xs text-blue-600 hover:underline">Caracteres</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Do Nosso Blog
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                Ver todos os artigos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {allArticles.slice(0, 4).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 card-interactive scroll-slide-left flex flex-col"
                >
                  <span className="text-xs font-semibold text-blue-600 mb-2">{article.category}</span>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 flex-1">
                    {article.title}
                  </h3>
                  <span className="text-xs text-slate-400">{article.readTime} de leitura</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}
