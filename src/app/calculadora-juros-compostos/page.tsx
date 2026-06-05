"use client";

import { useState } from "react";
import type { Metadata } from "next";
import ToolPage from "../components/ToolPage";

export default function CalculadoraJurosCompostos() {
  const [capital, setCapital] = useState("");
  const [aporteMensal, setAporteMensal] = useState("");
  const [taxa, setTaxa] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [resultado, setResultado] = useState<{
    montante: number;
    totalInvestido: number;
    totalJuros: number;
    tabela: { mes: number; investido: number; juros: number; total: number }[];
  } | null>(null);

  function calcular() {
    const c = parseFloat(capital) || 0;
    const m = parseFloat(aporteMensal) || 0;
    const r = (parseFloat(taxa) || 0) / 100;
    const n = parseInt(periodo) || 0;

    if (n <= 0) return;

    let saldo = c;
    let totalInvestido = c;
    const tabela: { mes: number; investido: number; juros: number; total: number }[] = [];

    for (let i = 1; i <= n; i++) {
      const jurosDoMes = saldo * r;
      saldo = saldo + jurosDoMes + m;
      totalInvestido += m;
      tabela.push({
        mes: i,
        investido: totalInvestido,
        juros: saldo - totalInvestido,
        total: saldo,
      });
    }

    setResultado({
      montante: saldo,
      totalInvestido,
      totalJuros: saldo - totalInvestido,
      tabela,
    });
  }

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolPage title="Calculadora de Juros Compostos" description="Simule o rendimento dos seus investimentos com juros compostos. Insira o valor inicial, aporte mensal, taxa de juros e o periodo para ver quanto seu dinheiro pode render." accent="blue" icon="📈" slug="calculadora-juros-compostos">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Valor Inicial (R$)</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              placeholder="Ex: 1000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Aporte Mensal (R$)</label>
            <input
              type="number"
              value={aporteMensal}
              onChange={(e) => setAporteMensal(e.target.value)}
              placeholder="Ex: 500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Taxa de Juros Mensal (%)</label>
            <input
              type="number"
              step="0.01"
              value={taxa}
              onChange={(e) => setTaxa(e.target.value)}
              placeholder="Ex: 1.0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Periodo (meses)</label>
            <input
              type="number"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Ex: 12"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Calcular
        </button>
      </div>

      {resultado && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-sm text-green-700 mb-1">Montante Final</p>
              <p className="text-2xl font-bold text-green-800">
                {formatBRL(resultado.montante)}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-700 mb-1">Total Investido</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatBRL(resultado.totalInvestido)}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
              <p className="text-sm text-purple-700 mb-1">Total em Juros</p>
              <p className="text-2xl font-bold text-purple-800">
                {formatBRL(resultado.totalJuros)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-semibold p-4 border-b border-gray-200">
              Evolucao Mensal
            </h2>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Mes</th>
                    <th className="px-4 py-2 text-right">Investido</th>
                    <th className="px-4 py-2 text-right">Juros</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabela.map((row) => (
                    <tr key={row.mes} className="border-t border-gray-100">
                      <td className="px-4 py-2">{row.mes}</td>
                      <td className="px-4 py-2 text-right">{formatBRL(row.investido)}</td>
                      <td className="px-4 py-2 text-right text-green-600">
                        {formatBRL(row.juros)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatBRL(row.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que sao Juros Compostos?</h2>
        <p>
          Juros compostos sao os juros calculados sobre o valor principal mais os juros
          acumulados de periodos anteriores. Diferente dos juros simples, onde a taxa incide
          apenas sobre o valor inicial, nos juros compostos voce ganha &quot;juros sobre juros&quot;,
          fazendo seu dinheiro crescer de forma exponencial ao longo do tempo.
        </p>
        <h2>Como usar esta calculadora?</h2>
        <p>
          Preencha o valor inicial que voce pretende investir, o aporte mensal (quanto voce
          vai adicionar por mes), a taxa de juros mensal do investimento e o periodo em
          meses. A calculadora mostrara o montante final, quanto foi investido e quanto
          rendeu em juros.
        </p>
        <h2>Formula dos Juros Compostos</h2>
        <p>
          A formula e: M = C x (1 + i)^n, onde M e o montante final, C e o capital inicial,
          i e a taxa de juros e n e o numero de periodos. Quando ha aporte mensal, usamos a
          formula de anuidade: M = PMT x ((1+i)^n - 1) / i.
        </p>
      </section>
    </ToolPage>
  );
}
