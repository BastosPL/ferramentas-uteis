"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

export default function CalculadoraPorcentagem() {
  const [v1a, setV1a] = useState("");
  const [v1b, setV1b] = useState("");
  const [v2a, setV2a] = useState("");
  const [v2b, setV2b] = useState("");
  const [v3a, setV3a] = useState("");
  const [v3b, setV3b] = useState("");
  const [v4a, setV4a] = useState("");
  const [v4b, setV4b] = useState("");

  const r1 = v1a && v1b ? (parseFloat(v1a) / 100) * parseFloat(v1b) : null;
  const r2 = v2a && v2b ? ((parseFloat(v2a) / parseFloat(v2b)) * 100) : null;
  const r3 = v3a && v3b ? parseFloat(v3a) * (1 + parseFloat(v3b) / 100) : null;
  const r4 = v4a && v4b ? parseFloat(v4a) * (1 - parseFloat(v4b) / 100) : null;

  const fmt = (n: number | null) => n !== null ? n.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : "—";

  return (
    <ToolPage title="Calculadora de Porcentagem" description="Calcule porcentagens de forma rapida e facil. Descubra quanto e X% de um valor, calcule aumentos, descontos e a porcentagem entre dois numeros." accent="indigo" icon="💯">

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Quanto e X% de Y?</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span>Quanto e</span>
            <input type="number" value={v1a} onChange={(e) => setV1a(e.target.value)} placeholder="10" className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>% de</span>
            <input type="number" value={v1b} onChange={(e) => setV1b(e.target.value)} placeholder="200" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>=</span>
            <span className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 font-bold text-indigo-800 min-w-[80px] text-center">{fmt(r1)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">X e quantos % de Y?</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={v2a} onChange={(e) => setV2a(e.target.value)} placeholder="25" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>e quantos % de</span>
            <input type="number" value={v2b} onChange={(e) => setV2b(e.target.value)} placeholder="200" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>=</span>
            <span className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 font-bold text-indigo-800 min-w-[80px] text-center">{fmt(r2)}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Aumento de X%</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={v3a} onChange={(e) => setV3a(e.target.value)} placeholder="100" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>com aumento de</span>
            <input type="number" value={v3b} onChange={(e) => setV3b(e.target.value)} placeholder="15" className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>% =</span>
            <span className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 font-bold text-green-800 min-w-[80px] text-center">{fmt(r3)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3">Desconto de X%</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={v4a} onChange={(e) => setV4a(e.target.value)} placeholder="100" className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>com desconto de</span>
            <input type="number" value={v4b} onChange={(e) => setV4b(e.target.value)} placeholder="20" className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>% =</span>
            <span className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 font-bold text-red-800 min-w-[80px] text-center">{fmt(r4)}</span>
          </div>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como calcular porcentagem?</h2>
        <p>
          Para calcular quanto e X% de um valor, multiplique o valor por X e divida por 100.
          Por exemplo, 15% de 200 = 200 x 15 / 100 = 30.
        </p>
        <h2>Formula da porcentagem</h2>
        <p>
          Porcentagem = (Parte / Todo) x 100. Para aumento: Valor Final = Valor x (1 + Porcentagem/100).
          Para desconto: Valor Final = Valor x (1 - Porcentagem/100).
        </p>
      </section>
    </ToolPage>
  );
}
