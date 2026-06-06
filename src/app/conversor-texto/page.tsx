"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

function removerAcentos(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function toSentenceCase(str: string): string {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toAlternateCase(str: string): string {
  return str.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
}

function toSlug(str: string): string {
  return removerAcentos(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function inverter(str: string): string {
  return str.split("").reverse().join("");
}

const CONVERSOES = [
  { nome: "MAIUSCULAS", fn: (s: string) => s.toUpperCase(), desc: "ABC" },
  { nome: "minusculas", fn: (s: string) => s.toLowerCase(), desc: "abc" },
  { nome: "Titulo", fn: toTitleCase, desc: "Abc Def" },
  { nome: "Frase", fn: toSentenceCase, desc: "Abc def." },
  { nome: "aLtErNaDo", fn: toAlternateCase, desc: "aBcDeF" },
  { nome: "Sem Acentos", fn: removerAcentos, desc: "a e i o u" },
  { nome: "slug-url", fn: toSlug, desc: "texto-para-url" },
  { nome: "oditrevnI", fn: inverter, desc: "cba" },
];

export default function ConversorTexto() {
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState("");

  const copiar = async (t: string, label: string) => {
    await navigator.clipboard.writeText(t);
    setCopiado(label);
    setTimeout(() => setCopiado(""), 1500);
  };

  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const caracteres = texto.length;
  const frases = texto.trim() ? texto.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const linhas = texto.trim() ? texto.split("\n").length : 0;

  return (
    <ToolPage
      title="Conversor de Texto"
      description="Converta textos para maiusculas, minusculas, titulo, slug e mais. Remova acentos e copie com um clique."
      accent="sky"
      icon="🔤"
      slug="conversor-texto"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">Digite ou cole seu texto</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole ou digite seu texto aqui..."
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-y"
        />
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>{caracteres} caracteres</span>
          <span>{palavras} palavras</span>
          <span>{frases} frases</span>
          <span>{linhas} linhas</span>
        </div>
      </div>

      {texto.trim() && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {CONVERSOES.map((conv) => {
            const resultado = conv.fn(texto);
            return (
              <div key={conv.nome} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{conv.desc}</span>
                    <h3 className="font-medium text-sm text-gray-900">{conv.nome}</h3>
                  </div>
                  <button
                    onClick={() => copiar(resultado, conv.nome)}
                    className="text-sky-600 text-xs hover:underline cursor-pointer"
                  >
                    {copiado === conv.nome ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-800 font-mono break-all max-h-24 overflow-y-auto">
                  {resultado}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">Acoes Rapidas</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTexto(texto.toUpperCase())}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            Aplicar MAIUSCULAS
          </button>
          <button
            onClick={() => setTexto(texto.toLowerCase())}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            Aplicar minusculas
          </button>
          <button
            onClick={() => setTexto(removerAcentos(texto))}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            Remover Acentos
          </button>
          <button
            onClick={() => setTexto("")}
            className="bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm hover:bg-red-100 cursor-pointer"
          >
            Limpar
          </button>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Para que serve o conversor de texto?</h2>
        <p>
          O conversor de texto e util para programadores, redatores, profissionais de marketing e
          qualquer pessoa que precisa formatar textos rapidamente. Converta entre maiusculas e
          minusculas, gere slugs para URLs, remova acentos para uso em sistemas que nao aceitam
          caracteres especiais, ou inverta textos para diversao.
        </p>
      </section>
    </ToolPage>
  );
}
