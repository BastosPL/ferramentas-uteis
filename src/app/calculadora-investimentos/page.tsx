"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type TipoInvestimento = "cdb" | "lci" | "tesouro";

const ALIQUOTAS_IR = [
  { ate: 180, aliquota: 22.5 },
  { ate: 360, aliquota: 20 },
  { ate: 720, aliquota: 17.5 },
  { ate: Infinity, aliquota: 15 },
];

function aliquotaIR(dias: number): number {
  for (const faixa of ALIQUOTAS_IR) {
    if (dias <= faixa.ate) return faixa.aliquota;
  }
  return 15;
}

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Resultado = {
  tipo: string;
  montanteBruto: number;
  rendimentoBruto: number;
  ir: number;
  iof: number;
  montanteLiquido: number;
  rendimentoLiquido: number;
  rentabilidadeLiquida: number;
  aliquotaIR: number;
  isento: boolean;
};

function calcular({
  valor,
  meses,
  taxaAnual,
  percentualCDI,
  cdiAnual,
  tipo,
}: {
  valor: number;
  meses: number;
  taxaAnual: number;
  percentualCDI: number;
  cdiAnual: number;
  tipo: TipoInvestimento;
}): Resultado {
  const dias = meses * 30;
  let taxaEfetiva: number;

  if (tipo === "tesouro") {
    taxaEfetiva = taxaAnual / 100;
  } else {
    taxaEfetiva = (cdiAnual / 100) * (percentualCDI / 100);
  }

  const taxaMensal = Math.pow(1 + taxaEfetiva, 1 / 12) - 1;
  const montanteBruto = valor * Math.pow(1 + taxaMensal, meses);
  const rendimentoBruto = montanteBruto - valor;

  const isento = tipo === "lci";
  const aliq = isento ? 0 : aliquotaIR(dias);
  const ir = isento ? 0 : rendimentoBruto * (aliq / 100);

  // IOF (only first 30 days, simplified)
  const iof = dias < 30 ? rendimentoBruto * ((30 - dias) / 30) * (aliq / 100) * 0.5 : 0;

  const montanteLiquido = montanteBruto - ir - iof;
  const rendimentoLiquido = montanteLiquido - valor;
  const rentabilidadeLiquida = (rendimentoLiquido / valor) * 100;

  const labels: Record<TipoInvestimento, string> = {
    cdb: "CDB",
    lci: "LCI/LCA",
    tesouro: "Tesouro Direto",
  };

  return {
    tipo: labels[tipo],
    montanteBruto,
    rendimentoBruto,
    ir,
    iof,
    montanteLiquido,
    rendimentoLiquido,
    rentabilidadeLiquida,
    aliquotaIR: aliq,
    isento,
  };
}

export default function CalculadoraInvestimentos() {
  const [valor, setValor] = useState("");
  const [meses, setMeses] = useState("12");
  const [cdiAnual, setCdiAnual] = useState("14.15");
  const [percentualCDB, setPercentualCDB] = useState("100");
  const [percentualLCI, setPercentualLCI] = useState("90");
  const [taxaTesouro, setTaxaTesouro] = useState("12.5");
  const [resultados, setResultados] = useState<Resultado[] | null>(null);

  function simular() {
    const v = parseFloat(valor);
    const m = parseInt(meses);
    const cdi = parseFloat(cdiAnual);
    if (!v || v <= 0 || !m || m <= 0 || !cdi || cdi <= 0) return;

    const res: Resultado[] = [];

    // CDB
    const pCDB = parseFloat(percentualCDB);
    if (pCDB > 0) {
      res.push(calcular({ valor: v, meses: m, taxaAnual: 0, percentualCDI: pCDB, cdiAnual: cdi, tipo: "cdb" }));
    }

    // LCI/LCA
    const pLCI = parseFloat(percentualLCI);
    if (pLCI > 0) {
      res.push(calcular({ valor: v, meses: m, taxaAnual: 0, percentualCDI: pLCI, cdiAnual: cdi, tipo: "lci" }));
    }

    // Tesouro Direto
    const tTesouro = parseFloat(taxaTesouro);
    if (tTesouro > 0) {
      res.push(calcular({ valor: v, meses: m, taxaAnual: tTesouro, percentualCDI: 0, cdiAnual: cdi, tipo: "tesouro" }));
    }

    setResultados(res);
  }

  const m = parseInt(meses) || 12;
  const dias = m * 30;
  const aliq = aliquotaIR(dias);

  return (
    <ToolPage
      title="Calculadora de Investimentos"
      description="Simule e compare CDB, LCI/LCA e Tesouro Direto. Veja o rendimento liquido com desconto de IR."
      accent="indigo"
      icon="💰"
      slug="calculadora-investimentos"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Investimento</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor a investir (R$)</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 10000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (meses)</label>
            <input
              type="number"
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
              placeholder="12"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taxa CDI anual (%)</label>
            <input
              type="number"
              step="0.01"
              value={cdiAnual}
              onChange={(e) => setCdiAnual(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Taxa info */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-indigo-800">
            <strong>Aliquota de IR para {m} meses ({dias} dias):</strong> {aliq}%
            {dias <= 180 && " (ate 180 dias)"}
            {dias > 180 && dias <= 360 && " (181 a 360 dias)"}
            {dias > 360 && dias <= 720 && " (361 a 720 dias)"}
            {dias > 720 && " (acima de 720 dias)"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">CDB (% do CDI)</label>
            <input
              type="number"
              step="0.1"
              value={percentualCDB}
              onChange={(e) => setPercentualCDB(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Tributado pelo IR</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">LCI/LCA (% do CDI)</label>
            <input
              type="number"
              step="0.1"
              value={percentualLCI}
              onChange={(e) => setPercentualLCI(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-green-600 mt-1 font-medium">Isento de IR</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tesouro Direto (% a.a.)</label>
            <input
              type="number"
              step="0.01"
              value={taxaTesouro}
              onChange={(e) => setTaxaTesouro(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Tributado pelo IR + custódia B3</p>
          </div>
        </div>

        <button
          onClick={simular}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer transition-colors"
        >
          Simular Investimentos
        </button>
      </div>

      {/* Results */}
      {resultados && resultados.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparativo de Resultados</h2>

          {/* Winner banner */}
          {(() => {
            const melhor = resultados.reduce((a, b) => a.rendimentoLiquido > b.rendimentoLiquido ? a : b);
            return (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                <p className="text-indigo-800 font-semibold">
                  🏆 Melhor opcao: <strong>{melhor.tipo}</strong> com rendimento liquido de{" "}
                  <strong>{formatBRL(melhor.rendimentoLiquido)}</strong> ({melhor.rentabilidadeLiquida.toFixed(2)}%)
                </p>
              </div>
            );
          })()}

          <div className="grid md:grid-cols-3 gap-4">
            {resultados.map((r, i) => {
              const isMelhor = r.rendimentoLiquido === Math.max(...resultados.map(x => x.rendimentoLiquido));
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-5 ${
                    isMelhor ? "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-200" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{r.tipo}</h3>
                    {isMelhor && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">Melhor</span>}
                    {r.isento && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Isento IR</span>}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Montante bruto</span>
                      <span className="text-gray-900 font-medium">{formatBRL(r.montanteBruto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rendimento bruto</span>
                      <span className="text-gray-900 font-medium">{formatBRL(r.rendimentoBruto)}</span>
                    </div>
                    {!r.isento && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">IR ({r.aliquotaIR}%)</span>
                        <span className="text-red-600 font-medium">-{formatBRL(r.ir)}</span>
                      </div>
                    )}
                    <hr className="border-gray-200" />
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-semibold">Montante liquido</span>
                      <span className="text-indigo-700 font-bold text-base">{formatBRL(r.montanteLiquido)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-semibold">Rendimento liquido</span>
                      <span className="text-green-600 font-bold">{formatBRL(r.rendimentoLiquido)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rentabilidade</span>
                      <span className="text-gray-900 font-medium">{r.rentabilidadeLiquida.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* IR Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tabela Regressiva de IR</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Prazo</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Aliquota IR</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">LCI/LCA</th>
              </tr>
            </thead>
            <tbody>
              {ALIQUOTAS_IR.map((f, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-gray-900">
                    {f.ate === 180 && "Ate 180 dias (6 meses)"}
                    {f.ate === 360 && "181 a 360 dias (1 ano)"}
                    {f.ate === 720 && "361 a 720 dias (2 anos)"}
                    {f.ate === Infinity && "Acima de 720 dias"}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-900 font-medium">{f.aliquota}%</td>
                  <td className="py-2 px-3 text-right text-green-600 font-medium">Isento</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como comparar investimentos de renda fixa?</h2>
        <p>
          Para comparar CDB, LCI/LCA e Tesouro Direto de forma justa, e essencial considerar
          o Imposto de Renda. CDB e Tesouro sao tributados pela tabela regressiva (22,5% a 15%),
          enquanto LCI e LCA sao isentos de IR para pessoa fisica. Por isso, um LCI de 90% do CDI
          pode render mais que um CDB de 100% do CDI em prazos curtos.
        </p>

        <h2>O que e o CDI?</h2>
        <p>
          O CDI (Certificado de Deposito Interbancario) e a taxa de referencia para investimentos
          de renda fixa no Brasil. Ele acompanha de perto a taxa Selic. Quando dizemos que um CDB
          paga &quot;100% do CDI&quot;, significa que o rendimento sera igual a taxa CDI vigente.
        </p>
      </section>
    </ToolPage>
  );
}
