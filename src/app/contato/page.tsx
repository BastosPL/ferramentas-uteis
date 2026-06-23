"use client";

import { useState } from "react";
import { Mail, Lightbulb, Copy, Check, HelpCircle } from "lucide-react";

export default function Contato() {
  const [copiado, setCopiado] = useState(false);

  function copiarEmail() {
    navigator.clipboard.writeText("contato@ferramentautil.com.br");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Fale Conosco
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Tem alguma d&uacute;vida, sugest&atilde;o ou encontrou um problema? Estamos aqui para ajudar!
        </p>
      </section>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">E-mail</h2>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">
            Envie sua mensagem por e-mail. Respondemos em at&eacute; 48 horas &uacute;teis.
          </p>
          <div className="flex items-center gap-2">
            <code className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm flex-1 text-slate-700">
              contato@ferramentautil.com.br
            </code>
            <button
              onClick={copiarEmail}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                copiado
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
              }`}
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Sugest&otilde;es</h2>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">
            Quer sugerir uma nova ferramenta ou melhoria? Adoramos receber ideias
            da nossa comunidade para tornar o site ainda mais &uacute;til.
          </p>
          <a
            href="mailto:contato@ferramentautil.com.br?subject=Sugest%C3%A3o%20de%20Ferramenta"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-600/25 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Enviar Sugest&atilde;o
          </a>
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-slate-50 rounded-2xl p-8 md:p-10 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Perguntas Frequentes</h2>
        </div>
        <div className="space-y-6">
          {[
            {
              q: "As ferramentas são realmente gratuitas?",
              a: "Sim! Todas as ferramentas são 100% gratuitas, sem limite de uso e sem necessidade de cadastro.",
            },
            {
              q: "Meus dados são enviados para algum servidor?",
              a: "Não. Todas as ferramentas funcionam inteiramente no seu navegador. Nenhum arquivo ou dado pessoal é enviado para servidores externos.",
            },
            {
              q: "Posso usar as ferramentas no celular?",
              a: "Sim! O site é totalmente responsivo e funciona em qualquer dispositivo — computador, tablet ou celular.",
            },
            {
              q: "Encontrei um erro. Como reportar?",
              a: "Envie um e-mail para contato@ferramentautil.com.br descrevendo o problema. Inclua qual ferramenta usou e o que aconteceu. Corrigiremos o mais rápido possível.",
            },
          ].map((item) => (
            <div key={item.q} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1">{item.q}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center">
        <p className="text-sm text-slate-400">
          FerramentasUteis &mdash; Ferramentas online gratuitas para o dia a dia.
        </p>
      </div>
    </div>
  );
}
