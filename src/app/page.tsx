"use client";

import Link from "next/link";
import { WebsiteSchema } from "./components/SchemaOrg";
import ClientOnly from "./components/ClientOnly";
import { allArticles } from "../lib/articles";

const tools = [
  {
    title: "Calculadora de Juros Compostos",
    description: "Simule investimentos com juros compostos. Descubra quanto seu dinheiro pode render ao longo do tempo.",
    href: "/calculadora-juros-compostos",
    icon: "📈",
    keywords: "investimento, poupanca, rendimento, CDB, tesouro",
  },
  {
    title: "Gerador de Senha Segura",
    description: "Gere senhas fortes e aleatorias com letras, numeros e simbolos. Proteja suas contas online.",
    href: "/gerador-de-senha",
    icon: "🔐",
    keywords: "senha segura, password, aleatorio, seguranca",
  },
  {
    title: "Contador de Caracteres e Palavras",
    description: "Conte caracteres, palavras, frases e paragrafos. Ideal para redes sociais, SEO e redacoes.",
    href: "/contador-de-caracteres",
    icon: "📝",
    keywords: "caracteres, palavras, texto, twitter, instagram, seo",
  },
  {
    title: "Conversor de Unidades",
    description: "Converta unidades de comprimento, peso, temperatura, volume e area de forma rapida e precisa.",
    href: "/conversor-de-unidades",
    icon: "🔄",
    keywords: "metros, quilos, celsius, litros, conversao",
  },
  {
    title: "Calculadora de IMC",
    description: "Calcule seu Indice de Massa Corporal e descubra se voce esta no peso ideal.",
    href: "/calculadora-imc",
    icon: "⚖️",
    keywords: "peso ideal, saude, obesidade, magreza, massa corporal",
  },
  {
    title: "Calculadora de Porcentagem",
    description: "Calcule porcentagens: quanto e X% de Y, aumentos, descontos e diferenca entre valores.",
    href: "/calculadora-porcentagem",
    icon: "💯",
    keywords: "porcentagem, desconto, aumento, calcular percentual",
  },
  {
    title: "Cronometro Online",
    description: "Cronometro preciso com contagem progressiva e regressiva. Timer com funcao de voltas.",
    href: "/cronometro",
    icon: "⏱️",
    keywords: "cronometro, timer, contagem regressiva, temporizador",
  },
  {
    title: "Alcool ou Gasolina?",
    description: "Descubra se vale mais a pena abastecer com alcool ou gasolina. Regra dos 70%.",
    href: "/calculadora-combustivel",
    icon: "⛽",
    keywords: "alcool, gasolina, combustivel, etanol, economizar",
  },
  {
    title: "Gerador de QR Code",
    description: "Gere QR Codes para URLs, WhatsApp, Wi-Fi e mais. Baixe em PNG gratuitamente.",
    href: "/gerador-qr-code",
    icon: "📱",
    keywords: "qr code, codigo qr, gerar qr, whatsapp, wifi",
  },
  {
    title: "Calculadora de Rescisao",
    description: "Calcule sua rescisao trabalhista: saldo de salario, ferias, 13o, aviso previo e multa FGTS.",
    href: "/calculadora-rescisao",
    icon: "📋",
    keywords: "rescisao, trabalhista, demissao, fgts, aviso previo",
  },
  {
    title: "Gerador de CPF/CNPJ",
    description: "Gere CPFs e CNPJs validos para testes de software. Valide numeros existentes.",
    href: "/gerador-cpf-cnpj",
    icon: "🆔",
    keywords: "cpf, cnpj, gerador, validar, teste, desenvolvimento",
  },
  {
    title: "Calculadora de Calorias",
    description: "Descubra quantas calorias voce precisa por dia para emagrecer, manter ou ganhar peso.",
    href: "/calculadora-calorias",
    icon: "🍎",
    keywords: "calorias, dieta, emagrecer, metabolismo, tmb",
  },
  {
    title: "Juntar PDF",
    description: "Combine varios arquivos PDF em um so. 100% gratis e privado — nada e enviado para servidores.",
    href: "/juntar-pdf",
    icon: "📄",
    keywords: "juntar pdf, combinar pdf, unir pdf, merge",
  },
  {
    title: "Imagem para PDF",
    description: "Converta imagens JPG e PNG para PDF. Combine varias imagens em um unico arquivo.",
    href: "/imagem-para-pdf",
    icon: "🖼️",
    keywords: "imagem pdf, jpg para pdf, png para pdf, foto pdf",
  },
  {
    title: "Gerador de Lorem Ipsum",
    description: "Gere textos placeholder para layouts e mockups. Paragrafos, frases ou palavras.",
    href: "/gerador-lorem-ipsum",
    icon: "📜",
    keywords: "lorem ipsum, texto placeholder, dummy text",
  },
  {
    title: "Calculadora de Financiamento",
    description: "Simule financiamentos com tabela SAC e Price. Parcelas, juros e evolucao mes a mes.",
    href: "/calculadora-financiamento",
    icon: "🏠",
    keywords: "financiamento, parcela, sac, price, imovel, carro",
  },
  {
    title: "Conversor de Moedas",
    description: "Converta moedas com cotacao atualizada: Dolar, Euro, Libra, Bitcoin e mais.",
    href: "/conversor-moedas",
    icon: "💱",
    keywords: "dolar, euro, cotacao, cambio, moeda, conversao",
  },
  {
    title: "Gerador de Cores",
    description: "Gere paletas, converta HEX/RGB/HSL e visualize cores. Color picker para designers.",
    href: "/gerador-cores",
    icon: "🎨",
    keywords: "cores, hex, rgb, hsl, paleta, color picker",
  },
  {
    title: "Calculadora de Idade",
    description: "Calcule sua idade exata em anos, meses e dias. Descubra dias vividos, proximo aniversario e signo.",
    href: "/calculadora-idade",
    icon: "🎂",
    keywords: "idade, anos, nascimento, aniversario, dias vividos",
  },
  {
    title: "Conversor de Texto",
    description: "Converta textos para maiusculas, minusculas, titulo, slug e mais. Remova acentos facilmente.",
    href: "/conversor-texto",
    icon: "🔤",
    keywords: "maiusculas, minusculas, texto, converter, acentos, slug",
  },
  {
    title: "Calculadora de Horas",
    description: "Some horas trabalhadas, calcule banco de horas e diferenca entre horarios. Controle de ponto.",
    href: "/calculadora-horas",
    icon: "🕐",
    keywords: "horas trabalhadas, banco de horas, controle ponto, horas extras",
  },
  {
    title: "Gerador de Contrato",
    description: "Gere modelos de contrato de prestacao de servico prontos para usar. Baixe gratuitamente.",
    href: "/gerador-contrato",
    icon: "📝",
    keywords: "contrato, modelo contrato, prestacao servico, contrato simples",
  },
  {
    title: "Calculadora de Desconto",
    description: "Calcule descontos em porcentagem, descubra o preco final e compare ofertas.",
    href: "/calculadora-desconto",
    icon: "🏷️",
    keywords: "desconto, porcentagem, preco final, black friday, promocao",
  },
  {
    title: "Validador de Email",
    description: "Verifique se enderecos de email tem formato valido. Detecta erros e sugere correcoes.",
    href: "/validador-email",
    icon: "📧",
    keywords: "validar email, verificar email, email valido, checar email",
  },
  {
    title: "Tabela de Medidas",
    description: "Converta tamanhos de roupas, calcados e aneis entre Brasil, EUA e Europa.",
    href: "/tabela-medidas",
    icon: "📏",
    keywords: "tabela medidas, tamanho roupa, numero calcado, conversao tamanhos",
  },
  {
    title: "Consulta CNPJ",
    description: "Consulte dados da Receita Federal: razao social, situacao cadastral, CNAE, endereco, socios e capital social. Valide CNPJ e IE.",
    href: "/consulta-cnpj",
    icon: "🏢",
    keywords: "consulta cnpj, receita federal, situacao cadastral, cnpj empresa, inscricao estadual",
  },
  {
    title: "Conversor Word ⇄ PDF",
    description: "Converta Word para PDF e PDF para Word online. 100% privado, nenhum arquivo sai do seu navegador.",
    href: "/conversor-word-pdf",
    icon: "📄",
    keywords: "word para pdf, pdf para word, converter docx, converter pdf, docx pdf",
  },
  {
    title: "Compressor de Imagem",
    description: "Comprima imagens JPG, PNG e WebP online. Reduza o tamanho sem perder qualidade. 100% privado.",
    href: "/compressor-imagem",
    icon: "🖼️",
    keywords: "comprimir imagem, reduzir tamanho, otimizar foto, webp, compressao",
  },
  {
    title: "Gerador de QR Code PIX",
    description: "Gere QR Code PIX para receber pagamentos. Crie codigo PIX copia e cola instantaneamente.",
    href: "/gerador-pix",
    icon: "💲",
    keywords: "pix, qr code pix, copia e cola, receber pix, pagamento",
  },
  {
    title: "Calculadora de Investimentos",
    description: "Simule e compare CDB, LCI/LCA e Tesouro Direto. Veja o rendimento liquido com desconto de IR.",
    href: "/calculadora-investimentos",
    icon: "💰",
    keywords: "investimentos, cdb, lci, lca, tesouro direto, renda fixa, ir",
  },
];

export default function Home() {
  return (
    <ClientOnly>
    <div className="max-w-6xl mx-auto px-4 py-12">
      <WebsiteSchema />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 mb-12 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span>🚀</span> 30+ ferramentas gratuitas
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Ferramentas Online Gratuitas
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Calculadoras, geradores e conversores que funcionam direto no seu navegador.
            Sem cadastro, sem instalacao, sem enviar dados para nenhum servidor.
          </p>
          <div className="flex justify-center gap-6 mt-8 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full" /> 100% Gratis</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full" /> Privacidade Total</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full" /> Sem Cadastro</span>
          </div>
        </div>
      </section>

      {/* Destaques — grid 2x2 */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">⭐ Ferramentas em Destaque</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {/* Principal 1 — Consulta CNPJ */}
          <Link
            href="/consulta-cnpj"
            className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <span className="text-4xl mb-3 block">🏢</span>
            <h3 className="text-xl font-bold mb-1">Consulta CNPJ</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Consulte dados da Receita Federal: razao social, situacao cadastral, CNAE, socios, endereco e mais. Gratis e instantaneo.
            </p>
            <span className="inline-block mt-3 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              + Validador de CNPJ e IE
            </span>
          </Link>

          {/* Principal 2 — Ferramentas de PDF */}
          <Link
            href="/juntar-pdf"
            className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <span className="text-4xl mb-3 block">📄</span>
            <h3 className="text-xl font-bold mb-1">Ferramentas de PDF</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Junte varios PDFs em um so, converta imagens ou Word para PDF. 100% privado — nada sai do navegador.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Juntar PDF</span>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Imagem → PDF</span>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Word ⇄ PDF</span>
            </div>
          </Link>

          {/* Destaque 3 — Gerador PIX */}
          <Link
            href="/gerador-pix"
            className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <span className="text-4xl mb-3 block">💲</span>
            <h3 className="text-xl font-bold mb-1">Gerador de QR Code PIX</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Gere QR Code PIX para receber pagamentos. Codigo copia e cola seguindo o padrao EMV do Banco Central.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">CPF / CNPJ / Email</span>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Copia e Cola</span>
            </div>
          </Link>

          {/* Destaque 4 — Calculadora Investimentos */}
          <Link
            href="/calculadora-investimentos"
            className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <span className="text-4xl mb-3 block">💰</span>
            <h3 className="text-xl font-bold mb-1">Calculadora de Investimentos</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Compare CDB, LCI/LCA e Tesouro Direto. Simule rendimentos com desconto de IR e descubra a melhor opcao.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">CDB / LCI / LCA</span>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Tesouro Direto</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <span className="text-4xl mb-4 block">{tool.icon}</span>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
          </Link>
        ))}

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-4">🚀</span>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            Mais ferramentas em breve
          </h2>
          <p className="text-blue-600 text-sm">
            Novas ferramentas sao adicionadas toda semana. Salve nos favoritos!
          </p>
        </div>
      </section>

      {/* Blog Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📚 Do nosso Blog</h2>
          <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Ver todos os artigos →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {allArticles.slice(0, 4).map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col"
            >
              <span className="text-xs font-semibold text-blue-600 mb-2">{article.category}</span>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 flex-1">
                {article.title}
              </h3>
              <span className="text-xs text-gray-400">{article.readTime} de leitura</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-4">Por que usar nossas ferramentas?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-1">100% Gratis</h3>
            <p className="text-sm text-gray-600">
              Todas as ferramentas sao totalmente gratuitas, sem limites de uso e sem cadastro.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Privacidade Total</h3>
            <p className="text-sm text-gray-600">
              Tudo roda no seu navegador. Nenhum dado e enviado para servidores externos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Rapido e Simples</h3>
            <p className="text-sm text-gray-600">
              Interface limpa e direta. Sem popups, sem distracao. Resultado instantaneo.
            </p>
          </div>
        </div>
      </section>
    </div>
    </ClientOnly>
  );
}
