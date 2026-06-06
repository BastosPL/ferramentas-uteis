"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const SIGNOS = [
  { nome: "Aquario", inicio: [1, 20], fim: [2, 18], emoji: "♒" },
  { nome: "Peixes", inicio: [2, 19], fim: [3, 20], emoji: "♓" },
  { nome: "Aries", inicio: [3, 21], fim: [4, 19], emoji: "♈" },
  { nome: "Touro", inicio: [4, 20], fim: [5, 20], emoji: "♉" },
  { nome: "Gemeos", inicio: [5, 21], fim: [6, 20], emoji: "♊" },
  { nome: "Cancer", inicio: [6, 21], fim: [7, 22], emoji: "♋" },
  { nome: "Leao", inicio: [7, 23], fim: [8, 22], emoji: "♌" },
  { nome: "Virgem", inicio: [8, 23], fim: [9, 22], emoji: "♍" },
  { nome: "Libra", inicio: [9, 23], fim: [10, 22], emoji: "♎" },
  { nome: "Escorpiao", inicio: [10, 23], fim: [11, 21], emoji: "♏" },
  { nome: "Sagitario", inicio: [11, 22], fim: [12, 21], emoji: "♐" },
  { nome: "Capricornio", inicio: [12, 22], fim: [1, 19], emoji: "♑" },
];

function getSigno(mes: number, dia: number) {
  for (const s of SIGNOS) {
    const [mi, di] = s.inicio;
    const [mf, df] = s.fim;
    if (s.nome === "Capricornio") {
      if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return s;
    } else {
      if ((mes === mi && dia >= di) || (mes === mf && dia <= df)) return s;
    }
  }
  return SIGNOS[0];
}

function getDiaSemana(data: Date): string {
  const dias = ["Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"];
  return dias[data.getDay()];
}

export default function CalculadoraIdade() {
  const [dataNascimento, setDataNascimento] = useState("");
  const [resultado, setResultado] = useState<{
    anos: number;
    meses: number;
    dias: number;
    totalDias: number;
    totalSemanas: number;
    totalHoras: number;
    proximoAniversario: string;
    diasParaAniversario: number;
    diaSemana: string;
    signo: { nome: string; emoji: string };
  } | null>(null);

  function calcular() {
    if (!dataNascimento) return;
    const nasc = new Date(dataNascimento + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (nasc > hoje) return;

    let anos = hoje.getFullYear() - nasc.getFullYear();
    let meses = hoje.getMonth() - nasc.getMonth();
    let dias = hoje.getDate() - nasc.getDate();

    if (dias < 0) {
      meses--;
      const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      dias += mesAnterior.getDate();
    }
    if (meses < 0) {
      anos--;
      meses += 12;
    }

    const diffMs = hoje.getTime() - nasc.getTime();
    const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalSemanas = Math.floor(totalDias / 7);
    const totalHoras = totalDias * 24;

    let proximoAniv = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
    if (proximoAniv <= hoje) {
      proximoAniv = new Date(hoje.getFullYear() + 1, nasc.getMonth(), nasc.getDate());
    }
    const diasParaAniv = Math.ceil((proximoAniv.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    const signo = getSigno(nasc.getMonth() + 1, nasc.getDate());

    setResultado({
      anos,
      meses,
      dias,
      totalDias,
      totalSemanas,
      totalHoras,
      proximoAniversario: proximoAniv.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      diasParaAniversario: diasParaAniv,
      diaSemana: getDiaSemana(nasc),
      signo,
    });
  }

  return (
    <ToolPage
      title="Calculadora de Idade"
      description="Calcule sua idade exata em anos, meses e dias. Descubra quantos dias voce ja viveu e quando sera seu proximo aniversario."
      accent="violet"
      icon="🎂"
      slug="calculadora-idade"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <label className="block text-sm font-medium text-gray-800 mb-2">Data de Nascimento</label>
        <div className="flex gap-3">
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg"
            max={new Date().toISOString().split("T")[0]}
          />
          <button
            onClick={calcular}
            className="bg-violet-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-violet-700 transition-colors cursor-pointer"
          >
            Calcular
          </button>
        </div>
      </div>

      {resultado && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-violet-600 mb-1">Sua idade exata</p>
            <p className="text-3xl font-bold text-violet-800">
              {resultado.anos} {resultado.anos === 1 ? "ano" : "anos"}, {resultado.meses} {resultado.meses === 1 ? "mes" : "meses"} e {resultado.dias} {resultado.dias === 1 ? "dia" : "dias"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total de dias vividos</p>
              <p className="text-2xl font-bold text-gray-900">{resultado.totalDias.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total de semanas</p>
              <p className="text-2xl font-bold text-gray-900">{resultado.totalSemanas.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total de horas</p>
              <p className="text-2xl font-bold text-gray-900">{resultado.totalHoras.toLocaleString("pt-BR")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Voce nasceu em um(a)</p>
              <p className="text-lg font-bold text-gray-900">{resultado.diaSemana}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Proximo aniversario</p>
              <p className="text-sm font-bold text-gray-900">{resultado.proximoAniversario}</p>
              <p className="text-xs text-violet-600 mt-1">Faltam {resultado.diasParaAniversario} dias</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Seu signo</p>
              <p className="text-2xl mb-1">{resultado.signo.emoji}</p>
              <p className="text-lg font-bold text-gray-900">{resultado.signo.nome}</p>
            </div>
          </div>
        </>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como calcular a idade exata?</h2>
        <p>
          A calculadora considera anos completos, meses e dias restantes desde a data de
          nascimento ate hoje. Tambem mostra curiosidades como o total de dias vividos,
          o dia da semana em que voce nasceu e quantos dias faltam para o proximo aniversario.
        </p>
      </section>
    </ToolPage>
  );
}
