"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type Categoria = "roupas-fem" | "roupas-masc" | "calcados-fem" | "calcados-masc" | "aneis";

const TABELAS: Record<Categoria, { titulo: string; colunas: string[]; dados: string[][] }> = {
  "roupas-fem": {
    titulo: "Roupas Femininas",
    colunas: ["Brasil", "EUA", "Europa", "UK", "Busto (cm)", "Cintura (cm)", "Quadril (cm)"],
    dados: [
      ["PP (34)", "XS (0-2)", "32", "4", "76-80", "58-62", "84-88"],
      ["P (36)", "S (4)", "34", "6", "80-84", "62-66", "88-92"],
      ["P (38)", "S (6)", "36", "8", "84-88", "66-70", "92-96"],
      ["M (40)", "M (8)", "38", "10", "88-92", "70-74", "96-100"],
      ["M (42)", "M (10)", "40", "12", "92-96", "74-78", "100-104"],
      ["G (44)", "L (12)", "42", "14", "96-100", "78-82", "104-108"],
      ["G (46)", "L (14)", "44", "16", "100-104", "82-86", "108-112"],
      ["GG (48)", "XL (16)", "46", "18", "104-108", "86-90", "112-116"],
      ["GG (50)", "XXL (18)", "48", "20", "108-112", "90-94", "116-120"],
    ],
  },
  "roupas-masc": {
    titulo: "Roupas Masculinas",
    colunas: ["Brasil", "EUA", "Europa", "UK", "Torax (cm)", "Cintura (cm)"],
    dados: [
      ["PP (36)", "XS (34)", "44", "34", "84-88", "70-74"],
      ["P (38)", "S (36)", "46", "36", "88-92", "74-78"],
      ["P (40)", "S (38)", "48", "38", "92-96", "78-82"],
      ["M (42)", "M (40)", "50", "40", "96-100", "82-86"],
      ["M (44)", "M (42)", "52", "42", "100-104", "86-90"],
      ["G (46)", "L (44)", "54", "44", "104-108", "90-94"],
      ["G (48)", "L (46)", "56", "46", "108-112", "94-98"],
      ["GG (50)", "XL (48)", "58", "48", "112-116", "98-102"],
      ["GG (52)", "XXL (50)", "60", "50", "116-120", "102-106"],
    ],
  },
  "calcados-fem": {
    titulo: "Calcados Femininos",
    colunas: ["Brasil", "EUA", "Europa", "UK", "Comprimento (cm)"],
    dados: [
      ["33", "4", "34", "1.5", "21.5"],
      ["34", "5", "35", "2.5", "22.0"],
      ["35", "6", "36", "3.5", "22.5"],
      ["36", "7", "37", "4.5", "23.5"],
      ["37", "8", "38", "5.5", "24.0"],
      ["38", "9", "39", "6.5", "24.5"],
      ["39", "10", "40", "7.5", "25.5"],
      ["40", "11", "41", "8.5", "26.0"],
    ],
  },
  "calcados-masc": {
    titulo: "Calcados Masculinos",
    colunas: ["Brasil", "EUA", "Europa", "UK", "Comprimento (cm)"],
    dados: [
      ["37", "5.5", "38", "5", "24.0"],
      ["38", "6.5", "39", "6", "25.0"],
      ["39", "7.5", "40", "6.5", "25.5"],
      ["40", "8", "41", "7", "26.0"],
      ["41", "9", "42", "8", "27.0"],
      ["42", "9.5", "43", "8.5", "27.5"],
      ["43", "10.5", "44", "9.5", "28.0"],
      ["44", "11.5", "45", "10.5", "29.0"],
    ],
  },
  "aneis": {
    titulo: "Aneis",
    colunas: ["Brasil", "EUA", "Europa", "UK", "Diametro (mm)", "Circunferencia (mm)"],
    dados: [
      ["8", "4", "47", "H", "14.9", "46.8"],
      ["10", "5", "49", "J", "15.7", "49.3"],
      ["12", "6", "51", "L", "16.5", "51.8"],
      ["14", "7", "54", "N", "17.3", "54.4"],
      ["16", "8", "57", "P", "18.1", "56.9"],
      ["18", "9", "59", "R", "18.9", "59.5"],
      ["20", "10", "62", "T", "19.8", "62.1"],
      ["22", "11", "64", "V", "20.6", "64.6"],
      ["24", "12", "67", "Y", "21.4", "67.2"],
    ],
  },
};

export default function TabelaMedidas() {
  const [categoria, setCategoria] = useState<Categoria>("roupas-fem");
  const [busca, setBusca] = useState("");

  const tabela = TABELAS[categoria];

  const dadosFiltrados = busca
    ? tabela.dados.filter((row) => row.some((cell) => cell.toLowerCase().includes(busca.toLowerCase())))
    : tabela.dados;

  return (
    <ToolPage
      title="Tabela de Medidas"
      description="Converta tamanhos de roupas, calcados e aneis entre Brasil, EUA e Europa. Tabelas completas masculino e feminino."
      accent="teal"
      icon="📏"
      slug="tabela-medidas"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "roupas-fem" as Categoria, label: "👗 Roupas Fem." },
          { id: "roupas-masc" as Categoria, label: "👔 Roupas Masc." },
          { id: "calcados-fem" as Categoria, label: "👠 Calcados Fem." },
          { id: "calcados-masc" as Categoria, label: "👟 Calcados Masc." },
          { id: "aneis" as Categoria, label: "💍 Aneis" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategoria(cat.id); setBusca(""); }}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
              categoria === cat.id ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{tabela.titulo}</h2>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tamanho..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-teal-50">
              <tr>
                {tabela.colunas.map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-teal-700 uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-2.5 ${j === 0 ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dadosFiltrados.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum tamanho encontrado para "{busca}"</p>
        )}
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-teal-800 mb-3">Como medir?</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-teal-700">
          <div>
            <p className="font-medium mb-1">Roupas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Busto/Torax:</strong> Meca ao redor da parte mais larga</li>
              <li><strong>Cintura:</strong> Meca na parte mais fina do tronco</li>
              <li><strong>Quadril:</strong> Meca na parte mais larga dos quadris</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Calcados:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pise em uma folha de papel</li>
              <li>Marque o calcanhar e o dedo mais longo</li>
              <li>Meca a distancia entre as marcas</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Tabela de conversao de tamanhos</h2>
        <p>
          As tabelas de medidas permitem converter tamanhos entre diferentes paises.
          Os tamanhos podem variar entre marcas, por isso use as medidas em centimetros
          como referencia mais precisa. Na duvida, consulte a tabela de medidas da marca especifica.
        </p>
      </section>

      {/* ── EDITORIAL CONTENT ── */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Tabela de Medidas</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Utilizar nossa tabela de conversao de medidas e simples e rapido. Primeiro, selecione a categoria desejada clicando em um dos botoes no topo da ferramenta: Roupas Femininas, Roupas Masculinas, Calcados Femininos, Calcados Masculinos ou Aneis. A tabela correspondente sera exibida imediatamente com todas as equivalencias entre os sistemas brasileiro, americano, europeu e britanico.
          </p>
          <p>
            Para encontrar um tamanho especifico, utilize o campo de busca no canto superior direito da tabela. Basta digitar o numero ou a sigla do tamanho (como "M", "38" ou "PP") e a tabela filtrara automaticamente os resultados correspondentes. Isso e especialmente util quando voce ja sabe o tamanho em um pais e precisa descobrir o equivalente em outro.
          </p>
          <p>
            Sempre que possivel, confira as medidas em centimetros indicadas na tabela (busto, cintura, quadril, comprimento do pe ou diametro do anel). Essas medidas corporais sao a referencia mais precisa, ja que os tamanhos nominais podem variar significativamente entre marcas e fabricantes diferentes.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Funciona a Conversao de Tamanhos</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Os sistemas de numeracao de roupas e calcados variam de pais para pais porque foram desenvolvidos de forma independente ao longo da historia. O Brasil utiliza um sistema numerico proprio, baseado em medidas corporais em centimetros, enquanto os Estados Unidos adotam um sistema com letras (S, M, L, XL) e numeros diferentes. A Europa segue o padrao continental baseado em uma formula que considera o comprimento do tronco ou do pe, e o Reino Unido possui seu proprio sistema historico.
          </p>
          <p>
            Nossa tabela cruza esses quatro sistemas e adiciona as medidas reais em centimetros como ponto de referencia universal. Para roupas, as medidas-chave sao o busto ou torax, a cintura e o quadril. Para calcados, o comprimento do pe em centimetros e a medida mais confiavel. Para aneis, utilizamos o diametro interno e a circunferencia em milimetros.
          </p>
          <p>
            E importante saber que essas conversoes sao aproximadas. Marcas de luxo, marcas de fast fashion e fabricantes artesanais podem ter diferencas significativas em suas modelagens. Alem disso, o conceito de "vanity sizing" — quando marcas usam tamanhos menores no rotulo para que o consumidor se sinta melhor — e bastante comum, especialmente em roupas femininas americanas. Por isso, a melhor pratica e sempre medir o corpo e comparar com a tabela de medidas especifica da marca.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3">
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">O tamanho M no Brasil e igual ao M nos EUA?</summary>
            <p className="text-gray-700 mt-2">Nao necessariamente. O tamanho M brasileiro geralmente corresponde aos numeros 40-42 e equivale aproximadamente ao tamanho M americano (8-10 feminino ou 40-42 masculino). Porem, a diferenca pode variar entre marcas. Sempre confira as medidas em centimetros para ter certeza.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Como medir o pe corretamente para calcados?</summary>
            <p className="text-gray-700 mt-2">Coloque uma folha de papel no chao, pise sobre ela com o peso do corpo distribuido igualmente e marque o ponto do calcanhar e do dedo mais longo. Meca a distancia entre as duas marcas com uma regua. Faca isso no final do dia, quando os pes estao naturalmente mais inchados. Meca os dois pes e considere o maior.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Os tamanhos de roupas sao iguais em todas as marcas?</summary>
            <p className="text-gray-700 mt-2">Nao. Existe uma variacao consideravel entre marcas, mesmo dentro do mesmo pais. Uma camiseta tamanho M da marca A pode ser maior ou menor que a mesma classificacao da marca B. Por isso, recomendamos sempre verificar a tabela de medidas especifica da marca antes de comprar, especialmente em compras online.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Qual e a diferenca entre tamanhos europeus e brasileiros?</summary>
            <p className="text-gray-700 mt-2">Os tamanhos europeus para roupas costumam ser numericamente maiores que os brasileiros. Por exemplo, um tamanho 40 brasileiro feminino equivale aproximadamente a um 38 europeu. Ja para calcados, os numeros europeus costumam ser 1 a 2 numeros acima dos brasileiros. A tabela acima mostra todas essas correspondencias de forma clara.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Como saber meu tamanho de anel sem ir a uma joalheria?</summary>
            <p className="text-gray-700 mt-2">Enrole um pedaco de barbante ou fita ao redor do dedo desejado, marque onde se encontra e meca o comprimento com uma regua. Esse valor e a circunferencia em milimetros. Consulte a tabela acima para encontrar o tamanho correspondente. Outra opcao e medir o diametro interno de um anel que ja sirva bem no dedo.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Posso confiar nessas conversoes para compras internacionais?</summary>
            <p className="text-gray-700 mt-2">Nossas tabelas seguem os padroes internacionais mais aceitos e servem como uma excelente referencia inicial. Porem, para compras internacionais online, recomendamos sempre verificar tambem a tabela de medidas da loja especifica, pois pode haver variacoes regionais. Sites como ASOS, Zara e H&M geralmente possuem suas proprias tabelas de conversao.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>Compras online internacionais:</strong> Ao comprar em sites como Amazon, AliExpress ou Shein, sempre converta o tamanho usando as medidas em centimetros, nao apenas a letra ou numero. Muitas lojas asiaticas, por exemplo, usam numeracao propria que nao corresponde aos padroes ocidentais. Leia os comentarios de outros compradores brasileiros para saber se a peca veste maior ou menor do que o esperado.
          </p>
          <p>
            <strong>Calcados de corrida:</strong> Para tenis de corrida, muitos especialistas recomendam comprar meio numero ou um numero acima do tamanho habitual. Os pes incham durante a corrida, e um tenis apertado pode causar bolhas e desconforto. Use a medida em centimetros do seu pe e adicione 0,5 a 1 cm para encontrar o tamanho ideal.
          </p>
          <p>
            <strong>Presentes:</strong> Se voce esta comprando roupas ou calcados de presente e nao sabe o tamanho exato da pessoa, tente descobrir discretamente verificando uma peca que ela ja use. Olhe a etiqueta interna de uma camiseta ou o numero na palmilha de um sapato. Com essa informacao e a nossa tabela, voce consegue converter para qualquer sistema de medida.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
