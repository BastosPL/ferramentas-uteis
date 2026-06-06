"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

interface Registro {
  id: number;
  entrada: string;
  saida: string;
}

function parseMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHoras(minutos: number): string {
  const negativo = minutos < 0;
  const abs = Math.abs(minutos);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${negativo ? "-" : ""}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function CalculadoraHoras() {
  const [registros, setRegistros] = useState<Registro[]>([
    { id: 1, entrada: "08:00", saida: "12:00" },
    { id: 2, entrada: "13:00", saida: "17:00" },
  ]);
  const [horaExtra, setHoraExtra] = useState("08:00");
  const [nextId, setNextId] = useState(3);

  const adicionarRegistro = () => {
    setRegistros([...registros, { id: nextId, entrada: "", saida: "" }]);
    setNextId(nextId + 1);
  };

  const removerRegistro = (id: number) => {
    setRegistros(registros.filter((r) => r.id !== id));
  };

  const atualizarRegistro = (id: number, campo: "entrada" | "saida", valor: string) => {
    setRegistros(registros.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  };

  const calculos = registros.map((r) => {
    if (!r.entrada || !r.saida) return { ...r, minutos: 0 };
    let diff = parseMinutos(r.saida) - parseMinutos(r.entrada);
    if (diff < 0) diff += 1440; // virada de dia
    return { ...r, minutos: diff };
  });

  const totalMinutos = calculos.reduce((acc, r) => acc + r.minutos, 0);
  const jornadaMinutos = parseMinutos(horaExtra);
  const saldoMinutos = totalMinutos - jornadaMinutos;

  return (
    <ToolPage
      title="Calculadora de Horas"
      description="Some horas trabalhadas, calcule banco de horas e diferenca entre horarios. Ideal para controle de ponto."
      accent="amber"
      icon="🕐"
      slug="calculadora-horas"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Registros de Horario</h2>

        <div className="space-y-3 mb-4">
          {registros.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-500 w-20">Periodo {i + 1}</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={r.entrada}
                  onChange={(e) => atualizarRegistro(r.id, "entrada", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-gray-400">ate</span>
                <input
                  type="time"
                  value={r.saida}
                  onChange={(e) => atualizarRegistro(r.id, "saida", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <span className="text-sm font-mono font-medium text-gray-700 w-16 text-right">
                {formatHoras(calculos.find((c) => c.id === r.id)?.minutos || 0)}
              </span>
              {registros.length > 1 && (
                <button onClick={() => removerRegistro(r.id)} className="text-red-400 hover:text-red-600 cursor-pointer">✕</button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={adicionarRegistro}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-500 hover:border-amber-400 hover:text-amber-600 cursor-pointer"
        >
          + Adicionar periodo
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-600 mb-1">Total Trabalhado</p>
          <p className="text-2xl font-bold text-amber-800">{formatHoras(totalMinutos)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Jornada Diaria</p>
          <input
            type="time"
            value={horaExtra}
            onChange={(e) => setHoraExtra(e.target.value)}
            className="text-xl font-bold text-center text-gray-900 border-0 focus:outline-none w-full bg-transparent"
          />
        </div>
        <div className={`rounded-xl p-4 text-center border ${saldoMinutos >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-xs mb-1 ${saldoMinutos >= 0 ? "text-green-600" : "text-red-600"}`}>
            {saldoMinutos >= 0 ? "Horas Extras" : "Horas Devendo"}
          </p>
          <p className={`text-2xl font-bold ${saldoMinutos >= 0 ? "text-green-800" : "text-red-800"}`}>
            {formatHoras(saldoMinutos)}
          </p>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como calcular horas trabalhadas?</h2>
        <p>
          Adicione os periodos de entrada e saida do seu dia de trabalho. A calculadora
          soma automaticamente as horas e compara com sua jornada diaria, mostrando se
          voce tem horas extras ou horas a compensar. Ideal para controle de ponto e banco de horas.
        </p>
      </section>
    </ToolPage>
  );
}
