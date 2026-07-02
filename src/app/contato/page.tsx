"use client";

import { useState } from "react";
import { Mail, Lightbulb, Copy, Check, HelpCircle, Send, User, MessageSquare } from "lucide-react";

export default function Contato() {
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("duvida");
  const [mensagem, setMensagem] = useState("");

  function copiarEmail() {
    navigator.clipboard.writeText("contato@ferramentautil.com.br");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  function enviarFormulario(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    const assuntos: Record<string, string> = {
      duvida: "Dúvida",
      sugestao: "Sugestão de Ferramenta",
      bug: "Reportar Problema",
      outro: "Outro Assunto",
    };

    const corpo = `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`;
    const mailto = `mailto:contato@ferramentautil.com.br?subject=${encodeURIComponent(assuntos[assunto] || assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailto;

    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setTimeout(() => setEnviado(false), 5000);
    }, 1000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Fale Conosco
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Tem alguma dúvida, sugestão ou encontrou um problema? Estamos aqui para ajudar!
        </p>
      </section>

      <div className="grid md:grid-cols-5 gap-8 mb-12">
        {/* Contact Form */}
        <form onSubmit={enviarFormulario} className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Envie sua Mensagem</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="assunto" className="block text-sm font-medium text-slate-700 mb-1">
                Assunto
              </label>
              <select
                id="assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="duvida">Dúvida sobre uma ferramenta</option>
                <option value="sugestao">Sugestão de nova ferramenta</option>
                <option value="bug">Reportar um problema</option>
                <option value="outro">Outro assunto</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-slate-700 mb-1">
                Mensagem
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  id="mensagem"
                  required
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Descreva sua dúvida, sugestão ou problema..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-colors cursor-pointer"
            >
              {enviado ? (
                <>
                  <Check className="w-5 h-5" />
                  Mensagem Preparada!
                </>
              ) : enviando ? (
                "Abrindo e-mail..."
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">E-mail Direto</h2>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              Prefere enviar diretamente? Respondemos em até 48 horas úteis.
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs flex-1 text-slate-700 truncate">
                contato@ferramentautil.com.br
              </code>
              <button
                onClick={copiarEmail}
                className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  copiado
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                }`}
              >
                {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Sugestões</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Quer sugerir uma nova ferramenta ou melhoria? Use o formulário
              ao lado com o assunto &quot;Sugestão&quot; — adoramos receber ideias da comunidade!
            </p>
          </div>
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
        <div className="space-y-4">
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
              a: "Use o formulário acima com o assunto \"Reportar um problema\" ou envie um e-mail para contato@ferramentautil.com.br descrevendo o que aconteceu.",
            },
            {
              q: "Quanto tempo para responder?",
              a: "Respondemos todas as mensagens em até 48 horas úteis. Em casos urgentes (erros em ferramentas), priorizamos a correção.",
            },
          ].map((item) => (
            <details key={item.q} className="bg-white rounded-xl border border-slate-200 group">
              <summary className="font-bold text-slate-900 text-sm p-5 cursor-pointer list-none flex items-center justify-between">
                {item.q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-slate-500 text-sm leading-relaxed px-5 pb-5">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center">
        <p className="text-sm text-slate-400">
          FerramentaUtil — Ferramentas online gratuitas para o dia a dia.
        </p>
      </div>
    </div>
  );
}
