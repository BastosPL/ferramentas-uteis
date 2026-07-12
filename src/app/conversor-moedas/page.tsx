"use client";

import { useState, useEffect } from "react";
import ToolPage from "../components/ToolPage";

const MOEDAS = [
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "USD", name: "Dolar Americano", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧" },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "JPY", name: "Iene Japones", flag: "🇯🇵" },
  { code: "CAD", name: "Dolar Canadense", flag: "🇨🇦" },
  { code: "AUD", name: "Dolar Australiano", flag: "🇦🇺" },
  { code: "CHF", name: "Franco Suico", flag: "🇨🇭" },
  { code: "CNY", name: "Yuan Chines", flag: "🇨🇳" },
];

type Cotacoes = Record<string, number>;

export default function ConversorMoedas() {
  const [de, setDe] = useState("USD");
  const [para, setPara] = useState("BRL");
  const [valor, setValor] = useState("1");
  const [cotacoes, setCotacoes] = useState<Cotacoes | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");

  useEffect(() => {
    async function buscarCotacoes() {
      setCarregando(true);
      setErro("");
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error("Falha ao buscar cotacoes");
        const data = await res.json();
        setCotacoes(data.rates);
        setUltimaAtualizacao(new Date().toLocaleString("pt-BR"));
      } catch {
        setCotacoes({
          BRL: 5.45, USD: 1, EUR: 0.92, GBP: 0.79, ARS: 950,
          JPY: 156.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.24,
        });
        setUltimaAtualizacao("Cotacoes estimadas (sem conexao) — valores de referencia, nao use para transacoes financeiras");
      }
      setCarregando(false);
    }
    buscarCotacoes();
  }, []);

  const converter = () => {
    if (!cotacoes || !valor) return 0;
    const v = parseFloat(valor) || 0;
    const taxaDe = cotacoes[de] || 1;
    const taxaPara = cotacoes[para] || 1;
    return (v / taxaDe) * taxaPara;
  };

  const resultado = converter();

  return (
    <ToolPage
      title="Conversor de Moedas"
      description="Converta moedas com cotacao atualizada. Dolar, Euro, Libra e mais."
      accent="emerald"
      icon="💱"
      slug="conversor-moedas"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        {carregando ? (
          <p className="text-center text-gray-500 py-8">Carregando cotacoes...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">De</label>
                <select value={de} onChange={(e) => setDe(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-2">
                  {MOEDAS.map((m) => (
                    <option key={m.code} value={m.code}>{m.flag} {m.code} - {m.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
              </div>

              <button
                onClick={() => { const temp = de; setDe(para); setPara(temp); }}
                className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 self-center cursor-pointer"
              >
                ⇄
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Para</label>
                <select value={para} onChange={(e) => setPara(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-2">
                  {MOEDAS.map((m) => (
                    <option key={m.code} value={m.code}>{m.flag} {m.code} - {m.name}</option>
                  ))}
                </select>
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-lg font-bold text-emerald-800">
                  {resultado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {para}
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              1 {de} = {((cotacoes?.[para] || 1) / (cotacoes?.[de] || 1)).toLocaleString("pt-BR", { minimumFractionDigits: 4 })} {para}
            </p>
            {ultimaAtualizacao && (
              <p className="text-center text-xs text-gray-400 mt-1">Atualizado: {ultimaAtualizacao}</p>
            )}
            <p className="text-center text-xs text-gray-400 mt-2">
              Cotacoes fornecidas pela{" "}
              <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">ExchangeRate-API</a>.
              Dados apenas informativos — nao utilize como confirmacao do valor final de uma operacao financeira.
            </p>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cotacoes Principais</h2>
        {cotacoes && (
          <div className="grid md:grid-cols-2 gap-3">
            {MOEDAS.filter((m) => m.code !== "BRL").map((m) => {
              const taxaBRL = (cotacoes["BRL"] || 5.45) / (cotacoes[m.code] || 1);
              return (
                <div key={m.code} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-900">{m.flag} {m.code}</span>
                  <span className="font-mono text-sm font-medium text-gray-900">R$ {taxaBRL.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editorial Content for SEO */}
      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Conversor de Moedas</h2>
          <p className="mb-3">
            Utilizar nosso conversor de moedas e simples e rapido. Siga o passo a passo abaixo para converter qualquer valor entre as moedas disponiveis:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Selecione a moeda de origem:</strong> No campo &quot;De&quot;, escolha a moeda que voce possui ou deseja converter. Por exemplo, se voce tem dolares americanos, selecione USD.</li>
            <li><strong>Selecione a moeda de destino:</strong> No campo &quot;Para&quot;, escolha a moeda para a qual deseja converter. Para ver o valor em reais, selecione BRL.</li>
            <li><strong>Digite o valor:</strong> Informe a quantia que deseja converter no campo numerico. Voce pode digitar valores com centavos.</li>
            <li><strong>Veja o resultado instantaneamente:</strong> O valor convertido aparece automaticamente no campo verde, sem necessidade de clicar em nenhum botao.</li>
            <li><strong>Inverta as moedas:</strong> Use o botao de setas (&#8644;) no centro para trocar rapidamente a moeda de origem pela de destino.</li>
          </ol>
          <p className="mt-3">
            Abaixo do resultado, voce encontra a taxa de cambio unitaria (quanto vale 1 unidade da moeda de origem na moeda de destino) e o horario da ultima atualizacao das cotacoes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Conversao de Moedas</h2>
          <p className="mb-3">
            O conversor utiliza cotacoes atualizadas obtidas a partir da ExchangeRate-API (open.er-api.com). Quando voce acessa a pagina, o sistema busca automaticamente as taxas de cambio mais recentes com base no dolar americano (USD) como moeda de referencia. As cotacoes refletem o ultimo valor publicado pela fonte, nao um feed de mercado ao vivo.
          </p>
          <p className="mb-3">
            O calculo de conversao segue o metodo de taxa cruzada (cross rate). Primeiro, o valor informado e convertido de volta para dolares usando a cotacao da moeda de origem. Em seguida, esse valor em dolares e multiplicado pela cotacao da moeda de destino. A formula e:
          </p>
          <p className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm mb-3">
            Resultado = (Valor / Taxa da moeda de origem) x Taxa da moeda de destino
          </p>
          <p className="mb-3">
            Por exemplo, para converter 100 euros para reais: o sistema divide 100 pela cotacao do euro em relacao ao dolar e, em seguida, multiplica pela cotacao do real em relacao ao dolar. Esse metodo garante precisao mesmo entre moedas que nao sao negociadas diretamente entre si.
          </p>
          <p>
            Caso a API nao esteja disponivel por problemas de conexao, o sistema utiliza cotacoes aproximadas como fallback, garantindo que a ferramenta continue funcional. Nesse caso, um aviso e exibido informando que as cotacoes sao estimativas.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">Com que frequencia as cotacoes sao atualizadas?</summary>
              <p className="mt-2 text-gray-600">As cotacoes sao buscadas automaticamente ao abrir a pagina, a partir de uma API financeira que publica taxas atualizadas periodicamente. Nao se trata de um feed ao vivo de bolsa — para obter uma cotacao mais recente, recarregue a pagina.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">A cotacao mostrada e a mesma do banco ou casa de cambio?</summary>
              <p className="mt-2 text-gray-600">As cotacoes exibidas sao taxas de mercado (mid-market rate), que representam o ponto medio entre o preco de compra e venda. Bancos e casas de cambio aplicam spreads e taxas adicionais, entao o valor final pago pode ser diferente. Use nosso conversor como referencia para comparar ofertas.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">O conversor inclui criptomoedas?</summary>
              <p className="mt-2 text-gray-600">Nao. Este conversor e dedicado a moedas fiduciarias (Real, Dolar, Euro, etc.). Criptomoedas como Bitcoin possuem alta volatilidade e exigem fontes de dados especializadas. Uma ferramenta dedicada a criptomoedas podera ser disponibilizada no futuro.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">O conversor funciona offline?</summary>
              <p className="mt-2 text-gray-600">Parcialmente. Se a conexao com a internet falhar ao buscar as cotacoes, o conversor utiliza valores aproximados como fallback. Os resultados serao estimativas e nao refletirao a cotacao exata do momento. Um aviso sera exibido nessa situacao.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">Como saber qual moeda usar para viagens internacionais?</summary>
              <p className="mt-2 text-gray-600">Use o conversor para comparar o Real (BRL) com a moeda do pais de destino. Para viagens aos EUA, converta para USD; para Europa, para EUR. Lembre-se de que casas de cambio cobram spread sobre a cotacao de mercado, entao o valor real pago sera ligeiramente maior que o mostrado aqui.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">Por que o valor do dolar muda todo dia?</summary>
              <p className="mt-2 text-gray-600">O cambio e determinado pelo mercado, com base na oferta e demanda por cada moeda. Fatores como taxa de juros, balanca comercial, politica monetaria, cenario politico e fluxo de investimentos estrangeiros influenciam a variacao diaria. E normal que o dolar oscile alguns centavos por dia.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Conversao de Moedas</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Compare antes de comprar moeda:</strong> Verifique a cotacao de mercado aqui e depois compare com o preco oferecido por bancos e casas de cambio. A diferenca entre os dois e o spread — quanto menor, melhor para voce.</li>
            <li><strong>Atencao ao IOF:</strong> Compras de moeda estrangeira no Brasil estao sujeitas ao IOF (Imposto sobre Operacoes Financeiras). Esse imposto nao esta incluso na cotacao de mercado e varia conforme o tipo de operacao (cartao, especie, remessa).</li>
            <li><strong>Planeje compras parceladas:</strong> Se vai viajar, considere comprar moeda estrangeira aos poucos ao longo das semanas. Isso dilui o risco de pegar uma cotacao desfavoravel em um unico dia.</li>
            <li><strong>Peso Argentino em alta volatilidade:</strong> O Peso Argentino (ARS) sofre desvalorizacoes frequentes. Se voce esta viajando para a Argentina, pesquise tambem a cotacao do &quot;dolar blue&quot; (mercado paralelo), que costuma ser diferente da cotacao oficial.</li>
            <li><strong>Compras internacionais:</strong> Para compras em sites estrangeiros (AliExpress, Amazon EUA), use o conversor para ter nocao do preco real em reais antes de finalizar o pedido, considerando o frete e impostos de importacao.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
