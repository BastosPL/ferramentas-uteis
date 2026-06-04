"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type TipoDemissao = "sem_justa_causa" | "pedido_demissao" | "acordo_mutuo";

const tiposLabel: Record<TipoDemissao, string> = {
  sem_justa_causa: "Demissao sem justa causa",
  pedido_demissao: "Pedido de demissao",
  acordo_mutuo: "Acordo mutuo (reforma trabalhista)",
};

export default function CalculadoraRescisao() {
  const [salario, setSalario] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDemissao, setDataDemissao] = useState("");
  const [tipo, setTipo] = useState<TipoDemissao>("sem_justa_causa");
  const [diasTrabalhados, setDiasTrabalhados] = useState("");
  const [saldoFGTS, setSaldoFGTS] = useState("");
  const [feriasVencidas, setFeriasVencidas] = useState(false);
  const [resultado, setResultado] = useState<{
    saldoSalario: number;
    feriasProp: number;
    tercoFerias: number;
    feriasVenc: number;
    tercoFeriasVenc: number;
    decimoTerceiro: number;
    avisoPrevio: number;
    multaFGTS: number;
    total: number;
    detalhes: string[];
  } | null>(null);

  function calcular() {
    const sal = parseFloat(salario) || 0;
    const dias = parseInt(diasTrabalhados) || 0;
    const fgts = parseFloat(saldoFGTS) || 0;

    if (!sal || !dataAdmissao || !dataDemissao) return;

    const admissao = new Date(dataAdmissao);
    const demissao = new Date(dataDemissao);
    const diffMs = demissao.getTime() - admissao.getTime();
    const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalMeses = Math.floor(totalDias / 30);
    const anosCompletos = Math.floor(totalMeses / 12);
    const mesesNoAno = totalMeses % 12;
    const diasNoMes = dias > 0 ? dias : demissao.getDate();

    // Saldo de salario
    const saldoSalario = (sal / 30) * diasNoMes;

    // Ferias proporcionais (meses trabalhados no periodo aquisitivo)
    const mesesFerias = mesesNoAno > 0 ? mesesNoAno : 0;
    const feriasProp = (sal / 12) * mesesFerias;
    const tercoFerias = feriasProp / 3;

    // Ferias vencidas
    const feriasVenc = feriasVencidas ? sal : 0;
    const tercoFeriasVenc = feriasVenc / 3;

    // 13o proporcional
    const mesAtual = demissao.getMonth() + 1;
    const decimoTerceiro = (sal / 12) * mesAtual;

    // Aviso previo (3 dias por ano trabalhado, min 30 dias)
    let avisoPrevio = 0;
    if (tipo === "sem_justa_causa") {
      const diasAviso = Math.min(90, 30 + anosCompletos * 3);
      avisoPrevio = (sal / 30) * diasAviso;
    } else if (tipo === "acordo_mutuo") {
      const diasAviso = Math.min(90, 30 + anosCompletos * 3);
      avisoPrevio = ((sal / 30) * diasAviso) / 2;
    }

    // Multa FGTS
    let multaFGTS = 0;
    if (tipo === "sem_justa_causa") {
      multaFGTS = fgts * 0.4;
    } else if (tipo === "acordo_mutuo") {
      multaFGTS = fgts * 0.2;
    }

    const total = saldoSalario + feriasProp + tercoFerias + feriasVenc + tercoFeriasVenc + decimoTerceiro + avisoPrevio + multaFGTS;

    const detalhes: string[] = [];
    detalhes.push(`Tempo de trabalho: ${anosCompletos} anos e ${mesesNoAno} meses`);
    if (tipo === "sem_justa_causa") {
      detalhes.push(`Aviso previo: ${Math.min(90, 30 + anosCompletos * 3)} dias`);
      detalhes.push("Multa FGTS: 40%");
    } else if (tipo === "acordo_mutuo") {
      detalhes.push(`Aviso previo: ${Math.min(90, 30 + anosCompletos * 3)} dias (50%)`);
      detalhes.push("Multa FGTS: 20%");
    } else {
      detalhes.push("Sem direito a aviso previo indenizado");
      detalhes.push("Sem direito a multa FGTS");
    }

    setResultado({
      saldoSalario,
      feriasProp,
      tercoFerias,
      feriasVenc,
      tercoFeriasVenc,
      decimoTerceiro,
      avisoPrevio,
      multaFGTS,
      total,
      detalhes,
    });
  }

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolPage title="Calculadora de Rescisao Trabalhista" description="Calcule o valor estimado da sua rescisao trabalhista. Inclui saldo de salario, ferias proporcionais, 13o proporcional, aviso previo e multa do FGTS." accent="rose" icon="📋">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-800">Tipo de Demissao</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(tiposLabel) as TipoDemissao[]).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tipo === t ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tiposLabel[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Salario Bruto (R$)</label>
            <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 3000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Saldo FGTS (R$)</label>
            <input type="number" value={saldoFGTS} onChange={(e) => setSaldoFGTS(e.target.value)} placeholder="Ex: 5000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Data de Admissao</label>
            <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Data de Demissao</label>
            <input type="date" value={dataDemissao} onChange={(e) => setDataDemissao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Dias trabalhados no ultimo mes</label>
            <input type="number" value={diasTrabalhados} onChange={(e) => setDiasTrabalhados(e.target.value)} placeholder="Ex: 15" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" checked={feriasVencidas} onChange={(e) => setFeriasVencidas(e.target.checked)} className="w-4 h-4 accent-rose-600" />
              <span className="text-sm">Possui ferias vencidas</span>
            </label>
          </div>
        </div>

        <button onClick={calcular} className="w-full bg-rose-600 text-white rounded-lg py-3 font-semibold hover:bg-rose-700 transition-colors cursor-pointer">
          Calcular Rescisao
        </button>
      </div>

      {resultado && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-green-700 mb-1">Valor Estimado da Rescisao</p>
            <p className="text-4xl font-bold text-green-800">{fmt(resultado.total)}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Saldo de Salario", value: resultado.saldoSalario },
                  { label: "Ferias Proporcionais", value: resultado.feriasProp },
                  { label: "1/3 de Ferias", value: resultado.tercoFerias },
                  ...(resultado.feriasVenc > 0 ? [
                    { label: "Ferias Vencidas", value: resultado.feriasVenc },
                    { label: "1/3 Ferias Vencidas", value: resultado.tercoFeriasVenc },
                  ] : []),
                  { label: "13o Proporcional", value: resultado.decimoTerceiro },
                  { label: "Aviso Previo Indenizado", value: resultado.avisoPrevio },
                  { label: "Multa FGTS", value: resultado.multaFGTS },
                ].map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmt(row.value)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="px-4 py-3 font-bold">TOTAL</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">{fmt(resultado.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-sm mb-2">Detalhes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {resultado.detalhes.map((d, i) => <li key={i}>• {d}</li>)}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-yellow-800">
              <strong>Aviso:</strong> Esta calculadora fornece uma estimativa. Valores reais podem variar
              de acordo com convencoes coletivas, descontos de INSS/IR e outros fatores. Consulte um
              contador ou advogado trabalhista para valores exatos.
            </p>
          </div>
        </>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona a rescisao trabalhista?</h2>
        <p>
          A rescisao trabalhista e o encerramento do contrato de trabalho. Dependendo do tipo
          de desligamento, o trabalhador tem direito a diferentes verbas rescisorias como
          saldo de salario, ferias proporcionais com 1/3, 13o proporcional, aviso previo
          e multa de 40% do FGTS.
        </p>
        <h2>Tipos de demissao</h2>
        <ul>
          <li><strong>Sem justa causa:</strong> O empregador demite o funcionario. Direito a todas as verbas + multa de 40% FGTS + aviso previo.</li>
          <li><strong>Pedido de demissao:</strong> O funcionario pede para sair. Sem multa FGTS e sem aviso previo indenizado.</li>
          <li><strong>Acordo mutuo:</strong> Ambas as partes concordam. Multa de 20% FGTS + metade do aviso previo (reforma trabalhista 2017).</li>
        </ul>
      </section>
    </ToolPage>
  );
}
