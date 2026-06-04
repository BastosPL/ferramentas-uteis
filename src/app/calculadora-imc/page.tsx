"use client";

import { useState } from "react";

const faixas = [
  { min: 0, max: 16, label: "Magreza grave", cor: "bg-red-600", descricao: "Procure orientacao medica urgente." },
  { min: 16, max: 17, label: "Magreza moderada", cor: "bg-orange-500", descricao: "Risco nutricional. Consulte um profissional." },
  { min: 17, max: 18.5, label: "Magreza leve", cor: "bg-yellow-500", descricao: "Abaixo do peso ideal. Atencao a alimentacao." },
  { min: 18.5, max: 25, label: "Peso normal", cor: "bg-green-500", descricao: "Parabens! Voce esta no peso ideal." },
  { min: 25, max: 30, label: "Sobrepeso", cor: "bg-yellow-500", descricao: "Atencao! Considere ajustar habitos alimentares e exercicios." },
  { min: 30, max: 35, label: "Obesidade grau I", cor: "bg-orange-500", descricao: "Risco aumentado para saude. Consulte um medico." },
  { min: 35, max: 40, label: "Obesidade grau II", cor: "bg-red-500", descricao: "Risco alto. Acompanhamento medico e importante." },
  { min: 40, max: 100, label: "Obesidade grau III", cor: "bg-red-700", descricao: "Risco muito alto. Procure ajuda medica." },
];

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState<{
    imc: number;
    faixa: (typeof faixas)[0];
    pesoIdealMin: number;
    pesoIdealMax: number;
  } | null>(null);

  function calcular() {
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100;
    if (!p || !a || a <= 0) return;

    const imc = p / (a * a);
    const faixa = faixas.find((f) => imc >= f.min && imc < f.max) || faixas[faixas.length - 1];
    const pesoIdealMin = 18.5 * a * a;
    const pesoIdealMax = 24.9 * a * a;

    setResultado({ imc, faixa, pesoIdealMin, pesoIdealMax });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Calculadora de IMC</h1>
      <p className="text-gray-600 mb-8">
        Calcule seu Indice de Massa Corporal (IMC) e descubra se voce esta no peso ideal.
        O IMC e uma medida internacional usada para avaliar o nivel de gordura corporal.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ex: 70"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Altura (cm)</label>
            <input
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder="Ex: 175"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Calcular IMC
        </button>
      </div>

      {resultado && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className={`rounded-xl p-5 text-center text-white ${resultado.faixa.cor}`}>
              <p className="text-sm opacity-90 mb-1">Seu IMC</p>
              <p className="text-4xl font-bold">{resultado.imc.toFixed(1)}</p>
              <p className="text-sm font-medium mt-1">{resultado.faixa.label}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-700 mb-1">Peso Ideal Minimo</p>
              <p className="text-2xl font-bold text-blue-800">
                {resultado.pesoIdealMin.toFixed(1)} kg
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-700 mb-1">Peso Ideal Maximo</p>
              <p className="text-2xl font-bold text-blue-800">
                {resultado.pesoIdealMax.toFixed(1)} kg
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <p className="text-gray-700">{resultado.faixa.descricao}</p>
          </div>
        </>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Tabela de Classificacao do IMC</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">IMC</th>
                <th className="px-4 py-2 text-left">Classificacao</th>
              </tr>
            </thead>
            <tbody>
              {faixas.map((f) => (
                <tr
                  key={f.label}
                  className={`border-t border-gray-100 ${
                    resultado && resultado.faixa.label === f.label ? "bg-blue-50 font-medium" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    {f.min} - {f.max}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${f.cor}`} />
                    {f.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que e o IMC?</h2>
        <p>
          O Indice de Massa Corporal (IMC) e uma medida criada pelo matematico belga Adolphe
          Quetelet. Ele e calculado dividindo o peso (em kg) pela altura ao quadrado (em metros).
          O IMC e utilizado pela Organizacao Mundial da Saude (OMS) como referencia para
          classificar o peso de adultos.
        </p>
        <h2>Limitacoes do IMC</h2>
        <p>
          O IMC nao diferencia massa muscular de gordura corporal. Pessoas muito musculosas
          podem ter IMC elevado sem estar com sobrepeso. Consulte um profissional de saude
          para uma avaliacao completa.
        </p>
      </section>
    </div>
  );
}
