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

  const iof = 0;

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

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto mt-16 space-y-12 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Investimentos</h2>
          <p className="mb-3">Comparar investimentos de renda fixa e fundamental para maximizar seus rendimentos. Veja como usar a ferramenta para tomar decisoes mais inteligentes:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Informe o valor a investir:</strong> Digite o montante que pretende aplicar. Pode ser qualquer valor a partir de R$ 1,00.</li>
            <li><strong>Defina o prazo:</strong> Escolha por quantos meses deseja manter o investimento. O prazo influencia diretamente a aliquota de IR aplicada.</li>
            <li><strong>Confira a taxa CDI:</strong> A ferramenta ja vem com a taxa CDI atual pre-preenchida. Ajuste se necessario conforme a taxa vigente no momento da sua consulta.</li>
            <li><strong>Configure as taxas de cada produto:</strong> Defina o percentual do CDI para CDB e LCI/LCA, e a taxa anual para o Tesouro Direto. Use as taxas oferecidas pelo seu banco ou corretora.</li>
            <li><strong>Clique em &quot;Simular Investimentos&quot;:</strong> A calculadora processa tudo e exibe um comparativo lado a lado mostrando rendimento bruto, desconto de IR, rendimento liquido e rentabilidade.</li>
            <li><strong>Analise o vencedor:</strong> O sistema destaca automaticamente a melhor opcao com base no rendimento liquido (ja descontado o IR).</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo dos Investimentos</h2>
          <p className="mb-3">A calculadora simula o rendimento de tres tipos de investimento de renda fixa, cada um com suas particularidades tributarias:</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">CDB (Certificado de Deposito Bancario)</h3>
          <p className="mb-2">O CDB rende um percentual do CDI e e tributado pelo Imposto de Renda na fonte, seguindo a tabela regressiva. O calculo e: taxa efetiva = CDI anual x percentual do CDB. Por exemplo, se o CDI e 14,15% e o CDB paga 100% do CDI, a taxa efetiva e 14,15% ao ano. O IR incide apenas sobre o rendimento (nao sobre o principal investido).</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">LCI/LCA (Letra de Credito Imobiliario/Agronegocio)</h3>
          <p className="mb-2">LCI e LCA funcionam de forma similar ao CDB, mas com uma vantagem crucial: sao isentos de Imposto de Renda para pessoa fisica. Por isso, mesmo com percentuais menores do CDI (tipicamente 85% a 95%), podem render mais que CDBs de 100% do CDI, especialmente em prazos curtos quando a aliquota de IR e mais alta (22,5%).</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Tesouro Direto</h3>
          <p className="mb-2">O Tesouro Direto usa uma taxa fixa anual definida no momento da compra. Tambem e tributado pela tabela regressiva de IR, alem da taxa de custodia da B3 (0,20% ao ano sobre o montante). A calculadora aplica o IR sobre o rendimento bruto, similar ao CDB.</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Tabela Regressiva de IR</h3>
          <p>A aliquota de IR diminui com o tempo de aplicacao: 22,5% ate 180 dias, 20% de 181 a 360 dias, 17,5% de 361 a 720 dias e 15% acima de 720 dias. Essa regressividade incentiva investimentos de longo prazo.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Por que LCI/LCA de 90% do CDI pode render mais que CDB de 100%?</summary>
              <p className="mt-2">Porque o CDB paga IR sobre o rendimento (de 22,5% a 15%), enquanto LCI/LCA sao isentos. Em um investimento de 6 meses, por exemplo, o CDB de 100% CDI perde 22,5% do rendimento para o IR, enquanto o LCI de 90% CDI mantem 100% do rendimento. Faca a simulacao na calculadora para ver a diferenca exata no seu caso.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O que e o CDI e por que e tao importante?</summary>
              <p className="mt-2">O CDI (Certificado de Deposito Interbancario) e a taxa de referencia para investimentos de renda fixa no Brasil. Ele acompanha de perto a taxa Selic definida pelo Banco Central. Quando um CDB paga &quot;100% do CDI&quot;, significa que seu rendimento sera igual a taxa CDI vigente. A maioria dos investimentos de renda fixa usa o CDI como benchmark.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O IOF afeta meu investimento?</summary>
              <p className="mt-2">O IOF (Imposto sobre Operacoes Financeiras) incide apenas nos primeiros 30 dias de aplicacao, com aliquota regressiva diaria (Decreto 6.306/2007): 96% no 1o dia, caindo ate 0% no 30o dia. Apos 30 dias, nao ha IOF. Esta simulacao considera prazos a partir de 30 dias, portanto o IOF nao e calculado neste modelo. Evite resgatar investimentos antes de completar 30 dias.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Qual o investimento minimo para cada opcao?</summary>
              <p className="mt-2">O Tesouro Direto aceita investimentos a partir de aproximadamente R$ 30. CDBs variam conforme o banco — alguns comecam com R$ 1,00 (bancos digitais) e outros exigem R$ 1.000 ou mais. LCI/LCA geralmente exigem investimento minimo entre R$ 1.000 e R$ 5.000.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">E seguro investir em CDB, LCI e Tesouro?</summary>
              <p className="mt-2">CDBs e LCI/LCA sao protegidos pelo FGC (Fundo Garantidor de Creditos) ate R$ 250.000 por CPF por instituicao. O Tesouro Direto e garantido pelo Governo Federal, sendo considerado o investimento mais seguro do Brasil. Diversificar entre as tres opcoes e uma estrategia prudente.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">A simulacao considera a inflacao?</summary>
              <p className="mt-2">Nao. A calculadora mostra o rendimento nominal (sem descontar a inflacao). Para calcular o rendimento real, subtraia a taxa de inflacao esperada (IPCA) da rentabilidade obtida. O Tesouro IPCA+ ja protege contra a inflacao, mas os outros investimentos nao oferecem essa garantia.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso resgatar antes do prazo?</summary>
              <p className="mt-2">CDBs com liquidez diaria permitem resgate a qualquer momento. LCI/LCA geralmente tem carencia minima de 90 dias. O Tesouro Direto pode ser vendido a qualquer dia util, mas o preco pode variar (marcacao a mercado). CDBs sem liquidez diaria so podem ser resgatados no vencimento.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Investir em Renda Fixa</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Reserva de emergencia:</strong> Para sua reserva (3 a 6 meses de despesas), escolha CDB com liquidez diaria de 100% do CDI ou Tesouro Selic. A prioridade e poder resgatar a qualquer momento, nao a rentabilidade maxima.</li>
            <li><strong>Compare sempre o liquido:</strong> Nunca compare a taxa bruta de um CDB com a de um LCI. Use esta calculadora para ver o rendimento liquido (pos-IR) e tomar a melhor decisao.</li>
            <li><strong>Prazo importa muito:</strong> Em investimentos curtos (ate 6 meses), LCI/LCA levam vantagem pela isencao de IR. Em prazos longos (acima de 2 anos), a diferenca diminui porque o IR do CDB cai para 15%.</li>
            <li><strong>Diversifique entre bancos:</strong> Lembre-se do limite de R$ 250.000 do FGC por instituicao. Se tiver mais que isso para investir, divida entre bancos diferentes.</li>
            <li><strong>Fique de olho na Selic:</strong> Quando o Banco Central sobe a Selic, o CDI acompanha, beneficiando todos os investimentos pos-fixados. Quando a Selic cai, considere travar taxas em CDBs pre-fixados.</li>
            <li><strong>Nao esqueca os custos:</strong> Algumas corretoras cobram taxa de corretagem ou custodia. O Tesouro Direto tem taxa de custodia da B3 de 0,20% ao ano. Considere esses custos na decisao.</li>
          </ul>
        </section>

      </div>
    </ToolPage>
  );
}
