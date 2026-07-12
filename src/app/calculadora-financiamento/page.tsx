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

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Financiamento</h2>
          <p className="mb-3">
            Simular um financiamento antes de assinar o contrato e uma das decisoes mais inteligentes que voce pode tomar. Com esta calculadora, voce consegue visualizar exatamente quanto vai pagar em cada parcela, quanto vai gastar com juros ao longo dos anos e qual sistema de amortizacao e mais vantajoso para o seu caso. Veja o passo a passo completo:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Escolha o sistema de amortizacao:</strong> clique em &quot;Tabela Price&quot; para parcelas fixas ou &quot;Tabela SAC&quot; para parcelas decrescentes. Se voce nao sabe qual escolher, simule os dois e compare.</li>
            <li><strong>Informe o valor total do bem:</strong> digite o preco total do imovel, veiculo ou qualquer bem que deseja financiar. Por exemplo, R$ 300.000 para um apartamento.</li>
            <li><strong>Preencha o valor da entrada:</strong> caso voce tenha um valor para dar de entrada, insira aqui. A entrada reduz o saldo devedor e, consequentemente, o total de juros pagos.</li>
            <li><strong>Defina a taxa de juros mensal:</strong> insira a taxa de juros mensal cobrada pelo banco. Valores tipicos variam de 0,50% a 1,20% ao mes para financiamentos imobiliarios. Se voce so tem a taxa anual, divida por 12 para obter a mensal aproximada.</li>
            <li><strong>Escolha o prazo em meses:</strong> informe o numero total de parcelas. Financiamentos imobiliarios geralmente vao de 120 (10 anos) a 420 meses (35 anos). Financiamentos de veiculos costumam ficar entre 12 e 60 meses.</li>
            <li><strong>Clique em &quot;Simular Financiamento&quot;:</strong> os resultados aparecem imediatamente, incluindo o resumo com primeira e ultima parcela, total pago, total em juros e a tabela completa mes a mes.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo: Tabela Price vs SAC</h2>
          <p className="mb-3">
            Os dois sistemas de amortizacao mais usados no Brasil sao a Tabela Price e a Tabela SAC. Entender a diferenca entre eles pode representar uma economia de dezenas de milhares de reais ao longo do financiamento.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Tabela Price (Sistema Frances)</h3>
          <p className="mb-3">
            Na Tabela Price, todas as parcelas tem o mesmo valor do inicio ao fim do contrato. Isso facilita o planejamento financeiro, pois voce sabe exatamente quanto vai pagar todo mes. A formula utilizada e: <strong>PMT = PV x [i x (1+i)^n] / [(1+i)^n - 1]</strong>, onde PV e o valor presente (saldo devedor), i e a taxa de juros mensal e n e o numero de parcelas. Apesar das parcelas serem fixas, a composicao delas muda ao longo do tempo: no inicio, a maior parte da parcela sao juros e uma pequena parte e amortizacao. Com o tempo, conforme o saldo devedor diminui, a parcela de juros cai e a amortizacao aumenta.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Tabela SAC (Sistema de Amortizacao Constante)</h3>
          <p className="mb-3">
            No SAC, a amortizacao e fixa em todas as parcelas (saldo devedor dividido pelo numero de meses). Como os juros incidem sobre o saldo devedor que diminui a cada mes, as parcelas sao decrescentes — comecam mais altas e vao diminuindo. A formula e mais simples: <strong>Amortizacao = PV / n</strong> e <strong>Juros do mes = Saldo devedor x i</strong>. O total de juros pagos no SAC e sempre menor do que na Price, porem as primeiras parcelas sao significativamente maiores, o que pode comprometer a renda no inicio do financiamento.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Comparacao pratica</h3>
          <p>
            Para um financiamento de R$ 240.000 a 0,75% ao mes em 360 meses: na Price, a parcela fixa fica em R$ 1.931,09 e o total de juros chega a aproximadamente R$ 455.192. No SAC, a primeira parcela fica em torno de R$ 2.467, mas a ultima parcela cai para apenas R$ 672, e o total de juros fica em torno de R$ 324.900. A diferenca e de aproximadamente R$ 130.000 em juros economizados com o SAC.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Qual a diferenca entre taxa de juros nominal e efetiva?</summary>
              <p className="mt-2">A taxa nominal e a taxa anunciada pelo banco, geralmente expressa ao ano. A taxa efetiva considera a capitalizacao dos juros (juros sobre juros) e e a que realmente incide sobre o financiamento. Por exemplo, uma taxa nominal de 9% ao ano corresponde a aproximadamente 0,75% ao mes, mas a taxa efetiva anual com capitalizacao mensal seria de 9,38%. Nesta calculadora, voce deve informar a taxa mensal efetiva para obter resultados precisos.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Price ou SAC: qual e melhor para mim?</summary>
              <p className="mt-2">Depende da sua situacao financeira atual. Se voce precisa de parcelas menores e previssiveis no inicio, a Price pode ser mais adequada. Se voce consegue arcar com parcelas maiores no comeco e quer economizar no total de juros, o SAC e a melhor opcao. A maioria dos especialistas financeiros recomenda o SAC para financiamentos de longo prazo, como imoveis, por causa da economia substancial em juros.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Vale a pena dar uma entrada maior?</summary>
              <p className="mt-2">Sim, quase sempre. Cada real dado de entrada reduz o saldo devedor, sobre o qual incidem os juros. Em um financiamento de 30 anos, dar R$ 10.000 a mais de entrada pode representar uma economia de R$ 30.000 a R$ 50.000 em juros ao longo do contrato. A recomendacao geral e dar pelo menos 20% do valor do imovel como entrada.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Como a amortizacao antecipada funciona?</summary>
              <p className="mt-2">Voce pode fazer pagamentos extras para reduzir o saldo devedor antes do prazo. Existem duas opcoes: reduzir o valor das parcelas futuras (mantendo o prazo) ou reduzir o prazo do financiamento (mantendo o valor da parcela). Reduzir o prazo geralmente gera uma economia maior em juros. O Codigo de Defesa do Consumidor garante o direito de antecipar parcelas com reducao proporcional dos juros.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Posso trocar de Price para SAC depois de contratar?</summary>
              <p className="mt-2">Sim, e possivel renegociar o sistema de amortizacao com o banco, mas isso pode envolver custos administrativos e uma nova analise de credito. O ideal e simular ambos os sistemas antes de assinar o contrato, usando esta calculadora, para tomar a decisao mais acertada desde o inicio.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">A calculadora considera o CET (Custo Efetivo Total)?</summary>
              <p className="mt-2">Esta calculadora utiliza a taxa de juros informada para simular as parcelas e o total de juros. O CET inclui outros custos como seguro, tarifa de administracao e taxa de avaliacao do imovel, que variam de banco para banco. Para uma comparacao completa entre propostas de diferentes bancos, considere solicitar o CET de cada um alem de usar esta simulacao como referencia.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Por que o saldo devedor demora a cair na Price?</summary>
              <p className="mt-2">Na Tabela Price, as primeiras parcelas sao compostas majoritariamente por juros. Em um financiamento tipico de 30 anos, nos primeiros 5 anos cerca de 80% a 90% de cada parcela vai para juros, e apenas 10% a 20% efetivamente abate o saldo devedor. Isso cria a sensacao de que a divida nao diminui. So apos a metade do prazo e que a amortizacao comeca a superar os juros em cada parcela.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas e Erros Comuns</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Nao confunda taxa mensal com anual:</strong> um dos erros mais comuns e colocar a taxa anual no campo de taxa mensal. Se o banco informou 9% ao ano, divida por 12 para obter aproximadamente 0,75% ao mes.</li>
            <li><strong>Considere sua renda futura:</strong> no SAC, as parcelas iniciais podem comprometer uma parte significativa da renda, mas elas diminuem com o tempo. Se voce espera crescimento salarial, o SAC pode ser ideal.</li>
            <li><strong>Compare bancos diferentes:</strong> a diferenca de 0,2% na taxa mensal pode parecer pequena, mas em 30 anos de financiamento, isso pode representar mais de R$ 50.000 de diferenca no total pago.</li>
            <li><strong>Use o FGTS estrategicamente:</strong> alem de usar o FGTS como entrada, voce pode utiliza-lo a cada 2 anos para amortizar o saldo devedor, reduzindo significativamente o custo total do financiamento.</li>
            <li><strong>Simule diferentes cenarios:</strong> use esta calculadora para comparar prazos diferentes. As vezes, reduzir o prazo de 360 para 300 meses aumenta pouco a parcela, mas economiza muitos milhares de reais em juros.</li>
            <li><strong>Atencao ao comprometimento de renda:</strong> a maioria dos bancos exige que a parcela nao ultrapasse 30% da renda bruta familiar. Considere isso ao definir o valor da entrada e o prazo.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
