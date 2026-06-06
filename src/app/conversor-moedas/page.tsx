"use client";

import { useState, useEffect } from "react";
import ToolPage from "../components/ToolPage";

const MOEDAS = [
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "USD", name: "Dolar Americano", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧" },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "JPY", name: "Iene Japones", flag: "🇯🇵" },
  { code: "CAD", name: "Dolar Canadense", flag: "🇨🇦" },
  { code: "AUD", name: "Dolar Australiano", flag: "🇦🇺" },
  { code: "CHF", name: "Franco Suico", flag: "🇨🇭" },
  { code: "CNY", name: "Yuan Chines", flag: "🇨🇳" },
  { code: "BTC", name: "Bitcoin", flag: "₿" },
];

type Cotacoes = Record<string, number>;

export default function ConversorMoedas() {
  const [de, setDe] = useState("USD");
  const [para, setPara] = useState("BRL");
  const [valor, setValor] = useState("1");
  const [cotacoes, setCotacoes] = useState<Cotacoes | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");

  useEffect(() => {
    async function buscarCotacoes() {
      setCarregando(true);
      setErro("");
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error("Falha ao buscar cotacoes");
        const data = await res.json();
        setCotacoes(data.rates);
        setUltimaAtualizacao(new Date().toLocaleString("pt-BR"));
      } catch {
        // Fallback com cotacoes aproximadas
        setCotacoes({
          BRL: 5.45, USD: 1, EUR: 0.92, GBP: 0.79, ARS: 950,
          JPY: 156.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.24, BTC: 0.000015,
        });
        setUltimaAtualizacao("Cotacoes aproximadas (offline)");
      }
      setCarregando(false);
    }
    buscarCotacoes();
  }, []);

  const converter = () => {
    if (!cotacoes || !valor) return 0;
    const v = parseFloat(valor) || 0;
    const taxaDe = cotacoes[de] || 1;
    const taxaPara = cotacoes[para] || 1;
    return (v / taxaDe) * taxaPara;
  };

  const resultado = converter();

  return (
    <ToolPage
      title="Conversor de Moedas"
      description="Converta moedas com cotacao atualizada. Dolar, Euro, Libra, Bitcoin e mais."
      accent="emerald"
      icon="💱"
      slug="conversor-moedas"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        {carregando ? (
          <p className="text-center text-gray-500 py-8">Carregando cotacoes...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">De</label>
                <select value={de} onChange={(e) => setDe(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-2">
                  {MOEDAS.map((m) => (
                    <option key={m.code} value={m.code}>{m.flag} {m.code} - {m.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
              </div>

              <button
                onClick={() => { const temp = de; setDe(para); setPara(temp); }}
                className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 self-center cursor-pointer"
              >
                ⇄
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Para</label>
                <select value={para} onChange={(e) => setPara(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-2">
                  {MOEDAS.map((m) => (
                    <option key={m.code} value={m.code}>{m.flag} {m.code} - {m.name}</option>
                  ))}
                </select>
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-lg font-bold text-emerald-800">
                  {resultado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: para === "BTC" ? 8 : 2 })} {para}
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              1 {de} = {((cotacoes?.[para] || 1) / (cotacoes?.[de] || 1)).toLocaleString("pt-BR", { minimumFractionDigits: 4 })} {para}
            </p>
            {ultimaAtualizacao && (
              <p className="text-center text-xs text-gray-400 mt-1">Atualizado: {ultimaAtualizacao}</p>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cotacoes Principais</h2>
        {cotacoes && (
          <div className="grid md:grid-cols-2 gap-3">
            {MOEDAS.filter((m) => m.code !== "BRL").map((m) => {
              const taxaBRL = (cotacoes["BRL"] || 5.45) / (cotacoes[m.code] || 1);
              return (
                <div key={m.code} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-900">{m.flag} {m.code}</span>
                  <span className="font-mono text-sm font-medium text-gray-900">R$ {taxaBRL.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: m.code === "BTC" ? 0 : 2 })}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona o conversor de moedas?</h2>
        <p>
          O conversor busca cotacoes atualizadas e calcula a conversao em tempo real.
          Selecione a moeda de origem e destino, digite o valor e veja o resultado
          instantaneamente. As cotacoes sao atualizadas automaticamente.
        </p>
      </section>
    </ToolPage>
  );
}
