"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const limites = [
  { nome: "Twitter/X", limite: 280 },
  { nome: "Instagram Bio", limite: 150 },
  { nome: "Meta Description", limite: 160 },
  { nome: "Title Tag", limite: 60 },
  { nome: "LinkedIn Post", limite: 3000 },
  { nome: "YouTube Titulo", limite: 100 },
];

export default function ContadorDeCaracteres() {
  const [texto, setTexto] = useState("");

  const caracteres = texto.length;
  const semEspacos = texto.replace(/\s/g, "").length;
  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const frases = texto.trim() ? texto.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const paragrafos = texto.trim() ? texto.split(/\n\n+/).filter((p) => p.trim()).length : 0;
  const tempoLeitura = Math.max(1, Math.ceil(palavras / 200));

  return (
    <ToolPage title="Contador de Caracteres e Palavras" description="Conte caracteres, palavras, frases e paragrafos do seu texto. Verifique se esta dentro dos limites de redes sociais e SEO." accent="purple" icon="📝" slug="contador-de-caracteres">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole ou digite seu texto aqui..."
          rows={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y text-base"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {[
            { label: "Caracteres", value: caracteres },
            { label: "Sem Espacos", value: semEspacos },
            { label: "Palavras", value: palavras },
            { label: "Frases", value: frases },
            { label: "Paragrafos", value: paragrafos },
            { label: "Tempo de Leitura", value: `${tempoLeitura} min` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 rounded-lg p-3 text-center"
            >
              <p className="text-2xl font-bold text-purple-600">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Limites de Plataformas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {limites.map((item) => {
            const pct = Math.min(100, (caracteres / item.limite) * 100);
            const excedeu = caracteres > item.limite;
            return (
              <div key={item.nome} className="border border-gray-100 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.nome}</span>
                  <span className={`text-xs font-mono ${excedeu ? "text-red-600" : "text-gray-500"}`}>
                    {caracteres}/{item.limite}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${excedeu ? "bg-red-500" : "bg-purple-500"}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {texto && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Frequencia de Palavras</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              texto
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 2)
                .reduce(
                  (acc, word) => {
                    const clean = word.replace(/[^a-zA-ZÀ-ÿ]/g, "");
                    if (clean) acc[clean] = (acc[clean] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 20)
              .map(([word, count]) => (
                <span
                  key={word}
                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {word} ({count})
                </span>
              ))}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Para que serve o Contador de Caracteres?</h2>
        <p>
          O contador de caracteres e essencial para quem trabalha com redes sociais, SEO e
          producao de conteudo. Cada plataforma tem limites especificos de caracteres e
          ultrapassar esses limites pode cortar seu texto ou prejudicar o desempenho.
        </p>
        <h2>Limites importantes para SEO</h2>
        <p>
          A meta description ideal tem entre 150-160 caracteres. O title tag deve ter no
          maximo 60 caracteres para aparecer completo no Google. URLs devem ser curtas e
          descritivas.
        </p>
      </section>
    </ToolPage>
  );
}
