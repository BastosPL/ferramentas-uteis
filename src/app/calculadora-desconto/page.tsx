"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

export default function CalculadoraDesconto() {
  const [preco, setPreco] = useState("");
  const [desconto, setDesconto] = useState("");
  const [precoFinal, setPrecoFinal] = useState("");
  const [modo, setModo] = useState<"desconto" | "final" | "comparar">("desconto");

  // Comparador
  const [precoA, setPrecoA] = useState("");
  const [descontoA, setDescontoA] = useState("");
  const [precoB, setPrecoB] = useState("");
  const [descontoB, setDescontoB] = useState("");

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Modo 1: calcular preco com desconto
  const p = parseFloat(preco) || 0;
  const d = parseFloat(desconto) || 0;
  const valorDesconto = p * (d / 100);
  const precoComDesconto = p - valorDesconto;

  // Modo 2: descobrir desconto dado preco final
  const pf = parseFloat(precoFinal) || 0;
  const descontoCalculado = p > 0 ? ((p - pf) / p) * 100 : 0;
  const economiaCalculada = p - pf;

  // Modo 3: comparar
  const finalA = (parseFloat(precoA) || 0) * (1 - (parseFloat(descontoA) || 0) / 100);
  const finalB = (parseFloat(precoB) || 0) * (1 - (parseFloat(descontoB) || 0) / 100);

  return (
    <ToolPage
      title="Calculadora de Desconto"
      description="Calcule descontos em porcentagem, descubra o preco final e compare ofertas. Ideal para compras e Black Friday."
      accent="red"
      icon="🏷️"
      slug="calculadora-desconto"
    >
      <div className="flex gap-2 mb-6">
        {[
          { id: "desconto" as const, label: "Calcular Desconto" },
          { id: "final" as const, label: "Descobrir %" },
          { id: "comparar" as const, label: "Comparar Precos" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setModo(m.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${modo === m.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {modo === "desconto" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Preco Original (R$)</label>
              <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: 199.90" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Desconto (%)</label>
              <input type="number" value={desconto} onChange={(e) => setDesconto(e.target.value)} placeholder="Ex: 30" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg" />
            </div>
          </div>

          {p > 0 && d > 0 && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-xs text-red-600 mb-1">Preco com Desconto</p>
                <p className="text-2xl font-bold text-red-800">{fmt(precoComDesconto)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Voce Economiza</p>
                <p className="text-2xl font-bold text-green-800">{fmt(valorDesconto)}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Preco Original</p>
                <p className="text-2xl font-bold text-gray-400 line-through">{fmt(p)}</p>
              </div>
            </div>
          )}

          {p > 0 && d > 0 && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-medium mb-2">Descontos comuns:</p>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 20, 25, 30, 40, 50, 60, 70].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDesconto(pct.toString())}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                      d === pct ? "bg-red-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:border-red-400"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {modo === "final" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Preco Original (R$)</label>
              <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: 199.90" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Preco Final (R$)</label>
              <input type="number" value={precoFinal} onChange={(e) => setPrecoFinal(e.target.value)} placeholder="Ex: 139.90" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg" />
            </div>
          </div>

          {p > 0 && pf > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-xs text-red-600 mb-1">Desconto Aplicado</p>
                <p className="text-2xl font-bold text-red-800">{descontoCalculado.toFixed(1)}%</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Economia</p>
                <p className="text-2xl font-bold text-green-800">{fmt(economiaCalculada)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {modo === "comparar" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-3">Produto A</h3>
              <input type="number" value={precoA} onChange={(e) => setPrecoA(e.target.value)} placeholder="Preco (R$)" className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" value={descontoA} onChange={(e) => setDescontoA(e.target.value)} placeholder="Desconto (%)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {finalA > 0 && <p className="text-lg font-bold text-blue-800 mt-2 text-center">{fmt(finalA)}</p>}
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="font-medium text-orange-800 mb-3">Produto B</h3>
              <input type="number" value={precoB} onChange={(e) => setPrecoB(e.target.value)} placeholder="Preco (R$)" className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input type="number" value={descontoB} onChange={(e) => setDescontoB(e.target.value)} placeholder="Desconto (%)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {finalB > 0 && <p className="text-lg font-bold text-orange-800 mt-2 text-center">{fmt(finalB)}</p>}
            </div>
          </div>
          {finalA > 0 && finalB > 0 && (
            <div className={`mt-4 rounded-xl p-4 text-center border ${finalA <= finalB ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}`}>
              <p className="text-lg font-bold">
                {finalA < finalB
                  ? `Produto A e mais barato! Economia de ${fmt(finalB - finalA)}`
                  : finalB < finalA
                  ? `Produto B e mais barato! Economia de ${fmt(finalA - finalB)}`
                  : "Os dois tem o mesmo preco final!"}
              </p>
            </div>
          )}
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como calcular desconto em porcentagem?</h2>
        <p>
          Para calcular um desconto, multiplique o preco original pela porcentagem de desconto
          dividida por 100, e subtraia do preco original. Por exemplo: um produto de R$ 200,00
          com 30% de desconto fica R$ 140,00 (200 - 60 = 140). Use nossa calculadora para
          fazer isso automaticamente.
        </p>
      </section>
    </ToolPage>
  );
}
