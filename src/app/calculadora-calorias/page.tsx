"use client";

import { useState } from "react";

const niveis = [
  { id: "sedentario", label: "Sedentario", desc: "Pouco ou nenhum exercicio", fator: 1.2 },
  { id: "leve", label: "Levemente ativo", desc: "Exercicio 1-3 dias/semana", fator: 1.375 },
  { id: "moderado", label: "Moderadamente ativo", desc: "Exercicio 3-5 dias/semana", fator: 1.55 },
  { id: "ativo", label: "Muito ativo", desc: "Exercicio 6-7 dias/semana", fator: 1.725 },
  { id: "extremo", label: "Extremamente ativo", desc: "Exercicio intenso diario ou trabalho fisico", fator: 1.9 },
];

import ToolPage from "../components/ToolPage";

export default function CalculadoraCalorias() {
  const [sexo, setSexo] = useState<"masculino" | "feminino">("masculino");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [nivel, setNivel] = useState("moderado");
  const [resultado, setResultado] = useState<{
    tmb: number;
    manutencao: number;
    perda: number;
    perdaRapida: number;
    ganho: number;
  } | null>(null);

  function calcular() {
    const i = parseInt(idade) || 0;
    const p = parseFloat(peso) || 0;
    const a = parseFloat(altura) || 0;
    if (!i || !p || !a) return;

    // Harris-Benedict
    let tmb: number;
    if (sexo === "masculino") {
      tmb = 88.362 + 13.397 * p + 4.799 * a - 5.677 * i;
    } else {
      tmb = 447.593 + 9.247 * p + 3.098 * a - 4.33 * i;
    }

    const fator = niveis.find((n) => n.id === nivel)?.fator || 1.55;
    const manutencao = tmb * fator;

    setResultado({
      tmb: Math.round(tmb),
      manutencao: Math.round(manutencao),
      perda: Math.round(manutencao - 500),
      perdaRapida: Math.round(manutencao - 1000),
      ganho: Math.round(manutencao + 500),
    });
  }

  return (
    <ToolPage
      title="Calculadora de Calorias Diarias"
      description="Descubra quantas calorias voce precisa consumir por dia para emagrecer, manter ou ganhar peso. Calculo baseado na formula de Harris-Benedict."
      accent="red"
      icon="🍎"
      slug="calculadora-calorias"
    >

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-2">Sexo</label>
          <div className="flex gap-2">
            <button onClick={() => setSexo("masculino")} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${sexo === "masculino" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Masculino
            </button>
            <button onClick={() => setSexo("feminino")} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${sexo === "feminino" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Feminino
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Idade (anos)</label>
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 30" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Peso (kg)</label>
            <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ex: 75" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Altura (cm)</label>
            <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ex: 175" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">Nivel de atividade fisica</label>
          <div className="space-y-2">
            {niveis.map((n) => (
              <label key={n.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${nivel === n.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                <input type="radio" name="nivel" value={n.id} checked={nivel === n.id} onChange={() => setNivel(n.id)} className="accent-blue-600" />
                <div>
                  <span className="font-medium text-sm text-gray-900">{n.label}</span>
                  <span className="text-xs text-gray-600 ml-2">{n.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button onClick={calcular} className="w-full bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition-colors cursor-pointer">
          Calcular Calorias
        </button>
      </div>

      {resultado && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center mb-6">
            <p className="text-sm text-blue-700 mb-1">Taxa Metabolica Basal (TMB)</p>
            <p className="text-2xl font-bold text-blue-800">{resultado.tmb.toLocaleString("pt-BR")} kcal/dia</p>
            <p className="text-xs text-blue-600 mt-1">Calorias que seu corpo gasta em repouso total</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
              <p className="text-xs text-red-600 mb-1">Perda Rapida</p>
              <p className="text-2xl font-bold text-red-700">{resultado.perdaRapida.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-red-500">kcal/dia (-1kg/sem)</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
              <p className="text-xs text-orange-600 mb-1">Perda Moderada</p>
              <p className="text-2xl font-bold text-orange-700">{resultado.perda.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-orange-500">kcal/dia (-0,5kg/sem)</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-xs text-green-600 mb-1">Manter Peso</p>
              <p className="text-2xl font-bold text-green-700">{resultado.manutencao.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-green-500">kcal/dia</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
              <p className="text-xs text-purple-600 mb-1">Ganhar Peso</p>
              <p className="text-2xl font-bold text-purple-700">{resultado.ganho.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-purple-500">kcal/dia (+0,5kg/sem)</p>
            </div>
          </div>
        </>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que e a Taxa Metabolica Basal (TMB)?</h2>
        <p>
          A TMB representa o numero de calorias que seu corpo precisa para manter funcoes
          vitais em repouso absoluto: respiracao, circulacao, temperatura corporal e funcoes
          celulares. Ela varia de acordo com sexo, idade, peso e altura.
        </p>
        <h2>Como emagrecer com deficit calorico?</h2>
        <p>
          Para perder peso, voce precisa consumir menos calorias do que gasta. Um deficit de
          500 kcal/dia resulta em uma perda de aproximadamente 0,5 kg por semana. Nao e
          recomendado um deficit maior que 1000 kcal/dia sem acompanhamento profissional.
        </p>
        <h2>Formula de Harris-Benedict</h2>
        <p>
          Homens: TMB = 88,362 + (13,397 x peso em kg) + (4,799 x altura em cm) - (5,677 x idade).
          Mulheres: TMB = 447,593 + (9,247 x peso em kg) + (3,098 x altura em cm) - (4,33 x idade).
        </p>
      </section>
    </ToolPage>
  );
}
