"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

export default function CalculadoraPorcentagem() {
  const [v1a, setV1a] = useState("");
  const [v1b, setV1b] = useState("");
  const [v2a, setV2a] = useState("");
  const [v2b, setV2b] = useState("");
  const [v3a, setV3a] = useState("");
  const [v3b, setV3b] = useState("");
  const [v4a, setV4a] = useState("");
  const [v4b, setV4b] = useState("");

  const r1 = v1a && v1b ? (parseFloat(v1a) / 100) * parseFloat(v1b) : null;
  const r2 = v2a && v2b ? ((parseFloat(v2a) / parseFloat(v2b)) * 100) : null;
  const r3 = v3a && v3b ? parseFloat(v3a) * (1 + parseFloat(v3b) / 100) : null;
  const r4 = v4a && v4b ? parseFloat(v4a) * (1 - parseFloat(v4b) / 100) : null;

  const fmt = (n: number | null) => n !== null ? n.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : "—";

  return (
    <ToolPage title="Calculadora de Porcentagem" description="Calcule porcentagens de forma rapida e facil. Descubra quanto e X% de um valor, calcule aumentos, descontos e a porcentagem entre dois numeros." accent="indigo" icon="💯" slug="calculadora-porcentagem">

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Quanto e X% de Y?</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span>Quanto e</span>
            <input type="number" value={v1a} onChange={(e) => setV1a(e.target.value)} placeholder="10" className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>% de</span>
            <input type="number" value={v1b} onChange={(e) => setV1b(e.target.value)} placeholder="200" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>=</span>
            <span className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 font-bold text-indigo-800 min-w-[80px] text-center">{fmt(r1)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">X e quantos % de Y?</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={v2a} onChange={(e) => setV2a(e.target.value)} placeholder="25" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>e quantos % de</span>
            <input type="number" value={v2b} onChange={(e) => setV2b(e.target.value)} placeholder="200" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>=</span>
            <span className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 font-bold text-indigo-800 min-w-[80px] text-center">{fmt(r2)}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Aumento de X%</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={v3a} onChange={(e) => setV3a(e.target.value)} placeholder="100" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>com aumento de</span>
            <input type="number" value={v3b} onChange={(e) => setV3b(e.target.value)} placeholder="15" className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>% =</span>
            <span className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 font-bold text-green-800 min-w-[80px] text-center">{fmt(r3)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Desconto de X%</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={v4a} onChange={(e) => setV4a(e.target.value)} placeholder="100" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>com desconto de</span>
            <input type="number" value={v4b} onChange={(e) => setV4b(e.target.value)} placeholder="20" className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>% =</span>
            <span className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 font-bold text-red-800 min-w-[80px] text-center">{fmt(r4)}</span>
          </div>
        </div>
      </div>

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Porcentagem</h2>
          <p className="mb-3">
            Nossa calculadora de porcentagem oferece quatro modos de calculo diferentes para cobrir todas as situacoes do dia a dia. Cada modo funciona de forma independente e o resultado aparece automaticamente conforme voce digita os valores:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Quanto e X% de Y:</strong> Use este modo quando precisa descobrir o valor absoluto de uma porcentagem. Por exemplo, para saber quanto e 15% de R$ 200, digite 15 no primeiro campo e 200 no segundo. O resultado (30) aparece instantaneamente. Ideal para calcular gorjetas, comissoes e impostos.</li>
            <li><strong>X e quantos % de Y:</strong> Use este modo para descobrir a relacao percentual entre dois numeros. Por exemplo, se voce acertou 18 questoes em uma prova de 25, digite 18 e 25 para descobrir que isso equivale a 72%. Perfeito para calcular taxas de aproveitamento, conversao e desempenho.</li>
            <li><strong>Aumento de X%:</strong> Informe o valor original e a porcentagem de aumento para descobrir o valor final. Por exemplo, um salario de R$ 3.000 com aumento de 8% resulta em R$ 3.240. Util para reajustes salariais, correcoes inflacionarias e aumentos de preco.</li>
            <li><strong>Desconto de X%:</strong> Informe o valor original e a porcentagem de desconto para ver o preco final. Por exemplo, um produto de R$ 150 com 20% de desconto sai por R$ 120. Essencial para compras em promocoes, Black Friday e negociacoes.</li>
          </ul>
          <p className="mt-3">
            Todos os calculos sao realizados em tempo real no seu navegador. Basta digitar os numeros e o resultado aparece automaticamente, sem necessidade de clicar em nenhum botao. Os valores aceitam casas decimais para maior precisao.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o Calculo de Porcentagem</h2>
          <p className="mb-3">
            A palavra &quot;porcentagem&quot; vem do latim &quot;per centum&quot;, que significa &quot;por cento&quot; ou &quot;a cada cem&quot;. Porcentagem e uma forma de expressar uma proporcao em relacao a 100. Quando dizemos 25%, estamos dizendo 25 partes de cada 100.
          </p>
          <p className="mb-3">
            A formula basica da porcentagem e: <strong>Porcentagem = (Parte / Todo) x 100</strong>. Para encontrar quanto e X% de um valor, a formula inversa e: <strong>Resultado = Valor x (X / 100)</strong>. Essa matematica simples e a base de todas as operacoes percentuais.
          </p>
          <p className="mb-3">
            Para calculos de aumento, a formula e: <strong>Valor Final = Valor Original x (1 + Porcentagem / 100)</strong>. O fator multiplicador (1 + P/100) e chamado de &quot;fator de aumento&quot;. Por exemplo, um aumento de 12% usa o fator 1,12. Para desconto, a logica e semelhante: <strong>Valor Final = Valor Original x (1 - Porcentagem / 100)</strong>, usando o &quot;fator de desconto&quot;.
          </p>
          <p className="mb-3">
            Um conceito importante e a diferenca entre porcentagem e pontos percentuais. Se uma taxa sobe de 10% para 12%, ela aumentou 2 pontos percentuais, mas o aumento relativo foi de 20% (porque 2 e 20% de 10). Essa distincao e fundamental em contextos financeiros e estatisticos, e confundi-los e um erro comum.
          </p>
          <p className="mb-3">
            Outro ponto relevante e o calculo de porcentagens compostas. Quando aplicamos aumentos ou descontos sucessivos, nao podemos simplesmente somar as porcentagens. Um aumento de 10% seguido de outro aumento de 10% nao resulta em 20% de aumento, mas sim em 21% (1,10 x 1,10 = 1,21). Da mesma forma, um aumento de 50% seguido de um desconto de 50% nao volta ao valor original: R$ 100 + 50% = R$ 150; R$ 150 - 50% = R$ 75.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como calcular porcentagem na calculadora comum?</summary>
              <p className="px-4 pb-3 text-sm">Na calculadora comum do celular ou computador, para calcular X% de um valor, multiplique o valor por X e divida por 100. Por exemplo, 18% de 450: digite 450 x 18 / 100 = 81. Algumas calculadoras possuem a tecla %, que simplifica: digite 450 x 18% e o resultado aparece diretamente. Nossa calculadora online elimina essa necessidade, fazendo tudo automaticamente.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como calcular desconto em cima de desconto?</summary>
              <p className="px-4 pb-3 text-sm">Descontos sucessivos nao se somam aritmeticamente. Para calcular, aplique cada desconto separadamente sobre o resultado anterior. Exemplo: produto de R$ 200 com 20% + 10% de desconto. Primeiro desconto: R$ 200 x 0,80 = R$ 160. Segundo desconto: R$ 160 x 0,90 = R$ 144. O desconto total nao foi 30%, mas sim 28% (1 - 0,80 x 0,90 = 1 - 0,72 = 0,28). Use nossa calculadora de desconto duas vezes para verificar.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre porcentagem e pontos percentuais?</summary>
              <p className="px-4 pb-3 text-sm">Porcentagem expressa uma proporcao relativa, enquanto pontos percentuais medem a diferenca absoluta entre duas porcentagens. Se o desemprego sobe de 8% para 10%, subiu 2 pontos percentuais, mas o aumento relativo foi de 25% (2/8 = 0,25). Na midia e na economia, essa distincao e crucial para interpretar dados corretamente.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como calcular a porcentagem de aumento salarial?</summary>
              <p className="px-4 pb-3 text-sm">Para descobrir o percentual de aumento entre dois salarios, use a formula: ((Salario Novo - Salario Antigo) / Salario Antigo) x 100. Exemplo: salario antigo R$ 2.500, novo R$ 2.800. Aumento = ((2800 - 2500) / 2500) x 100 = 12%. Voce pode usar o modo &quot;X e quantos % de Y&quot; da nossa calculadora: digite 300 (a diferenca) e 2500 (o salario antigo) para obter 12%.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como calcular juros simples com porcentagem?</summary>
              <p className="px-4 pb-3 text-sm">Juros simples e calculado com a formula: Juros = Capital x Taxa x Tempo. Por exemplo, R$ 5.000 a 2% ao mes durante 6 meses: Juros = 5000 x 0,02 x 6 = R$ 600. O valor total sera R$ 5.600. Use o modo &quot;Quanto e X% de Y&quot; para calcular os juros de cada periodo e multiplique pelo numero de periodos.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como transformar fracao em porcentagem?</summary>
              <p className="px-4 pb-3 text-sm">Para converter uma fracao em porcentagem, divida o numerador pelo denominador e multiplique por 100. Exemplo: 3/8 = 0,375 x 100 = 37,5%. Na nossa calculadora, use o modo &quot;X e quantos % de Y&quot;, digitando 3 e 8 para obter 37,5% diretamente. O caminho inverso tambem e simples: 75% = 75/100 = 3/4.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como calcular a margem de lucro?</summary>
              <p className="px-4 pb-3 text-sm">A margem de lucro e calculada por: ((Preco de Venda - Custo) / Preco de Venda) x 100. Exemplo: produto vendido por R$ 80, custo de R$ 50. Margem = ((80 - 50) / 80) x 100 = 37,5%. Cuidado para nao confundir com markup (acrescimo sobre o custo): o markup seria ((80 - 50) / 50) x 100 = 60%. Sao calculos diferentes com resultados diferentes.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas de Porcentagem no Dia a Dia</h2>
          <p className="mb-3">
            A porcentagem esta presente em inumeras situacoes cotidianas. Veja como aplica-la de forma pratica:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Gorjeta em restaurantes:</strong> Para calcular 10% de gorjeta rapidamente, basta mover a virgula uma casa para a esquerda. Conta de R$ 85,00: gorjeta de 10% = R$ 8,50. Para 15%, calcule 10% e some a metade desse valor: R$ 8,50 + R$ 4,25 = R$ 12,75.</li>
            <li><strong>Descontos em compras:</strong> Quando um produto esta com &quot;30% OFF&quot;, multiplique o preco por 0,70 para obter o valor final. Produto de R$ 249,90 com 30% de desconto: R$ 249,90 x 0,70 = R$ 174,93. Para comparar ofertas com descontos combinados (cashback, cupom e frete), a <a href="/calculadora-desconto" className="text-blue-600 hover:underline">Calculadora de Desconto</a> detalha o preco final.</li>
            <li><strong>Comparacao de precos:</strong> Para saber qual promocao e melhor (&quot;Leve 3, pague 2&quot; ou &quot;33% de desconto&quot;), calcule o preco unitario efetivo de cada opcao. &quot;Leve 3, pague 2&quot; equivale a 33,3% de desconto por unidade, ligeiramente melhor que 33%.</li>
            <li><strong>Imposto de Renda:</strong> As aliquotas do IR variam de 7,5% a 27,5%. Para estimar quanto sera descontado do seu salario bruto, use o modo &quot;Quanto e X% de Y&quot; com a aliquota da sua faixa de renda.</li>
            <li><strong>Rendimento de investimentos:</strong> Se um investimento rendeu 0,8% no mes, use o modo &quot;Aumento de X%&quot; para ver quanto seu saldo cresceu. Investimento de R$ 10.000 com rendimento de 0,8%: resultado = R$ 10.080.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
