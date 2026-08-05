"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type Categoria = {
  nome: string;
  unidades: { nome: string; sigla: string; fator: number }[];
};

const categorias: Categoria[] = [
  {
    nome: "Comprimento",
    unidades: [
      { nome: "Milimetro", sigla: "mm", fator: 0.001 },
      { nome: "Centimetro", sigla: "cm", fator: 0.01 },
      { nome: "Metro", sigla: "m", fator: 1 },
      { nome: "Quilometro", sigla: "km", fator: 1000 },
      { nome: "Polegada", sigla: "in", fator: 0.0254 },
      { nome: "Pe", sigla: "ft", fator: 0.3048 },
      { nome: "Jarda", sigla: "yd", fator: 0.9144 },
      { nome: "Milha", sigla: "mi", fator: 1609.344 },
    ],
  },
  {
    nome: "Peso/Massa",
    unidades: [
      { nome: "Miligrama", sigla: "mg", fator: 0.000001 },
      { nome: "Grama", sigla: "g", fator: 0.001 },
      { nome: "Quilograma", sigla: "kg", fator: 1 },
      { nome: "Tonelada", sigla: "t", fator: 1000 },
      { nome: "Onca", sigla: "oz", fator: 0.0283495 },
      { nome: "Libra", sigla: "lb", fator: 0.453592 },
    ],
  },
  {
    nome: "Temperatura",
    unidades: [
      { nome: "Celsius", sigla: "°C", fator: 0 },
      { nome: "Fahrenheit", sigla: "°F", fator: 0 },
      { nome: "Kelvin", sigla: "K", fator: 0 },
    ],
  },
  {
    nome: "Volume",
    unidades: [
      { nome: "Mililitro", sigla: "mL", fator: 0.001 },
      { nome: "Litro", sigla: "L", fator: 1 },
      { nome: "Metro cubico", sigla: "m³", fator: 1000 },
      { nome: "Galao (US)", sigla: "gal", fator: 3.78541 },
      { nome: "Onca fluida", sigla: "fl oz", fator: 0.0295735 },
      { nome: "Xicara", sigla: "cup", fator: 0.236588 },
    ],
  },
  {
    nome: "Area",
    unidades: [
      { nome: "Metro quadrado", sigla: "m²", fator: 1 },
      { nome: "Quilometro quadrado", sigla: "km²", fator: 1000000 },
      { nome: "Hectare", sigla: "ha", fator: 10000 },
      { nome: "Acre", sigla: "ac", fator: 4046.86 },
      { nome: "Pe quadrado", sigla: "ft²", fator: 0.092903 },
    ],
  },
  {
    nome: "Velocidade",
    unidades: [
      { nome: "Metro por segundo", sigla: "m/s", fator: 1 },
      { nome: "Quilometro por hora", sigla: "km/h", fator: 0.277778 },
      { nome: "Milha por hora", sigla: "mph", fator: 0.44704 },
      { nome: "No", sigla: "kn", fator: 0.514444 },
    ],
  },
];

function converterTemperatura(valor: number, de: string, para: string): number {
  let celsius: number;
  if (de === "°C") celsius = valor;
  else if (de === "°F") celsius = (valor - 32) * (5 / 9);
  else celsius = valor - 273.15;

  if (para === "°C") return celsius;
  if (para === "°F") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export default function ConversorDeUnidades() {
  const [catIndex, setCatIndex] = useState(0);
  const [deIndex, setDeIndex] = useState(0);
  const [paraIndex, setParaIndex] = useState(1);
  const [valor, setValor] = useState("");

  const cat = categorias[catIndex];
  const de = cat.unidades[deIndex] || cat.unidades[0];
  const para = cat.unidades[paraIndex] || cat.unidades[1];
  const v = parseFloat(valor) || 0;

  let resultado: number;
  if (cat.nome === "Temperatura") {
    resultado = converterTemperatura(v, de.sigla, para.sigla);
  } else {
    resultado = (v * de.fator) / para.fator;
  }

  return (
    <ToolPage title="Conversor de Unidades" description="Converta unidades de comprimento, peso, temperatura, volume, area e velocidade de forma rapida e precisa." accent="teal" icon="🔄" slug="conversor-de-unidades">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map((c, i) => (
            <button
              key={c.nome}
              onClick={() => {
                setCatIndex(i);
                setDeIndex(0);
                setParaIndex(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                i === catIndex
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">De</label>
            <select
              value={deIndex}
              onChange={(e) => setDeIndex(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-2"
            >
              {cat.unidades.map((u, i) => (
                <option key={u.sigla} value={i}>
                  {u.nome} ({u.sigla})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Digite o valor"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
            />
          </div>

          <button
            onClick={() => {
              const temp = deIndex;
              setDeIndex(paraIndex);
              setParaIndex(temp);
            }}
            className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors self-center cursor-pointer"
          >
            ⇄
          </button>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Para</label>
            <select
              value={paraIndex}
              onChange={(e) => setParaIndex(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-2"
            >
              {cat.unidades.map((u, i) => (
                <option key={u.sigla} value={i}>
                  {u.nome} ({u.sigla})
                </option>
              ))}
            </select>
            <div className="w-full bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5 text-lg font-semibold text-teal-800">
              {valor ? resultado.toLocaleString("pt-BR", { maximumFractionDigits: 6 }) : "0"}{" "}
              {para.sigla}
            </div>
          </div>
        </div>

        {valor && (
          <p className="text-center text-gray-500 mt-4">
            {v.toLocaleString("pt-BR")} {de.sigla} ={" "}
            {resultado.toLocaleString("pt-BR", { maximumFractionDigits: 6 })} {para.sigla}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Tabela de Conversao Rapida</h2>
        {valor && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Unidade</th>
                  <th className="px-4 py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {cat.unidades.map((u) => {
                  let val: number;
                  if (cat.nome === "Temperatura") {
                    val = converterTemperatura(v, de.sigla, u.sigla);
                  } else {
                    val = (v * de.fator) / u.fator;
                  }
                  return (
                    <tr key={u.sigla} className="border-t border-gray-100">
                      <td className="px-4 py-2">
                        {u.nome} ({u.sigla})
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {val.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Conversor de Unidades</h2>
          <p className="mb-3">
            Nosso conversor de unidades permite converter valores entre diferentes sistemas de medida de forma rapida e precisa. Siga os passos abaixo para realizar suas conversoes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Escolha a categoria:</strong> Clique em um dos botoes no topo da ferramenta para selecionar o tipo de grandeza que deseja converter: Comprimento, Peso/Massa, Temperatura, Volume, Area ou Velocidade. A ferramenta se ajusta automaticamente mostrando apenas as unidades relevantes para a categoria escolhida.</li>
            <li><strong>Selecione a unidade de origem:</strong> No campo &quot;De&quot;, use o menu suspenso para escolher a unidade a partir da qual deseja converter. Por exemplo, se voce quer converter quilogramas para libras, selecione &quot;Quilograma (kg)&quot; no campo de origem.</li>
            <li><strong>Selecione a unidade de destino:</strong> No campo &quot;Para&quot;, escolha a unidade para a qual deseja converter o valor. Seguindo o exemplo, selecione &quot;Libra (lb)&quot;.</li>
            <li><strong>Digite o valor:</strong> Insira o numero que deseja converter no campo de entrada. O resultado aparece automaticamente no campo de destino, sem necessidade de clicar em nenhum botao. Voce pode usar casas decimais para valores mais precisos.</li>
            <li><strong>Inverta as unidades:</strong> Use o botao de setas (entre os campos De e Para) para inverter rapidamente as unidades de origem e destino, sem perder o valor digitado.</li>
            <li><strong>Consulte a tabela completa:</strong> Abaixo da ferramenta, uma tabela de conversao rapida mostra o valor convertido para todas as unidades da categoria selecionada simultaneamente.</li>
          </ul>
          <p className="mt-3">
            A conversao e realizada instantaneamente no seu navegador. Nenhuma informacao e enviada para servidores externos, e voce pode usar a ferramenta offline apos o primeiro carregamento.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Conversao de Unidades</h2>
          <p className="mb-3">
            A conversao de unidades e um processo matematico que transforma um valor expresso em uma unidade de medida para outra unidade equivalente. Cada unidade possui um fator de conversao em relacao a uma unidade base da sua categoria. Para converter, o valor e primeiro transformado na unidade base e depois convertido para a unidade de destino.
          </p>
          <p className="mb-3">
            Para grandezas como comprimento, peso, volume, area e velocidade, o metodo utiliza <strong>fatores de conversao lineares</strong>. Por exemplo, 1 quilometro equivale a 1.000 metros (fator = 1000). Para converter 5 km para metros: 5 x 1000 = 5.000 m. Para converter entre duas unidades quaisquer, a formula e: <strong>Resultado = Valor x (Fator da unidade de origem / Fator da unidade de destino)</strong>.
          </p>
          <p className="mb-3">
            A temperatura e um caso especial que nao usa fatores de conversao lineares simples. As formulas de conversao entre Celsius, Fahrenheit e Kelvin envolvem operacoes de adicao e multiplicacao diferentes. De Celsius para Fahrenheit: <strong>F = C x 9/5 + 32</strong>. De Celsius para Kelvin: <strong>K = C + 273,15</strong>. De Fahrenheit para Celsius: <strong>C = (F - 32) x 5/9</strong>. Nossa ferramenta trata a temperatura como caso especial, aplicando essas formulas automaticamente.
          </p>
          <p className="mb-3">
            Os fatores de conversao utilizados seguem os padroes do Sistema Internacional de Unidades (SI) e as definicoes oficiais de cada unidade. Para medidas imperiais (polegadas, pes, libras, galoes), usamos os fatores de equivalencia internacionalmente aceitos. A precisao dos resultados e de ate 6 casas decimais, suficiente para a maioria das aplicacoes praticas.
          </p>
          <p className="mb-3">
            Nosso conversor abrange 6 categorias com mais de 30 unidades no total, cobrindo desde medidas do dia a dia (quilos para libras, celsius para fahrenheit) ate unidades tecnicas (nos para metros por segundo, hectares para metros quadrados).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Quantos centimetros tem uma polegada?</summary>
              <p className="px-4 pb-3 text-sm">Uma polegada equivale a exatamente 2,54 centimetros. Essa definicao foi padronizada internacionalmente em 1959. Para converter polegadas para centimetros, multiplique por 2,54. Para o caminho inverso, divida por 2,54. Exemplo: uma tela de 55 polegadas tem 139,7 cm de diagonal (55 x 2,54).</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como converter Celsius para Fahrenheit de cabeca?</summary>
              <p className="px-4 pb-3 text-sm">A formula exata e F = C x 9/5 + 32, mas para estimativas rapidas de cabeca, voce pode usar a aproximacao: dobre o valor em Celsius e some 30. Exemplo: 25 graus C: 25 x 2 + 30 = 80 graus F (o valor exato e 77 graus F). Essa aproximacao funciona razoavelmente bem para temperaturas do dia a dia (entre 0 e 40 graus C).</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre quilograma e libra?</summary>
              <p className="px-4 pb-3 text-sm">O quilograma e a unidade de massa do Sistema Internacional (SI), usado no Brasil e na maior parte do mundo. A libra (pound, lb) e usada nos Estados Unidos, Reino Unido e poucos outros paises. Um quilograma equivale a aproximadamente 2,205 libras, e uma libra equivale a cerca de 0,4536 quilogramas. Para converter kg para lb rapidamente, multiplique por 2,2.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O que e o Kelvin e quando e usado?</summary>
              <p className="px-4 pb-3 text-sm">O Kelvin e a unidade de temperatura do Sistema Internacional, usada principalmente em contextos cientificos. Sua escala comeca no zero absoluto (-273,15 graus Celsius), a temperatura teorica mais baixa possivel, onde as particulas param completamente de se mover. O Kelvin usa os mesmos incrementos que o Celsius: uma variacao de 1 K equivale a uma variacao de 1 grau C. Agua congela a 273,15 K e ferve a 373,15 K.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Quantos litros tem um galao?</summary>
              <p className="px-4 pb-3 text-sm">Um galao americano (US gallon) equivale a 3,785 litros. Ja o galao imperial britanico e maior, com 4,546 litros. Nossa ferramenta usa o galao americano, que e o mais comum em referencias de consumo de combustivel, receitas americanas e especificacoes tecnicas. Para converter litros para galoes US, divida por 3,785.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre milha terrestre e milha nautica?</summary>
              <p className="px-4 pb-3 text-sm">A milha terrestre (statute mile) equivale a 1.609,344 metros e e usada em estradas nos EUA e UK. A milha nautica equivale a 1.852 metros (1 minuto de arco de latitude) e e usada na navegacao maritima e aerea. O no (knot) e a velocidade de 1 milha nautica por hora (1,852 km/h). Nossa ferramenta inclui ambas: a milha na categoria Comprimento e o no na categoria Velocidade.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre hectare e acre?</summary>
              <p className="px-4 pb-3 text-sm">Um hectare equivale a 10.000 metros quadrados (um quadrado de 100m x 100m) e e a unidade de area mais usada no Brasil para medir terrenos e propriedades rurais. Um acre equivale a 4.046,86 metros quadrados, sendo usado nos EUA e UK. Portanto, 1 hectare equivale a aproximadamente 2,471 acres. Para converter hectares para acres, multiplique por 2,471.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas de Conversao</h2>
          <p className="mb-3">
            Conhecer algumas conversoes aproximadas de cabeca pode ser muito util no dia a dia, especialmente em viagens internacionais e compras em sites estrangeiros:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Peso em compras internacionais:</strong> Ao comprar produtos em sites americanos, lembre-se que 1 lb (libra) equivale a cerca de 450 gramas. Um pacote de 5 lbs tem aproximadamente 2,27 kg. Para estimar rapidamente, divida o peso em libras por 2 e adicione 10%. Para converter tambem o preco em dolar, use o <a href="/conversor-moedas" className="text-teal-600 hover:underline">Conversor de Moedas</a>.</li>
            <li><strong>Temperatura em viagens:</strong> Se a previsao diz 68 graus F, subtraia 30 e divida por 2: (68 - 30) / 2 = 19 graus C (o valor exato e 20 graus C). Para climas extremos, essa estimativa perde precisao, entao use o conversor.</li>
            <li><strong>Distancias nos EUA:</strong> 1 milha equivale a 1,6 km. Para converter milhas para quilometros rapidamente, multiplique por 1,6. Se um destino esta a 60 milhas, sao aproximadamente 96 km (60 x 1,6).</li>
            <li><strong>Receitas americanas:</strong> 1 xicara (cup) americana equivale a 236,6 mL, e 1 onca fluida (fl oz) equivale a 29,6 mL. Uma garrafa de 16 fl oz tem cerca de 473 mL (quase meio litro).</li>
            <li><strong>Tamanhos de roupas e calcados:</strong> Para converter tamanhos entre Brasil, EUA e Europa, a <a href="/tabela-medidas" className="text-teal-600 hover:underline">Tabela de Medidas</a> traz equivalencias prontas para roupas femininas, masculinas e calcados.</li>
            <li><strong>Velocidade do vento:</strong> Previsoes internacionais costumam usar m/s ou nos. Para converter m/s para km/h, multiplique por 3,6. Para converter nos para km/h, multiplique por 1,85. Vento de 10 m/s equivale a 36 km/h.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
