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

/* ── Helpers ── */

function parseRange(s: string): [number, number] {
  const [a, b] = s.split("-").map(Number);
  return [a, b];
}

function matchRange(value: number, dados: string[][], colIdx: number): number[] {
  const matches: number[] = [];
  for (let i = 0; i < dados.length; i++) {
    const [min, max] = parseRange(dados[i][colIdx]);
    if (value >= min && value <= max) matches.push(i);
  }
  return matches;
}

function matchClosest(value: number, dados: string[][], colIdx: number): { idx: number; dist: number } {
  let best = 0;
  let bestDist = Math.abs(value - parseFloat(dados[0][colIdx]));
  for (let i = 1; i < dados.length; i++) {
    const dist = Math.abs(value - parseFloat(dados[i][colIdx]));
    if (dist < bestDist) { best = i; bestDist = dist; }
  }
  return { idx: best, dist: bestDist };
}

function isValid(s: string): boolean {
  if (!s.trim()) return false;
  const n = parseFloat(s);
  return !isNaN(n) && n > 0;
}

/* ── Shared UI ── */

function SizeResult({ dados, colunas, rowIdx, label }: {
  dados: string[][]; colunas: string[]; rowIdx: number; label?: string;
}) {
  const row = dados[rowIdx];
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
      {label && <p className="text-sm font-medium text-teal-700 mb-3">{label}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {colunas.slice(0, 4).map((col, i) => (
          <div key={col} className="text-center bg-white rounded-lg p-2 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{col}</p>
            <p className="text-lg font-bold text-teal-800">{row[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Aviso() {
  return (
    <p className="text-xs text-gray-500 mt-3 leading-relaxed">
      Tamanho de referencia baseado em padroes gerais. Marcas, modelagens, tecidos e fabricantes podem utilizar tabelas proprias. Sempre consulte a tabela da marca antes de comprar.
    </p>
  );
}

/* ── Modo Roupas ── */

function ModoRoupas() {
  const [genero, setGenero] = useState<"feminino" | "masculino">("feminino");
  const [valores, setValores] = useState({ busto: "", cintura: "", quadril: "" });
  const [resultado, setResultado] = useState<React.ReactNode>(null);

  function limpar() {
    setValores({ busto: "", cintura: "", quadril: "" });
    setResultado(null);
  }

  function calcular() {
    const cat: Categoria = genero === "feminino" ? "roupas-fem" : "roupas-masc";
    const { colunas, dados } = TABELAS[cat];

    const medidas: { nome: string; valor: number; matches: number[] }[] = [];

    if (genero === "feminino") {
      if (isValid(valores.busto)) medidas.push({ nome: "Busto", valor: parseFloat(valores.busto), matches: matchRange(parseFloat(valores.busto), dados, 4) });
      if (isValid(valores.cintura)) medidas.push({ nome: "Cintura", valor: parseFloat(valores.cintura), matches: matchRange(parseFloat(valores.cintura), dados, 5) });
      if (isValid(valores.quadril)) medidas.push({ nome: "Quadril", valor: parseFloat(valores.quadril), matches: matchRange(parseFloat(valores.quadril), dados, 6) });
    } else {
      if (isValid(valores.busto)) medidas.push({ nome: "Torax", valor: parseFloat(valores.busto), matches: matchRange(parseFloat(valores.busto), dados, 4) });
      if (isValid(valores.cintura)) medidas.push({ nome: "Cintura", valor: parseFloat(valores.cintura), matches: matchRange(parseFloat(valores.cintura), dados, 5) });
    }

    if (medidas.length === 0) return;

    const foraFaixa = medidas.find(m => m.matches.length === 0);
    if (foraFaixa) {
      const colIdx = genero === "feminino"
        ? (foraFaixa.nome === "Busto" ? 4 : foraFaixa.nome === "Cintura" ? 5 : 6)
        : (foraFaixa.nome === "Torax" ? 4 : 5);
      const firstMin = parseRange(dados[0][colIdx])[0];
      const lastMax = parseRange(dados[dados.length - 1][colIdx])[1];
      const dir = foraFaixa.valor < firstMin ? "abaixo da menor" : "acima da maior";
      setResultado(
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-medium">
            {foraFaixa.nome}: {foraFaixa.valor} cm esta {dir} faixa da tabela ({firstMin}-{lastMax} cm).
          </p>
          <p className="text-amber-700 text-sm mt-1">
            Consulte a secao de limitacoes abaixo. A tabela cobre de PP a GG.
          </p>
        </div>
      );
      return;
    }

    const sets = medidas.map(m => new Set(m.matches));
    const intersection = [...sets[0]].filter(idx => sets.every(s => s.has(idx)));

    if (intersection.length > 0) {
      setResultado(
        <>
          <SizeResult dados={dados} colunas={colunas} rowIdx={intersection[0]} label="Faixa mais proxima pelas medidas informadas:" />
          <Aviso />
        </>
      );
    } else {
      const maxIdx = Math.max(...medidas.flatMap(m => m.matches));
      setResultado(
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
            <p className="text-amber-800 font-medium mb-2">Suas medidas ficam entre mais de uma faixa</p>
            <p className="text-amber-700 text-sm">
              Para melhor ajuste, consulte a medida da peca e a tabela especifica da marca.
            </p>
          </div>
          <div className="space-y-1 mb-3">
            {medidas.map((m) => (
              <p key={m.nome} className="text-sm">
                <span className="font-medium text-gray-700">{m.nome} ({m.valor} cm):</span>{" "}
                <span className="text-teal-700">{m.matches.map(idx => dados[idx][0]).join(" ou ")}</span>
              </p>
            ))}
          </div>
          <SizeResult dados={dados} colunas={colunas} rowIdx={maxIdx} label="Referencia pela maior faixa necessaria:" />
          <p className="text-xs text-gray-500 mt-2">Sugestao baseada na maior faixa — apenas referencia, nao garantia de ajuste.</p>
          <Aviso />
        </>
      );
    }
  }

  const isFem = genero === "feminino";
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
  const toggleClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${active ? "bg-teal-100 text-teal-800 border border-teal-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setGenero("feminino"); limpar(); }} className={toggleClass(isFem)}>Feminino</button>
        <button onClick={() => { setGenero("masculino"); limpar(); }} className={toggleClass(!isFem)}>Masculino</button>
      </div>

      <div className={`grid grid-cols-1 ${isFem ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4 mb-4`}>
        <div>
          <label htmlFor="roupas-busto" className="block text-sm font-medium text-gray-700 mb-1">
            {isFem ? "Busto (cm)" : "Torax (cm)"}
          </label>
          <input id="roupas-busto" type="text" inputMode="decimal" value={valores.busto}
            onChange={(e) => setValores(v => ({ ...v, busto: e.target.value }))}
            placeholder={isFem ? "Ex: 88" : "Ex: 96"} className={inputClass} />
        </div>
        <div>
          <label htmlFor="roupas-cintura" className="block text-sm font-medium text-gray-700 mb-1">Cintura (cm)</label>
          <input id="roupas-cintura" type="text" inputMode="decimal" value={valores.cintura}
            onChange={(e) => setValores(v => ({ ...v, cintura: e.target.value }))}
            placeholder="Ex: 70" className={inputClass} />
        </div>
        {isFem && (
          <div>
            <label htmlFor="roupas-quadril" className="block text-sm font-medium text-gray-700 mb-1">Quadril (cm)</label>
            <input id="roupas-quadril" type="text" inputMode="decimal" value={valores.quadril}
              onChange={(e) => setValores(v => ({ ...v, quadril: e.target.value }))}
              placeholder="Ex: 96" className={inputClass} />
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={calcular} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 cursor-pointer transition-colors">
          Descobrir tamanho
        </button>
        <button onClick={limpar} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
          Limpar
        </button>
      </div>

      {resultado}
    </div>
  );
}

/* ── Modo Calcados ── */

function ModoCalcados() {
  const [genero, setGenero] = useState<"feminino" | "masculino">("feminino");
  const [comprimento, setComprimento] = useState("");
  const [resultado, setResultado] = useState<React.ReactNode>(null);

  function limpar() {
    setComprimento("");
    setResultado(null);
  }

  function calcular() {
    if (!isValid(comprimento)) return;
    const valor = parseFloat(comprimento);
    const cat: Categoria = genero === "feminino" ? "calcados-fem" : "calcados-masc";
    const { colunas, dados } = TABELAS[cat];

    const minVal = parseFloat(dados[0][4]);
    const maxVal = parseFloat(dados[dados.length - 1][4]);

    if (valor < minVal - 1) {
      setResultado(
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-medium">
            {valor} cm esta abaixo da menor medida da tabela ({minVal} cm).
          </p>
        </div>
      );
      return;
    }
    if (valor > maxVal + 1) {
      setResultado(
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-medium">
            {valor} cm esta acima da maior medida da tabela ({maxVal} cm).
          </p>
        </div>
      );
      return;
    }

    const { idx, dist } = matchClosest(valor, dados, 4);
    const exato = dist < 0.3;

    setResultado(
      <>
        <SizeResult dados={dados} colunas={colunas} rowIdx={idx}
          label={exato
            ? "Tamanho de referencia:"
            : `Faixa mais proxima (tabela: ${dados[idx][4]} cm):`
          }
        />
        {!exato && (
          <p className="text-xs text-amber-600 mt-2">
            Sua medida ({valor} cm) fica entre tamanhos. O resultado mostra o mais proximo.
          </p>
        )}
        <Aviso />
      </>
    );
  }

  const toggleClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${active ? "bg-teal-100 text-teal-800 border border-teal-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setGenero("feminino"); limpar(); }} className={toggleClass(genero === "feminino")}>Feminino</button>
        <button onClick={() => { setGenero("masculino"); limpar(); }} className={toggleClass(genero === "masculino")}>Masculino</button>
      </div>

      <details className="mb-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <summary className="font-medium cursor-pointer text-gray-700">Como medir o pe</summary>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Coloque o pe sobre uma folha de papel</li>
          <li>Marque o calcanhar e o dedo mais longo</li>
          <li>Meca a distancia entre as marcas em centimetros</li>
          <li>Meca os dois pes</li>
          <li>Use o maior como referencia</li>
        </ol>
      </details>

      <div className="max-w-xs mb-4">
        <label htmlFor="calcado-comp" className="block text-sm font-medium text-gray-700 mb-1">Comprimento do pe (cm)</label>
        <input id="calcado-comp" type="text" inputMode="decimal" value={comprimento}
          onChange={(e) => setComprimento(e.target.value)}
          placeholder="Ex: 25.5" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={calcular} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 cursor-pointer transition-colors">
          Descobrir tamanho
        </button>
        <button onClick={limpar} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
          Limpar
        </button>
      </div>

      {resultado}
    </div>
  );
}

/* ── Modo Aneis ── */

function ModoAneis() {
  const [tipo, setTipo] = useState<"circunferencia" | "diametro">("circunferencia");
  const [valor, setValor] = useState("");
  const [resultado, setResultado] = useState<React.ReactNode>(null);

  function limpar() {
    setValor("");
    setResultado(null);
  }

  function calcular() {
    if (!isValid(valor)) return;
    const v = parseFloat(valor);
    const { colunas, dados } = TABELAS["aneis"];
    const colIdx = tipo === "diametro" ? 4 : 5;

    const minVal = parseFloat(dados[0][colIdx]);
    const maxVal = parseFloat(dados[dados.length - 1][colIdx]);

    if (v < minVal - 2) {
      setResultado(
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-medium">{v} mm esta abaixo da menor medida da tabela ({minVal} mm).</p>
        </div>
      );
      return;
    }
    if (v > maxVal + 2) {
      setResultado(
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-medium">{v} mm esta acima da maior medida da tabela ({maxVal} mm).</p>
        </div>
      );
      return;
    }

    const { idx, dist } = matchClosest(v, dados, colIdx);
    const exato = dist < 0.3;
    const unidade = tipo === "diametro" ? "diametro" : "circunferencia";

    setResultado(
      <>
        <SizeResult dados={dados} colunas={colunas} rowIdx={idx}
          label={exato
            ? "Tamanho de referencia:"
            : `Faixa mais proxima (tabela: ${dados[idx][colIdx]} mm de ${unidade}):`
          }
        />
        <div className="mt-2 text-sm text-gray-600">
          <span className="mr-4">Diametro: {dados[idx][4]} mm</span>
          <span>Circunferencia: {dados[idx][5]} mm</span>
        </div>
        {!exato && (
          <p className="text-xs text-amber-600 mt-2">
            Sua medida ({v} mm) fica entre tamanhos. O resultado mostra o mais proximo.
          </p>
        )}
        <Aviso />
      </>
    );
  }

  const toggleClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${active ? "bg-teal-100 text-teal-800 border border-teal-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setTipo("circunferencia"); limpar(); }} className={toggleClass(tipo === "circunferencia")}>Circunferencia</button>
        <button onClick={() => { setTipo("diametro"); limpar(); }} className={toggleClass(tipo === "diametro")}>Diametro</button>
      </div>

      <details className="mb-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <summary className="font-medium cursor-pointer text-gray-700">Como medir o dedo</summary>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Enrole um barbante ou tira de papel ao redor do dedo</li>
          <li>Marque o ponto de encontro</li>
          <li>Meca o comprimento com regua (circunferencia em mm)</li>
          <li>Para diametro: divida a circunferencia por 3,14</li>
        </ul>
      </details>

      <div className="max-w-xs mb-4">
        <label htmlFor="anel-medida" className="block text-sm font-medium text-gray-700 mb-1">
          {tipo === "circunferencia" ? "Circunferencia (mm)" : "Diametro (mm)"}
        </label>
        <input id="anel-medida" type="text" inputMode="decimal" value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={tipo === "circunferencia" ? "Ex: 54.4" : "Ex: 17.3"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={calcular} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 cursor-pointer transition-colors">
          Descobrir tamanho
        </button>
        <button onClick={limpar} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
          Limpar
        </button>
      </div>

      {resultado}
    </div>
  );
}

/* ── Modo Conversao ── */

function ModoConversao() {
  const [cat, setCat] = useState<Categoria>("roupas-fem");
  const [sistema, setSistema] = useState(0);
  const [tamanho, setTamanho] = useState("");

  const tabela = TABELAS[cat];
  const sistemas = tabela.colunas.slice(0, 4);
  const tamanhosDisponiveis = tabela.dados.map(row => row[sistema]);
  const rowIdx = tamanho ? tabela.dados.findIndex(row => row[sistema] === tamanho) : -1;

  const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white";

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Selecione a categoria, o sistema de origem e o tamanho para ver as equivalencias.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="conv-cat" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select id="conv-cat" value={cat} onChange={e => { setCat(e.target.value as Categoria); setSistema(0); setTamanho(""); }} className={selectClass}>
            <option value="roupas-fem">Roupas Femininas</option>
            <option value="roupas-masc">Roupas Masculinas</option>
            <option value="calcados-fem">Calcados Femininos</option>
            <option value="calcados-masc">Calcados Masculinos</option>
            <option value="aneis">Aneis</option>
          </select>
        </div>
        <div>
          <label htmlFor="conv-sis" className="block text-sm font-medium text-gray-700 mb-1">Sistema de origem</label>
          <select id="conv-sis" value={sistema} onChange={e => { setSistema(Number(e.target.value)); setTamanho(""); }} className={selectClass}>
            {sistemas.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="conv-tam" className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
          <select id="conv-tam" value={tamanho} onChange={e => setTamanho(e.target.value)} className={selectClass}>
            <option value="">Selecione</option>
            {tamanhosDisponiveis.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {rowIdx >= 0 && (
        <>
          <SizeResult dados={tabela.dados} colunas={tabela.colunas} rowIdx={rowIdx} label="Equivalencias:" />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {tabela.colunas.slice(4).map((col, i) => (
              <span key={col}>{col}: <strong>{tabela.dados[rowIdx][i + 4]}</strong></span>
            ))}
          </div>
          <Aviso />
        </>
      )}
    </div>
  );
}

/* ── Secao Interativa ── */

type ModoInterativo = "roupas" | "calcados" | "aneis" | "conversao";

function DescubraSeuTamanho() {
  const [modo, setModo] = useState<ModoInterativo>("roupas");

  const tabs: { id: ModoInterativo; label: string }[] = [
    { id: "roupas", label: "Roupas" },
    { id: "calcados", label: "Calcados" },
    { id: "aneis", label: "Aneis" },
    { id: "conversao", label: "Ja sei meu tamanho" },
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-teal-200 overflow-hidden mb-10" id="descubra">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Descubra seu tamanho</h2>
        <p className="text-teal-100 text-sm mt-1">
          Use suas medidas ou um tamanho conhecido para encontrar equivalencias
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 bg-gray-50">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setModo(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              modo === t.id
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-teal-50 border border-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {modo === "roupas" && <ModoRoupas />}
        {modo === "calcados" && <ModoCalcados />}
        {modo === "aneis" && <ModoAneis />}
        {modo === "conversao" && <ModoConversao />}
      </div>
    </div>
  );
}

/* ── Pagina Principal ── */

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
      {/* ── Ferramenta Interativa ── */}
      <DescubraSeuTamanho />

      {/* ── Orientacao Rapida ── */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-teal-800 mb-3">Como medir?</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-teal-700">
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
          <div>
            <p className="font-medium mb-1">Aneis:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enrole barbante ao redor do dedo</li>
              <li>Marque e meca em milimetros</li>
              <li>Divida por 3,14 para o diametro</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Tabelas Completas ── */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Tabelas completas de conversao</h2>

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
          <p className="text-center text-gray-500 py-8">Nenhum tamanho encontrado para &quot;{busca}&quot;</p>
        )}
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Tabela de conversao de tamanhos</h2>
        <p>
          As tabelas acima cobrem cinco categorias: roupas femininas, roupas masculinas, calcados femininos, calcados masculinos e aneis.
          Cada tabela cruza quatro sistemas de numeracao (Brasil, EUA, Europa e Reino Unido) e inclui as medidas corporais correspondentes em centimetros ou milimetros.
          Os tamanhos podem variar entre marcas, cortes e materiais — use as medidas corporais como referencia mais precisa.
          Para referencia, 1 polegada equivale a 2,54 centimetros.
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
            Para encontrar um tamanho especifico, utilize o campo de busca no canto superior direito da tabela. Basta digitar o numero ou a sigla do tamanho (como &quot;M&quot;, &quot;38&quot; ou &quot;PP&quot;) e a tabela filtrara automaticamente os resultados correspondentes. Isso e especialmente util quando voce ja sabe o tamanho em um pais e precisa descobrir o equivalente em outro.
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
            E importante saber que essas conversoes sao aproximadas. Marcas de luxo, marcas de fast fashion e fabricantes artesanais podem ter diferencas significativas em suas modelagens. Alem disso, o conceito de &quot;vanity sizing&quot; — quando marcas usam tamanhos menores no rotulo para que o consumidor se sinta melhor — e bastante comum, especialmente em roupas femininas americanas. Por isso, a melhor pratica e sempre medir o corpo e comparar com a tabela de medidas especifica da marca.
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
            <p className="text-gray-700 mt-2">Nossas tabelas seguem os padroes internacionais mais aceitos e servem como uma excelente referencia inicial. Porem, para compras internacionais online, recomendamos sempre verificar tambem a tabela de medidas da loja especifica, pois pode haver variacoes regionais. Sites como ASOS, Zara e H&amp;M geralmente possuem suas proprias tabelas de conversao.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Medir com Fita Metrica</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Tirar medidas corporais corretas e o passo mais importante para acertar o tamanho em compras online. Use uma fita metrica flexivel (de costura), nao uma trena rigida. Meca sobre a roupa intima ou sobre uma camada fina de roupa — medir sobre casacos ou blusas grossas distorce os numeros.
          </p>
          <p>
            <strong>Busto ou torax:</strong> Passe a fita ao redor da parte mais larga do peito, mantendo-a paralela ao chao. Respire normalmente e nao estique nem afrouxe a fita.
          </p>
          <p>
            <strong>Cintura:</strong> Meca na parte mais estreita do tronco, geralmente na altura do umbigo ou logo acima dele. Nao prenda a respiracao.
          </p>
          <p>
            <strong>Quadril:</strong> Meca na parte mais larga dos quadris e gluteos, com os pes juntos.
          </p>
          <p>
            <strong>Comprimento do pe:</strong> Pise em uma folha de papel com o peso do corpo distribuido igualmente. Marque o ponto do calcanhar e a ponta do dedo mais longo (que nem sempre e o dedao). Meca a distancia entre as marcas com uma regua. Faca isso no final do dia, quando os pes estao naturalmente um pouco mais inchados, e meca os dois pes — considere o maior.
          </p>
          <p>
            <strong>Circunferencia do dedo (aneis):</strong> Enrole um pedaco de barbante ou tira de papel ao redor do dedo onde o anel sera usado. Marque o ponto de encontro e meca o comprimento com uma regua em milimetros. Esse valor e a circunferencia. Para obter o diametro, divida a circunferencia por 3,14. Consulte a tabela acima para encontrar o numero correspondente.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Por que os Tamanhos Variam entre Marcas</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            As tabelas de conversao desta pagina seguem os padroes internacionais mais aceitos, mas e importante saber que marcas diferentes podem interpretar esses padroes de formas distintas. Isso acontece por varios motivos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Modelagem (fit):</strong> Uma camiseta &quot;regular fit&quot; tamanho M de uma marca pode ter medidas diferentes de uma &quot;slim fit&quot; tamanho M de outra. O numero no rotulo e o mesmo, mas o corte muda as dimensoes reais da peca.</li>
            <li><strong>Vanity sizing:</strong> Pratica comum em que marcas usam numeros menores no rotulo para que o consumidor se sinta melhor. Um tamanho 38 de uma marca de luxo pode ter as mesmas medidas de um 42 de fast fashion.</li>
            <li><strong>Materiais:</strong> Tecidos com elastano cedem e se adaptam ao corpo; tecidos rigidos como jeans bruto nao tem essa flexibilidade. O mesmo numero pode vestir de forma muito diferente dependendo do material.</li>
            <li><strong>Padronizacao regional:</strong> Marcas asiaticas (Shein, AliExpress) costumam usar modelagem menor que o padrao brasileiro. Uma peca tamanho L asiatica pode corresponder a um M brasileiro.</li>
          </ul>
          <p>
            Por essas razoes, a recomendacao e sempre: (1) meca seu corpo com fita metrica, (2) consulte a tabela de medidas da marca especifica antes de comprar, e (3) use a tabela desta pagina como ponto de partida para a conversao entre paises.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>Compras online internacionais:</strong> Ao comprar em sites como Amazon, AliExpress ou Shein, sempre converta o tamanho usando as medidas em centimetros, nao apenas a letra ou numero. Leia os comentarios de outros compradores brasileiros para saber se a peca veste maior ou menor do que o esperado.
          </p>
          <p>
            <strong>Calcados de corrida:</strong> Para tenis de corrida, muitos especialistas recomendam comprar meio numero ou um numero acima do tamanho habitual. Os pes incham durante a corrida, e um tenis apertado pode causar bolhas e desconforto. Use a medida em centimetros do seu pe e adicione 0,5 a 1 cm.
          </p>
          <p>
            <strong>Presentes:</strong> Se voce esta comprando roupas ou calcados de presente, tente descobrir discretamente o tamanho verificando uma peca que a pessoa ja use. Olhe a etiqueta interna de uma camiseta ou o numero na palmilha de um sapato. Com essa informacao e a tabela acima, voce consegue converter para qualquer sistema.
          </p>
          <p>
            <strong>Entre dois tamanhos:</strong> Se suas medidas ficarem entre dois tamanhos na tabela, escolha o maior para roupas com pouca elasticidade (jeans, camisas sociais) e o menor para roupas com bastante elasticidade (leggings, camisetas de malha).
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Limitacoes</h2>
        <div className="text-gray-700 space-y-3">
          <ul className="list-disc pl-6 space-y-2">
            <li>As equivalencias sao aproximadas e baseadas nos padroes internacionais mais comuns. Marcas individuais podem ter variacoes significativas.</li>
            <li>A tabela nao cobre tamanhos plus size acima de GG (50/52), tamanhos infantis ou tamanhos especiais (como petite ou tall).</li>
            <li>Para calcados, a largura do pe nao e considerada. Pessoas com pes largos podem precisar de um numero acima mesmo que o comprimento esteja correto.</li>
            <li>As medidas de aneis podem variar entre joalherias artesanais e industriais. Para compras de alto valor, recomenda-se medir o dedo em uma joalheria com aneleira profissional.</li>
            <li>A tabela nao substitui a tabela de medidas oficial da marca que voce esta comprando. Sempre consulte a referencia do fabricante quando disponivel.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
