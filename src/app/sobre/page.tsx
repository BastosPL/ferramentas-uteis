import Link from "next/link";
import { Target, Zap, Shield, Heart, Monitor, Wrench, MapPin, Code2, Users, CheckCircle2 } from "lucide-react";

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Sobre o FerramentaUtil
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Portal brasileiro de ferramentas online 100% gratuitas,
          desenvolvido em Recife/PE para facilitar o dia a dia de milhões de pessoas.
        </p>
      </section>

      {/* Quem Somos */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quem Somos</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          O FerramentaUtil é um projeto independente de ferramentas online gratuitas,
          desenvolvido e mantido em <strong>Recife, Pernambuco</strong>. O projeto nasceu da necessidade
          de oferecer calculadoras, geradores e conversores práticos e confiáveis para o público brasileiro,
          sem exigir cadastro, instalação ou pagamento.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">
          A maioria das ferramentas processa os dados diretamente no navegador do usuário, sem enviar
          informações para servidores externos. Algumas consultas — como CEP, CNPJ e cotação de moedas —
          dependem de APIs externas para obter dados atualizados. Nesses casos, a ferramenta informa
          qual serviço é utilizado. Os detalhes completos estão na{" "}
          <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link>.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="w-4 h-4 text-blue-500" />
            Recife, PE — Brasil
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Code2 className="w-4 h-4 text-emerald-500" />
            Next.js + React
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="grid sm:grid-cols-2 gap-6 mb-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Nossa Miss&atilde;o</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Oferecer ferramentas pr&aacute;ticas, r&aacute;pidas e seguras que qualquer pessoa possa
            usar direto no navegador, sem instalar nada, criar conta ou pagar.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Velocidade</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Constru&iacute;do com tecnologias modernas (Next.js e React) e hospedado em
            infraestrutura de alta performance para carregamento instant&acirc;neo.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Privacidade</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            A maioria das ferramentas processa os dados diretamente no seu dispositivo.
            Quando um serviço externo &eacute; necessário, informamos claramente quais dados
            s&atilde;o utilizados e qual serviço realiza a consulta.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-rose-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">100% Gratuito</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Acreditamos que ferramentas essenciais do dia a dia devem ser
            acess&iacute;veis a todos, sem barreiras ou cobran&ccedil;as.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="bg-slate-50 rounded-2xl p-8 md:p-10 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">O que Oferecemos</h2>
        </div>
        <p className="text-slate-500 mb-6">
          Atualmente contamos com <strong className="text-slate-900">mais de 30 ferramentas gratuitas</strong>, organizadas em categorias:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Calculadoras", desc: "Juros compostos, IMC, calorias, financiamento, rescisão trabalhista, investimentos e mais" },
            { title: "Geradores", desc: "Senhas seguras, QR Code, CPF/CNPJ para testes, Lorem Ipsum, contratos, QR Code PIX" },
            { title: "Conversores", desc: "Unidades, moedas, texto, Word para PDF" },
            { title: "Ferramentas de PDF", desc: "Juntar PDF, imagem para PDF, compressor de imagem" },
            { title: "Utilidades", desc: "Consulta CNPJ, validador de e-mail, cronômetro, tabela de medidas" },
          ].map((cat) => (
            <div key={cat.title} className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1">{cat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metodologia e Transparência */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Metodologia e Transparência</h2>
        </div>
        <div className="text-slate-600 leading-relaxed space-y-3">
          <p>
            Todas as calculadoras e ferramentas são testadas antes da publicação.
            Quando uma ferramenta utiliza uma fórmula ou convenção específica — como
            a regra dos 70% na calculadora de combustível ou a fórmula de Harris-Benedict
            na calculadora de calorias — a metodologia é explicada na própria página.
          </p>
          <p>
            Páginas que envolvem cálculos financeiros, de saúde ou medidas apresentam
            exemplos verificáveis, fontes consultadas e limitações do resultado,
            para que o usuário possa conferir e interpretar os dados com autonomia.
          </p>
          <p>
            Quando erros são identificados — por testes internos ou por relatos de
            usuários — as correções são realizadas e publicadas. Sugestões, dúvidas e
            relatos de erro podem ser enviados pela
            página de {" "}
            <Link href="/contato" className="text-blue-600 hover:underline">contato</Link>.
          </p>
        </div>
      </section>

      {/* Device support */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Qualquer Dispositivo</h2>
        </div>
        <p className="text-slate-500 leading-relaxed">
          O site é totalmente responsivo e funciona perfeitamente em computadores,
          tablets e celulares. A maioria das ferramentas processa os dados
          diretamente no seu dispositivo, garantindo rapidez e privacidade
          onde quer que você esteja.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-slate-500 mb-4">
          Tem alguma sugest&atilde;o ou encontrou um problema?
        </p>
        <Link
          href="/contato"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-colors"
        >
          Entre em contato
        </Link>
      </section>

      {/* Footer note */}
      <div className="mt-16 text-center">
        <p className="text-sm text-slate-400">
          FerramentaUtil &mdash; Ferramentas online gratuitas para o dia a dia.
        </p>
      </div>
    </div>
  );
}
