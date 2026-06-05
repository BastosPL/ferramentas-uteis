"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type Sistema = "price" | "sac";

export default function CalculadoraFinanciamento() {
  const [valor, setValor] = useState("");
  const [entrada, setEntrada] = useState("");
  const [taxa, setTaxa] = useState("");
  const [meses, setMeses] = useState("");
  const [sistema, setSistema] = useState<Sistema>("price");
  const [resultado, setResultado] = useState<{
    parcelas: { mes: number; parcela: number; juros: number; amortizacao: number; saldo: number }[];
    totalPago: number;
    totalJuros: number;
    primeiraParcela: number;
    ultimaParcela: number;
  } | null>(null);

  function calcular() {
    const v = (parseFloat(valor) || 0) - (parseFloat(entrada) || 0);
    const i = (parseFloat(taxa) || 0) / 100;
    const n = parseInt(meses) || 0;
    if (v <= 0 || i <= 0 || n <= 0) return;

    const parcelas: { mes: number; parcela: number; juros: number; amortizacao: number; saldo: number }[] = [];
    let saldo = v;
    let totalPago = 0;

    if (sistema === "price") {
      const parcelaFixa = v * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      for (let m = 1; m <= n; m++) {
        const juros = saldo * i;
        const amortizacao = parcelaFixa - juros;
        saldo -= amortizacao;
        totalPago += parcelaFixa;
        parcelas.push({ mes: m, parcela: parcelaFixa, juros, amortizacao, saldo: Math.max(0, saldo) });
      }
    } else {
      const amortizacaoFixa = v / n;
      for (let m = 1; m <= n; m++) {
        const juros = saldo * i;
        const parcela = amortizacaoFixa + juros;
        saldo -= amortizacaoFixa;
        totalPago += parcela;
        parcelas.push({ mes: m, parcela, juros, amortizacao: amortizacaoFixa, saldo: Math.max(0, saldo) });
      }
    }

    setResultado({
      parcelas,
      totalPago,
      totalJuros: totalPago - v,
      primeiraParcela: parcelas[0].parcela,
      ultimaParcela: parcelas[parcelas.length - 1].parcela,
    });
  }

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolPage
      title="Calculadora de Financiamento"
      description="Simule financiamentos com tabela SAC e Price. Calcule parcelas, juros totais e veja a evolucao mes a mes."
      accent="blue"
      icon="🏠"
      slug="calculadora-financiamento"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setSistema("price")} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${sistema === "price" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            Tabela Price
          </button>
          <button onClick={() => setSistema("sac")} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${sistema === "sac" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            Tabela SAC
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Valor Total (R$)</label>
            <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 300000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Entrada (R$)</label>
            <input type="number" value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="Ex: 60000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Taxa de Juros Mensal (%)</label>
            <input type="number" step="0.01" value={taxa} onChange={(e) => setTaxa(e.target.value)} placeholder="Ex: 0.75" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Prazo (meses)</label>
            <input type="number" value={meses} onChange={(e) => setMeses(e.target.value)} placeholder="Ex: 360" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <button onClick={calcular} className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
          Simular Financiamento
        </button>
      </div>

      {resultado && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 mb-1">Primeira Parcela</p>
              <p className="text-xl font-bold text-blue-800">{fmt(resultado.primeiraParcela)}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 mb-1">Ultima Parcela</p>
              <p className="text-xl font-bold text-blue-800">{fmt(resultado.ultimaParcela)}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-xs text-green-600 mb-1">Total Pago</p>
              <p className="text-xl font-bold text-green-800">{fmt(resultado.totalPago)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-xs text-red-600 mb-1">Total em Juros</p>
              <p className="text-xl font-bold text-red-800">{fmt(resultado.totalJuros)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <h2 className="text-lg font-semibold p-4 border-b border-gray-200 text-gray-900">
              Tabela {sistema === "price" ? "Price" : "SAC"} — Evolucao
            </h2>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Mes</th>
                    <th className="px-3 py-2 text-right">Parcela</th>
                    <th className="px-3 py-2 text-right">Juros</th>
                    <th className="px-3 py-2 text-right">Amortizacao</th>
                    <th className="px-3 py-2 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.parcelas.map((r) => (
                    <tr key={r.mes} className="border-t border-gray-100">
                      <td className="px-3 py-2">{r.mes}</td>
                      <td className="px-3 py-2 text-right">{fmt(r.parcela)}</td>
                      <td className="px-3 py-2 text-right text-red-600">{fmt(r.juros)}</td>
                      <td className="px-3 py-2 text-right text-green-600">{fmt(r.amortizacao)}</td>
                      <td className="px-3 py-2 text-right font-medium">{fmt(r.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Tabela Price vs SAC: qual a diferenca?</h2>
        <p>
          Na <strong>Tabela Price</strong>, as parcelas sao fixas do inicio ao fim. No comeco,
          a maior parte da parcela sao juros. Na <strong>Tabela SAC</strong>, a amortizacao e
          fixa e as parcelas diminuem ao longo do tempo. O SAC geralmente resulta em menos juros
          totais, mas parcelas iniciais mais altas.
        </p>
      </section>
    </ToolPage>
  );
}
