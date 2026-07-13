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
          <p>A calculadora possui tres modos independentes, cada um voltado para um tipo diferente de conta com descontos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Modo &quot;Calcular Desconto&quot;:</strong> Informe o preco de etiqueta e a porcentagem do desconto. A calculadora exibe o preco final, a economia em reais e o preco original riscado. Os botoes de desconto rapido (5% a 70%) permitem simular cenarios sem redigitar valores — util para testar faixas de negociacao.</li>
            <li><strong>Modo &quot;Descobrir %&quot;:</strong> Digite o preco original e o preco que voce encontrou na loja. O resultado mostra a porcentagem real de desconto aplicada. Exemplo: um tenis de R$ 349,90 por R$ 244,93 tem exatamente 30% de desconto.</li>
            <li><strong>Modo &quot;Comparar Precos&quot;:</strong> Preencha preco e desconto de dois produtos lado a lado. A calculadora aponta qual oferta resulta no menor preco final e mostra a diferenca em reais. Essencial quando duas lojas vendem o mesmo item com precos e descontos diferentes.</li>
          </ul>
          <p>Todos os valores aparecem formatados em reais (R$) no padrao brasileiro. Os calculos atualizam em tempo real conforme voce digita — nao ha botao &quot;calcular&quot; para clicar.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo de Desconto</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p><strong>Formula basica:</strong> Preco Final = Preco Original x (1 - Desconto / 100). Um produto de R$ 199,90 com 30% de desconto: 199,90 x 0,70 = R$ 139,93. A economia e de R$ 59,97.</p>
          <p><strong>Formula inversa:</strong> Desconto (%) = ((Preco Original - Preco Final) / Preco Original) x 100. Se um notebook que custava R$ 4.200 esta por R$ 3.150: ((4200 - 3150) / 4200) x 100 = 25%. O desconto real e de 25%.</p>
          <p><strong>Desconto sobre desconto (cascata):</strong> Quando uma loja aplica 20% de desconto e voce ainda tem um cupom de 10%, o desconto total nao e 30%. O calculo correto e: primeiro aplica-se 20% sobre o preco cheio, depois 10% sobre o valor ja reduzido. Exemplo: produto de R$ 200 com 20% fica R$ 160; o cupom de 10% sobre R$ 160 resulta em R$ 144. O desconto total real e 28%, nao 30%. Essa diferenca cresce com valores maiores — em um produto de R$ 2.000, sao R$ 40 a menos de economia do que o esperado.</p>
          <p><strong>Preco original a partir do final:</strong> Se voce sabe que pagou R$ 150 com 25% de desconto, o preco original era: 150 / (1 - 0,25) = 150 / 0,75 = R$ 200. Essa conta e util para verificar se o &quot;preco antigo&quot; exibido pela loja e real.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Como identificar o &quot;metade do dobro&quot; na Black Friday?</summary>
            <p className="px-4 pb-4 text-gray-700">Use o modo &quot;Descobrir %&quot; para calcular o desconto real. Se uma loja anuncia &quot;50% OFF&quot; mas o preco original parece inflado, compare com o historico do produto em sites como Buscape ou Google Shopping. Descontos reais na Black Friday brasileira ficam tipicamente entre 15% e 40% para eletronicos. Descontos acima de 60% em produtos de alto valor merecem desconfianca.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Como calcular desconto sobre desconto corretamente?</summary>
            <p className="px-4 pb-4 text-gray-700">Descontos em cascata nunca sao somados. Use a calculadora duas vezes: primeiro calcule o preco com o primeiro desconto, depois use esse resultado como preco original para aplicar o segundo desconto. Exemplo pratico: celular de R$ 3.000 com 15% na loja + cupom de 5%. Primeiro: R$ 3.000 com 15% = R$ 2.550. Segundo: R$ 2.550 com 5% = R$ 2.422,50. O desconto total e 19,25%, nao 20%.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Desconto de 50% e melhor que &quot;pague 1 leve 2&quot;?</summary>
            <p className="px-4 pb-4 text-gray-700">Dependem da mesma matematica. &quot;Pague 1 leve 2&quot; equivale a 50% de desconto no preco unitario — mas so se voce realmente precisa de duas unidades. Se voce so precisa de uma, 50% de desconto em uma unidade e mais vantajoso porque voce gasta metade do valor total. Use o modo &quot;Comparar Precos&quot; colocando o preco de 1 unidade com 50% contra o preco de 2 unidades sem desconto dividido por 2.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso usar para calcular margem de lucro?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim, com uma adaptacao. Coloque o preco de venda como &quot;Preco Original&quot; e o custo como &quot;Preco Final&quot; no modo &quot;Descobrir %&quot;. O resultado mostra a margem sobre o preco de venda (markup). Exemplo: custo de R$ 60 e venda a R$ 100 resulta em 40% de margem. Atencao: margem sobre venda e diferente de margem sobre custo (que seria 66,7% neste caso).</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">A calculadora funciona com centavos?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. Use o ponto (.) como separador decimal ao digitar: 199.90, 49.99, etc. Os resultados sao formatados automaticamente com virgula e duas casas decimais no padrao brasileiro (R$ 139,93). O calculo e preciso ate a segunda casa decimal.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Desconto em porcentagem ou em reais: qual e maior?</summary>
            <p className="px-4 pb-4 text-gray-700">Depende do preco do produto. Um cupom de &quot;R$ 50 de desconto&quot; e melhor que &quot;10% OFF&quot; em produtos abaixo de R$ 500, mas pior em produtos acima desse valor. No exato ponto de R$ 500, os dois sao iguais. Use a calculadora para comparar: aplique os 10% e veja se a economia em reais e maior ou menor que R$ 50.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Black Friday e datas sazonais:</strong> Antes de comprar, anote o preco do produto 2-3 semanas antes. No dia da promocao, use o modo &quot;Descobrir %&quot; com o preco original real (nao o da etiqueta) para calcular o desconto verdadeiro. Muitas lojas aumentam o preco antes de &quot;dar desconto&quot;.</li>
            <li><strong>Compras parceladas vs. a vista:</strong> Se a loja oferece 10% de desconto a vista sobre um produto de R$ 1.200, voce paga R$ 1.080. Compare com o parcelamento: 12x de R$ 100 = R$ 1.200. A diferenca de R$ 120 pode render mais aplicada durante os 12 meses do que o desconto — depende da taxa de juros disponivel para voce.</li>
            <li><strong>Cashback combinado com desconto:</strong> Sites de cashback oferecem 3-8% de retorno. Um produto de R$ 500 com 20% de desconto fica R$ 400; com 5% de cashback sobre R$ 400, voce recebe R$ 20 de volta. O desconto efetivo total e 24%, nao 25%. Use a calculadora para conferir a economia real.</li>
            <li><strong>Negociacao com fornecedores:</strong> Ao receber uma proposta comercial, use o comparador para colocar o preco do fornecedor A contra o B, cada um com seus descontos por volume. A diferenca aparece em reais, facilitando a decisao.</li>
            <li><strong>Frete incluso vs. desconto:</strong> Uma loja oferece frete gratis (frete custaria R$ 25) e outra oferece 10% de desconto em um produto de R$ 200. Com 10%, voce economiza R$ 20 mas paga R$ 25 de frete: gasta R$ 205 no total. Na primeira loja, paga R$ 200. O frete gratis vence. Use a calculadora para tirar essa duvida rapidamente.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
