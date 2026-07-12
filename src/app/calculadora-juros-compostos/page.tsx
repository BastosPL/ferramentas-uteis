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

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Juros Compostos</h2>
          <p className="mb-3">
            Utilizar nossa calculadora de juros compostos e simples e intuitivo. Siga o passo a passo abaixo para simular o crescimento do seu patrimonio ao longo do tempo:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Valor Inicial (R$):</strong> Informe o capital que voce ja tem disponivel para comecar o investimento. Pode ser qualquer valor, desde R$ 100 ate quantias maiores. Esse e o montante que sera aplicado no primeiro mes.</li>
            <li><strong>Aporte Mensal (R$):</strong> Digite quanto voce pretende investir todo mes de forma recorrente. Se voce nao planeja fazer aportes mensais, deixe o campo como zero.</li>
            <li><strong>Taxa de Juros Mensal (%):</strong> Insira a taxa de rendimento mensal do seu investimento. Por exemplo, se a aplicacao rende 1% ao mes, digite 1. Para converter taxa anual em mensal, divida a taxa anual por 12 como uma aproximacao simples.</li>
            <li><strong>Periodo (meses):</strong> Defina por quantos meses voce pretende manter o investimento. Lembre-se de que quanto maior o prazo, maior sera o efeito dos juros compostos sobre o seu dinheiro.</li>
            <li><strong>Clique em Calcular:</strong> A calculadora exibira o montante final, o total investido, o total ganho em juros e uma tabela com a evolucao mes a mes do seu patrimonio.</li>
          </ol>
          <p className="mt-3">
            A tabela de evolucao mensal permite que voce acompanhe exatamente como o seu dinheiro cresce ao longo de cada periodo, mostrando quanto foi investido, quanto rendeu em juros e o saldo total acumulado.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo dos Juros Compostos</h2>
          <p className="mb-3">
            Os juros compostos sao considerados a oitava maravilha do mundo por muitos investidores, e com razao. Diferente dos juros simples, onde a taxa incide apenas sobre o capital inicial, nos juros compostos voce ganha rendimentos sobre o valor principal <strong>mais</strong> todos os juros ja acumulados. Isso cria um efeito de crescimento exponencial.
          </p>
          <p className="mb-3">
            A formula classica dos juros compostos e: <strong>M = C x (1 + i)^n</strong>, onde M representa o montante final, C e o capital inicial, i e a taxa de juros por periodo e n e o numero de periodos. Quando ha aportes mensais regulares, a formula se expande para incluir o calculo de anuidade: <strong>M = C x (1 + i)^n + PMT x [(1 + i)^n - 1] / i</strong>, onde PMT e o valor do aporte mensal.
          </p>
          <p className="mb-3">
            Na pratica, o que torna os juros compostos tao poderosos e o fator tempo. Nos primeiros meses, a diferenca entre juros simples e compostos e pequena. Porem, conforme os meses e anos passam, a curva de crescimento acelera significativamente. Por exemplo, R$ 10.000 investidos a 1% ao mes rendem R$ 1.200 em juros simples apos 12 meses. Ja com juros compostos, o rendimento seria de R$ 1.268,25 — uma diferenca que se amplifica exponencialmente em prazos maiores.
          </p>
          <p>
            Entender essa mecanica e fundamental para tomar decisoes financeiras inteligentes, seja para escolher entre diferentes investimentos, planejar a aposentadoria ou calcular o custo real de um emprestimo.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre juros simples e juros compostos?</summary>
              <p className="px-4 pb-4 text-gray-600">Nos juros simples, a taxa incide sempre sobre o capital inicial. Por exemplo, R$ 1.000 a 1% ao mes rendem sempre R$ 10 por mes. Nos juros compostos, a taxa incide sobre o capital acumulado (capital + juros anteriores), gerando o famoso efeito de &quot;juros sobre juros&quot;. No longo prazo, essa diferenca se torna enorme.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como converter taxa anual para mensal?</summary>
              <p className="px-4 pb-4 text-gray-600">A conversao exata usa a formula: taxa mensal = (1 + taxa anual)^(1/12) - 1. Por exemplo, uma taxa anual de 12% equivale a aproximadamente 0,949% ao mes, e nao 1%. Para uma aproximacao rapida, divida a taxa anual por 12, mas saiba que o resultado sera ligeiramente impreciso.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A calculadora considera a inflacao?</summary>
              <p className="px-4 pb-4 text-gray-600">Nao. Esta calculadora trabalha com valores nominais. Para considerar a inflacao, voce pode utilizar a taxa de juros real (taxa nominal menos a inflacao). Por exemplo, se seu investimento rende 1% ao mes e a inflacao e de 0,4% ao mes, use 0,6% como taxa para ter uma projecao mais realista do poder de compra.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Quais investimentos usam juros compostos?</summary>
              <p className="px-4 pb-4 text-gray-600">A maioria dos investimentos utiliza juros compostos: CDB, LCI, LCA, Tesouro Direto, fundos de investimento e ate a poupanca. A diferenca esta na taxa oferecida, no prazo e na tributacao. CDBs de bancos digitais, por exemplo, costumam oferecer 100% do CDI ou mais. Ja a poupanca segue regras da Lei 12.703/2012: quando a Selic esta igual ou abaixo de 8,5% ao ano, rende 70% da Selic + TR; quando a Selic esta acima de 8,5% ao ano, rende 0,5% ao mes + TR (regra fixa antiga).</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Os aportes mensais fazem tanta diferenca assim?</summary>
              <p className="px-4 pb-4 text-gray-600">Sim, aportes regulares sao um dos fatores mais importantes para o crescimento do patrimonio. Investir R$ 500 por mes a 1% ao mes durante 10 anos resulta em mais de R$ 115.000, dos quais mais de R$ 55.000 sao apenas juros. A constancia dos aportes, combinada com o tempo, e o verdadeiro motor da construcao de riqueza.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A calculadora desconta o Imposto de Renda?</summary>
              <p className="px-4 pb-4 text-gray-600">Nao. O resultado apresentado e bruto, sem desconto de impostos. No Brasil, a maioria dos investimentos de renda fixa segue a tabela regressiva do IR: 22,5% ate 180 dias, 20% de 181 a 360 dias, 17,5% de 361 a 720 dias e 15% acima de 720 dias. Investimentos como LCI, LCA e poupanca sao isentos de IR para pessoa fisica.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso usar esta calculadora para financiamentos?</summary>
              <p className="px-4 pb-4 text-gray-600">Voce pode usa-la para entender como os juros compostos afetam dividas e financiamentos. Basta inserir o valor da divida como capital inicial e a taxa de juros cobrada. No entanto, financiamentos possuem particularidades como amortizacao e seguros que exigem uma calculadora especifica de financiamento para resultados precisos.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas e Exemplos do Dia a Dia</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Comece cedo:</strong> Alguem que investe R$ 300 por mes dos 20 aos 60 anos acumula muito mais do que quem investe R$ 600 por mes dos 40 aos 60, mesmo investindo o dobro do valor mensal. O tempo e o maior aliado dos juros compostos.</li>
            <li><strong>Reinvista os rendimentos:</strong> Nao resgate os juros gerados. Deixe-os trabalhando a seu favor. Esse e o principio fundamental dos juros compostos e a chave para o crescimento exponencial.</li>
            <li><strong>Cuidado com dividas:</strong> Os juros compostos funcionam contra voce quando se trata de dividas. O cartao de credito no Brasil cobra juros compostos que podem passar de 15% ao mes, transformando uma divida pequena em um valor impagavel rapidamente.</li>
            <li><strong>Compare investimentos:</strong> Use a calculadora para comparar diferentes cenarios. Teste taxas de 0,5%, 0,8% e 1% ao mes com o mesmo capital e prazo para visualizar o impacto real de escolher um investimento com rendimento superior.</li>
            <li><strong>Regra dos 72:</strong> Para estimar rapidamente em quanto tempo seu dinheiro dobra, divida 72 pela taxa de juros. A 1% ao mes, seu dinheiro dobra em aproximadamente 72 meses (6 anos). A 0,5% ao mes, em 144 meses (12 anos).</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
