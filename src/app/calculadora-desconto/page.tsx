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

      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Desconto</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Nossa calculadora de desconto oferece tres modos de uso para atender diferentes necessidades. Veja como utilizar cada um:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Modo &quot;Calcular Desconto&quot;:</strong> Insira o preco original do produto e a porcentagem de desconto. A calculadora mostra instantaneamente o preco final, o valor economizado e o preco original riscado. Voce tambem pode usar os botoes de desconto rapido (5%, 10%, 15%, 20%, etc.) para testar diferentes cenarios.</li>
            <li><strong>Modo &quot;Descobrir %&quot;:</strong> Informe o preco original e o preco final que voce encontrou. A calculadora revela qual a porcentagem de desconto real aplicada e quanto voce economiza. Perfeito para verificar se uma promocao e realmente vantajosa.</li>
            <li><strong>Modo &quot;Comparar Precos&quot;:</strong> Insira o preco e o desconto de dois produtos diferentes. A calculadora compara os precos finais e indica qual opcao e mais barata, mostrando exatamente quanto voce economiza escolhendo a melhor oferta.</li>
            <li><strong>Leia os resultados:</strong> Todos os valores sao exibidos em reais (R$) formatados no padrao brasileiro, com destaque visual para facilitar a leitura rapida dos resultados.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o Calculo de Desconto</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>O calculo de desconto em porcentagem segue uma formula matematica simples que nossa calculadora aplica automaticamente. Entender essa formula ajuda a fazer contas rapidas mesmo sem a ferramenta:</p>
          <p><strong>Formula basica:</strong> Preco Final = Preco Original - (Preco Original x Desconto / 100). Por exemplo, um produto de R$ 300,00 com 25% de desconto: 300 - (300 x 25 / 100) = 300 - 75 = R$ 225,00.</p>
          <p><strong>Formula inversa (descobrir a porcentagem):</strong> Desconto (%) = ((Preco Original - Preco Final) / Preco Original) x 100. Se um produto que custava R$ 400,00 esta por R$ 280,00: ((400 - 280) / 400) x 100 = 30%. O desconto real e de 30%.</p>
          <p>A calculadora executa esses calculos em tempo real conforme voce digita os valores, sem necessidade de clicar em botoes. Os resultados sao atualizados instantaneamente, formatados em moeda brasileira usando a funcao nativa do JavaScript para formatacao de moeda (Intl.NumberFormat). Todo o processamento ocorre no seu navegador, sem envio de dados para servidores.</p>
          <p>No modo de comparacao, o sistema calcula o preco final de cada produto independentemente e depois compara os resultados, destacando visualmente qual opcao oferece o menor preco final, independentemente do preco original ou da porcentagem de desconto de cada um.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Como saber se um desconto e realmente bom?</summary>
            <p className="px-4 pb-4 text-gray-700">Um desconto e bom quando o preco final esta abaixo do valor medio praticado pelo mercado para aquele produto. Use o modo &quot;Descobrir %&quot; para verificar a porcentagem real do desconto. Descontos abaixo de 10% sao considerados pequenos para a maioria dos produtos. Na Black Friday, por exemplo, descontos reais geralmente ficam entre 15% e 40% — desconfie de ofertas que prometem 70% ou 80% de desconto em itens de alto valor.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Como calcular desconto sobre desconto (desconto progressivo)?</summary>
            <p className="px-4 pb-4 text-gray-700">Descontos progressivos nao sao somados diretamente. Por exemplo, 20% + 10% nao e 30%. O correto e aplicar o primeiro desconto e depois aplicar o segundo sobre o valor ja reduzido. Um produto de R$ 100 com 20% + 10%: primeiro fica R$ 80,00 (20% de desconto), depois R$ 72,00 (10% sobre R$ 80). O desconto total real e de 28%, nao 30%. Use nossa calculadora duas vezes para simular esse cenario.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Para que serve o modo de comparar precos?</summary>
            <p className="px-4 pb-4 text-gray-700">O modo de comparacao e ideal para decidir entre duas ofertas diferentes. Por exemplo, se uma loja vende um produto por R$ 500 com 30% de desconto e outra vende o mesmo produto por R$ 450 com 20% de desconto, qual compensa mais? A calculadora mostra que o primeiro fica R$ 350 e o segundo R$ 360 — o primeiro e mais vantajoso, apesar do preco original ser maior.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso usar a calculadora para calcular margem de lucro?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim, de forma indireta. Se voce sabe o custo de um produto e quer vende-lo com uma margem de lucro, use o modo &quot;Descobrir %&quot; colocando o preco de venda como &quot;original&quot; e o custo como &quot;final&quot;. Isso mostra a porcentagem de margem. Para calcular o preco de venda a partir de uma margem desejada, use o modo &quot;Calcular Desconto&quot; invertendo a logica.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Os valores que eu digito sao salvos ou enviados para algum lugar?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. Todos os calculos sao realizados localmente no seu navegador. Nenhum dado e armazenado, salvo em cookies ou enviado para servidores. Ao fechar ou recarregar a pagina, todos os valores digitados sao apagados automaticamente.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">A calculadora funciona com centavos?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. Voce pode inserir valores com casas decimais, como R$ 199,90 ou R$ 49,99. Use o ponto (.) como separador decimal ao digitar. Os resultados sao formatados automaticamente no padrao brasileiro com virgula e duas casas decimais.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Qual a formula para calcular o preco original a partir do preco com desconto?</summary>
            <p className="px-4 pb-4 text-gray-700">Para descobrir o preco original quando voce sabe o preco final e a porcentagem de desconto, use a formula: Preco Original = Preco Final / (1 - Desconto/100). Exemplo: se um produto esta por R$ 150,00 com 25% de desconto, o original era: 150 / (1 - 0,25) = 150 / 0,75 = R$ 200,00.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>A calculadora de desconto e uma aliada em diversas situacoes do dia a dia. Confira cenarios praticos onde ela brilha:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Black Friday e promocoes sazonais:</strong> Use o modo &quot;Descobrir %&quot; para verificar se o desconto anunciado e real. Compare o preco atual com o historico para garantir que nao e o famoso &quot;metade do dobro&quot;.</li>
            <li><strong>Compras no atacado:</strong> Compare o preco unitario com desconto de quantidade versus o preco no varejo usando o modo &quot;Comparar Precos&quot; para decidir se compensa comprar em maior volume.</li>
            <li><strong>Negociacoes comerciais:</strong> Ao negociar precos com fornecedores, use a calculadora para simular diferentes cenarios de desconto e encontrar rapidamente o ponto ideal de preco.</li>
            <li><strong>Cupons de desconto:</strong> Quando tiver multiplos cupons com porcentagens diferentes, use a calculadora para descobrir qual oferece a maior economia real em reais.</li>
            <li><strong>Planejamento de orcamento:</strong> Simule quanto economizaria aproveitando promocoes para compras planejadas e decida o melhor momento para comprar.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
