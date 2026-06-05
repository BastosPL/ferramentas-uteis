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

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como usar o Conversor de Unidades?</h2>
        <p>
          Selecione a categoria (comprimento, peso, temperatura, etc.), escolha as unidades
          de origem e destino, e digite o valor. A conversao e feita instantaneamente. Use o
          botao de inverter para trocar as unidades rapidamente.
        </p>
        <h2>Conversoes mais populares</h2>
        <ul>
          <li>Quilogramas para libras</li>
          <li>Metros para pes</li>
          <li>Celsius para Fahrenheit</li>
          <li>Quilometros para milhas</li>
          <li>Litros para galoes</li>
        </ul>
      </section>
    </ToolPage>
  );
}
