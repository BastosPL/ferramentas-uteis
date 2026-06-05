"use client";

import { useState, useRef, useCallback } from "react";
import ToolPage from "../components/ToolPage";

export default function Cronometro() {
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [voltas, setVoltas] = useState<number[]>([]);
  const [modo, setModo] = useState<"progressivo" | "regressivo">("progressivo");
  const [tempoInicial, setTempoInicial] = useState(300);
  const [tempoRegressivo, setTempoRegressivo] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatarTempo = (ms: number) => {
    const totalSeg = Math.abs(Math.floor(ms / 1000));
    const h = Math.floor(totalSeg / 3600);
    const m = Math.floor((totalSeg % 3600) / 60);
    const s = totalSeg % 60;
    const centesimos = Math.floor((Math.abs(ms) % 1000) / 10);
    if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${centesimos.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${centesimos.toString().padStart(2, "0")}`;
  };

  const iniciar = useCallback(() => {
    if (rodando) return;
    setRodando(true);
    const inicio = Date.now() - (modo === "progressivo" ? tempo : 0);
    intervalRef.current = setInterval(() => {
      if (modo === "progressivo") {
        setTempo(Date.now() - inicio);
      } else {
        setTempoRegressivo((prev) => {
          const novo = prev - 0.01;
          if (novo <= 0) {
            clearInterval(intervalRef.current!);
            setRodando(false);
            return 0;
          }
          return novo;
        });
      }
    }, 10);
  }, [rodando, modo, tempo]);

  const pausar = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRodando(false);
  };

  const resetar = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRodando(false);
    setTempo(0);
    setTempoRegressivo(tempoInicial);
    setVoltas([]);
  };

  const marcarVolta = () => {
    if (modo === "progressivo") setVoltas((prev) => [tempo, ...prev]);
  };

  const tempoExibido = modo === "progressivo" ? tempo : tempoRegressivo * 1000;

  return (
    <ToolPage title="Cronometro Online" description="Cronometro preciso com contagem progressiva e regressiva. Funcao de voltas para marcar tempos parciais." accent="amber" icon="⏱️" slug="cronometro">

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { resetar(); setModo("progressivo"); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${modo === "progressivo" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Cronometro
        </button>
        <button
          onClick={() => { resetar(); setModo("regressivo"); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${modo === "regressivo" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Timer (Regressivo)
        </button>
      </div>

      {modo === "regressivo" && !rodando && tempoRegressivo === tempoInicial && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-800">Definir tempo (segundos)</label>
          <div className="flex gap-2">
            {[60, 120, 300, 600, 900, 1800].map((s) => (
              <button
                key={s}
                onClick={() => { setTempoInicial(s); setTempoRegressivo(s); }}
                className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${tempoInicial === s ? "bg-amber-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {s >= 60 ? `${s / 60}min` : `${s}s`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
        <div className="text-7xl font-mono font-bold mb-8 tabular-nums">
          {formatarTempo(tempoExibido)}
        </div>
        <div className="flex justify-center gap-3">
          {!rodando ? (
            <button onClick={iniciar} className="bg-green-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-green-700 transition-colors cursor-pointer">
              Iniciar
            </button>
          ) : (
            <button onClick={pausar} className="bg-yellow-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-yellow-600 transition-colors cursor-pointer">
              Pausar
            </button>
          )}
          {modo === "progressivo" && rodando && (
            <button onClick={marcarVolta} className="bg-amber-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-amber-600 transition-colors cursor-pointer">
              Volta
            </button>
          )}
          <button onClick={resetar} className="bg-red-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-red-700 transition-colors cursor-pointer">
            Resetar
          </button>
        </div>
      </div>

      {voltas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Voltas</h2>
          <div className="space-y-2">
            {voltas.map((v, i) => (
              <div key={i} className="flex justify-between bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-500">Volta {voltas.length - i}</span>
                <span className="font-mono font-medium">{formatarTempo(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como usar o cronometro online?</h2>
        <p>
          Clique em Iniciar para comecar a contagem. Use o botao Volta para marcar tempos
          parciais. O modo Timer permite definir um tempo para contagem regressiva.
        </p>
      </section>
    </ToolPage>
  );
}
