"use client";

import { useState } from "react";

export default function CalculadoraCombustivel() {
  const [precoAlcool, setPrecoAlcool] = useState("");
  const [precoGasolina, setPrecoGasolina] = useState("");

  const pa = parseFloat(precoAlcool) || 0;
  const pg = parseFloat(precoGasolina) || 0;
  const razao = pg > 0 ? pa / pg : 0;
  const temResultado = pa > 0 && pg > 0;
  const melhorAlcool = razao <= 0.7;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Calculadora: Alcool ou Gasolina?</h1>
      <p className="text-gray-600 mb-8">
        Descubra qual combustivel e mais vantajoso para o seu bolso. A calculadora usa a
        regra dos 70%: se o preco do alcool for ate 70% do preco da gasolina, compensa abastecer com alcool.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Preco do Alcool (R$/litro)</label>
            <input
              type="number"
              step="0.01"
              value={precoAlcool}
              onChange={(e) => setPrecoAlcool(e.target.value)}
              placeholder="Ex: 3.89"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preco da Gasolina (R$/litro)</label>
            <input
              type="number"
              step="0.01"
              value={precoGasolina}
              onChange={(e) => setPrecoGasolina(e.target.value)}
              placeholder="Ex: 5.79"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>

        {temResultado && (
          <div className={`rounded-xl p-6 text-center ${melhorAlcool ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
            <p className="text-lg mb-2">
              Razao alcool/gasolina: <span className="font-bold">{(razao * 100).toFixed(1)}%</span>
            </p>
            <p className={`text-3xl font-bold ${melhorAlcool ? "text-green-700" : "text-blue-700"}`}>
              {melhorAlcool ? "Abasteça com ALCOOL!" : "Abasteça com GASOLINA!"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {melhorAlcool
                ? `O alcool esta ${(razao * 100).toFixed(1)}% do preco da gasolina (abaixo de 70%), portanto e mais economico.`
                : `O alcool esta ${(razao * 100).toFixed(1)}% do preco da gasolina (acima de 70%), portanto a gasolina compensa mais.`}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Tabela de Referencia Rapida</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Gasolina (R$)</th>
                <th className="px-4 py-2 text-right">Alcool compensa ate (R$)</th>
              </tr>
            </thead>
            <tbody>
              {[4.5, 5.0, 5.5, 5.79, 6.0, 6.5, 7.0].map((g) => (
                <tr key={g} className="border-t border-gray-100">
                  <td className="px-4 py-2">R$ {g.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-medium text-green-700">
                    R$ {(g * 0.7).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona a regra dos 70%?</h2>
        <p>
          O motor a alcool consome em media 30% mais combustivel que o motor a gasolina.
          Por isso, o alcool so compensa financeiramente quando seu preco for no maximo
          70% do preco da gasolina. Divida o preco do alcool pelo da gasolina: se o
          resultado for menor que 0,70, abasteça com alcool.
        </p>
        <h2>Exemplo pratico</h2>
        <p>
          Alcool a R$ 3,89 e gasolina a R$ 5,79: 3,89 / 5,79 = 0,67 (67%).
          Como 67% e menor que 70%, o alcool e mais vantajoso nesse caso.
        </p>
      </section>
    </div>
  );
}
