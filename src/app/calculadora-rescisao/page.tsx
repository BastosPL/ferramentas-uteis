"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type TipoDemissao = "sem_justa_causa" | "pedido_demissao" | "acordo_mutuo";
type SituacaoAviso = "cumprido" | "nao_cumprido" | "dispensado";
type ModalidadeFGTS = "saque_rescisao" | "saque_aniversario";

const tiposLabel: Record<TipoDemissao, string> = {
  sem_justa_causa: "Demissão sem justa causa",
  pedido_demissao: "Pedido de demissão",
  acordo_mutuo: "Acordo mútuo (reforma trabalhista)",
};

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function diffMesesCalendario(de: Date, ate: Date): number {
  return (ate.getFullYear() - de.getFullYear()) * 12 + (ate.getMonth() - de.getMonth());
}

function diasNoMesCalendario(de: Date, ate: Date, mes: number, ano: number): number {
  const inicioMes = new Date(ano, mes, 1);
  const fimMes = new Date(ano, mes + 1, 0);
  const efetivoDe = de > inicioMes ? de : inicioMes;
  const efetivoAte = ate < fimMes ? ate : fimMes;
  if (efetivoDe > efetivoAte) return 0;
  return Math.floor((efetivoAte.getTime() - efetivoDe.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function CalculadoraRescisao() {
  const [salario, setSalario] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDemissao, setDataDemissao] = useState("");
  const [tipo, setTipo] = useState<TipoDemissao>("sem_justa_causa");
  const [diasTrabalhados, setDiasTrabalhados] = useState("");
  const [baseFGTS, setBaseFGTS] = useState("");
  const [periodosAdquiridos, setPeriodosAdquiridos] = useState("0");
  const [periodosEmDobro, setPeriodosEmDobro] = useState("0");
  const [situacaoAviso, setSituacaoAviso] = useState<SituacaoAviso>("cumprido");
  const [modalidadeFGTS, setModalidadeFGTS] = useState<ModalidadeFGTS>("saque_rescisao");
  const [resultado, setResultado] = useState<{
    saldoSalario: number;
    feriasAdquiridas: number;
    tercoFeriasAdquiridas: number;
    feriasEmDobro: number;
    tercoFeriasEmDobro: number;
    feriasProp: number;
    tercoFeriasProp: number;
    decimoTerceiro: number;
    avisoPrevio: number;
    descontoAviso: number;
    multaFGTS: number;
    totalVerbas: number;
    totalDescontos: number;
    totalLiquido: number;
    infoFGTS: string;
    detalhes: string[];
    diasAviso: number;
    avosTreze: number;
    mesesFeriasProp: number;
  } | null>(null);

  function calcular() {
    const sal = parseFloat(salario) || 0;
    const dias = parseInt(diasTrabalhados) || 0;
    const fgtsBase = parseFloat(baseFGTS) || 0;
    const numPeriodosAdquiridos = parseInt(periodosAdquiridos) || 0;
    const numPeriodosEmDobro = parseInt(periodosEmDobro) || 0;

    if (sal <= 0 || !dataAdmissao || !dataDemissao) return;

    const admissao = parseLocalDate(dataAdmissao);
    const demissao = parseLocalDate(dataDemissao);

    if (demissao <= admissao) return;

    const diasNoMes = dias > 0 ? Math.min(dias, 30) : demissao.getDate();

    // Saldo de salário: salário / 30 * dias trabalhados no último mês
    const saldoSalario = (sal / 30) * diasNoMes;

    // --- Aviso prévio ---
    const totalMesesContrato = diffMesesCalendario(admissao, demissao);
    const anosCompletos = Math.floor(totalMesesContrato / 12);

    let avisoPrevio = 0;
    let descontoAviso = 0;
    let diasAviso = 0;

    if (tipo === "sem_justa_causa") {
      // Lei 12.506/2011: 30 + 3 por ano, max 90
      diasAviso = Math.min(90, 30 + anosCompletos * 3);
      avisoPrevio = (sal / 30) * diasAviso;
    } else if (tipo === "acordo_mutuo") {
      // Art. 484-A, I, "a": metade do aviso indenizado
      diasAviso = Math.min(90, 30 + anosCompletos * 3);
      avisoPrevio = ((sal / 30) * diasAviso) / 2;
    } else if (tipo === "pedido_demissao") {
      // Art. 487 §2º CLT: empregador pode descontar 30 dias
      diasAviso = 0;
      if (situacaoAviso === "nao_cumprido") {
        descontoAviso = sal; // desconto de 30 dias (1 salário)
      }
    }

    // --- Data projetada pelo aviso indenizado (para reflexos em 13º e férias) ---
    // Art. 487 §1º CLT: o período do aviso prévio indenizado integra o tempo de serviço
    let dataEfetiva = new Date(demissao);
    if (tipo === "sem_justa_causa" && diasAviso > 0) {
      dataEfetiva = new Date(demissao.getTime() + diasAviso * 24 * 60 * 60 * 1000);
    } else if (tipo === "acordo_mutuo" && diasAviso > 0) {
      // No acordo mútuo, o aviso é pela metade — projeção pela metade
      const diasProjecao = Math.ceil(diasAviso / 2);
      dataEfetiva = new Date(demissao.getTime() + diasProjecao * 24 * 60 * 60 * 1000);
    }

    // --- Férias ---
    // Período aquisitivo: ciclos de 12 meses a partir da admissão
    // Férias proporcionais: meses do ciclo aquisitivo incompleto atual

    // Calcular meses do período aquisitivo atual (usando data efetiva para projeção)
    const totalMesesEfetivo = diffMesesCalendario(admissao, dataEfetiva);
    const mesesNoCicloAtual = totalMesesEfetivo % 12;

    // Aplicar regra CLT Art. 146 §único: fração >14 dias = mês integral
    const diaAdmissaoNoCiclo = admissao.getDate();
    const ciclosCompletos = Math.floor(totalMesesEfetivo / 12);
    const inicioUltimoCiclo = new Date(admissao);
    inicioUltimoCiclo.setMonth(inicioUltimoCiclo.getMonth() + ciclosCompletos * 12);

    let mesesFeriasProp = mesesNoCicloAtual;
    // Verificar se há fração > 14 dias além dos meses completos
    const fimMesesCompletos = new Date(inicioUltimoCiclo);
    fimMesesCompletos.setMonth(fimMesesCompletos.getMonth() + mesesNoCicloAtual);
    const diasFracao = Math.floor((dataEfetiva.getTime() - fimMesesCompletos.getTime()) / (1000 * 60 * 60 * 24));
    if (diasFracao > 14) {
      mesesFeriasProp++;
    }

    const feriasProp = (sal / 12) * mesesFeriasProp;
    const tercoFeriasProp = feriasProp / 3;

    // Férias de períodos adquiridos (completos, não gozados) — simples
    const feriasAdquiridas = sal * numPeriodosAdquiridos;
    const tercoFeriasAdquiridas = feriasAdquiridas / 3;

    // Férias em dobro (Art. 137 CLT) — períodos vencidos
    const feriasEmDobro = sal * 2 * numPeriodosEmDobro;
    const tercoFeriasEmDobro = feriasEmDobro / 3;

    // --- 13º proporcional (Lei 4.090/1962) ---
    // Conta avos no ano da data efetiva, com regra dos 15 dias
    const anoRef = dataEfetiva.getFullYear();
    const inicioAno = new Date(anoRef, 0, 1);
    const inicioContagem = admissao > inicioAno ? admissao : inicioAno;
    let avosTreze = 0;
    for (let m = inicioContagem.getMonth(); m <= dataEfetiva.getMonth(); m++) {
      const diasTrabMes = diasNoMesCalendario(inicioContagem, dataEfetiva, m, anoRef);
      if (diasTrabMes >= 15) avosTreze++;
    }
    const decimoTerceiro = (sal / 12) * avosTreze;

    // --- Multa FGTS ---
    let multaFGTS = 0;
    if (tipo === "sem_justa_causa") {
      multaFGTS = fgtsBase * 0.4;
    } else if (tipo === "acordo_mutuo") {
      multaFGTS = fgtsBase * 0.2;
    }

    // --- FGTS — informação sobre saque ---
    let infoFGTS = "";
    if (tipo === "sem_justa_causa") {
      if (modalidadeFGTS === "saque_rescisao") {
        infoFGTS = "Na modalidade Saque-Rescisão, o trabalhador pode movimentar o saldo integral da conta vinculada deste vínculo, além da multa rescisória de 40%.";
      } else {
        infoFGTS = "Na modalidade Saque-Aniversário, a multa rescisória de 40% continua sendo devida. Porém, o saldo da conta vinculada não é liberado automaticamente por causa da rescisão — permanece disponível apenas no mês de aniversário, conforme regras vigentes (Lei 13.932/2019, Art. 20-A e 20-D §6º).";
      }
    } else if (tipo === "acordo_mutuo") {
      if (modalidadeFGTS === "saque_rescisao") {
        infoFGTS = "No acordo mútuo com Saque-Rescisão, o trabalhador pode movimentar até 80% do saldo da conta vinculada deste vínculo (Art. 484-A §1º CLT), além da multa rescisória de 20%.";
      } else {
        infoFGTS = "No acordo mútuo com Saque-Aniversário, a multa rescisória de 20% é devida. A movimentação do saldo segue as regras do Saque-Aniversário — o saque de 80% previsto no Art. 484-A §1º não se aplica nesta modalidade.";
      }
    } else {
      infoFGTS = "No pedido de demissão, não há multa rescisória do FGTS e o saldo da conta vinculada não pode ser movimentado por causa da rescisão, independentemente da modalidade de saque.";
    }

    // --- Totais ---
    const totalVerbas = saldoSalario + feriasAdquiridas + tercoFeriasAdquiridas + feriasEmDobro + tercoFeriasEmDobro + feriasProp + tercoFeriasProp + decimoTerceiro + avisoPrevio;
    const totalDescontos = descontoAviso;
    const totalLiquido = totalVerbas - totalDescontos;

    const detalhes: string[] = [];
    detalhes.push(`Tempo de contrato: ${anosCompletos} ano(s) e ${totalMesesContrato % 12} mês(es)`);
    if (tipo === "sem_justa_causa" || tipo === "acordo_mutuo") {
      const label = tipo === "acordo_mutuo" ? " (50% — acordo mútuo)" : "";
      detalhes.push(`Aviso prévio: ${diasAviso} dias${label}`);
      if (dataEfetiva > demissao) {
        detalhes.push(`Data projetada pelo aviso: ${dataEfetiva.toLocaleDateString("pt-BR")}`);
      }
    }
    detalhes.push(`13º proporcional: ${avosTreze} avo(s) de 12`);
    detalhes.push(`Férias proporcionais: ${mesesFeriasProp} mês(es) do período aquisitivo atual`);
    if (numPeriodosAdquiridos > 0) {
      detalhes.push(`Férias adquiridas (não gozadas): ${numPeriodosAdquiridos} período(s)`);
    }
    if (numPeriodosEmDobro > 0) {
      detalhes.push(`Férias vencidas (em dobro): ${numPeriodosEmDobro} período(s)`);
    }
    if (tipo === "sem_justa_causa") {
      detalhes.push("Multa FGTS: 40%");
    } else if (tipo === "acordo_mutuo") {
      detalhes.push("Multa FGTS: 20%");
    }
    if (descontoAviso > 0) {
      detalhes.push(`Desconto do aviso prévio não cumprido: ${fmt(descontoAviso)}`);
    }

    setResultado({
      saldoSalario,
      feriasAdquiridas,
      tercoFeriasAdquiridas,
      feriasEmDobro,
      tercoFeriasEmDobro,
      feriasProp,
      tercoFeriasProp,
      decimoTerceiro,
      avisoPrevio,
      descontoAviso,
      multaFGTS,
      totalVerbas,
      totalDescontos,
      totalLiquido,
      infoFGTS,
      detalhes,
      diasAviso,
      avosTreze,
      mesesFeriasProp,
    });
  }

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolPage title="Calculadora de Rescisão Trabalhista" description="Calcule o valor estimado da sua rescisão trabalhista. Inclui saldo de salário, férias proporcionais, 13º proporcional, aviso prévio e multa do FGTS." accent="rose" icon="📋" slug="calculadora-rescisao">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-800">Tipo de Demissão</label>
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
            <label className="block text-sm font-medium mb-1 text-gray-800">Salário Bruto (R$)</label>
            <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 3000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Base FGTS deste vínculo (R$)</label>
            <input type="number" value={baseFGTS} onChange={(e) => setBaseFGTS(e.target.value)} placeholder="Ex: 5000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <p className="text-xs text-gray-500 mt-1">Informe o montante de depósitos do FGTS referente a este contrato de trabalho, usado como base da multa rescisória. Não utilize o saldo total de todas as contas ou vínculos.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Data de Admissão</label>
            <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Data de Demissão</label>
            <input type="date" value={dataDemissao} onChange={(e) => setDataDemissao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Dias trabalhados no último mês</label>
            <input type="number" value={diasTrabalhados} onChange={(e) => setDiasTrabalhados(e.target.value)} placeholder="Ex: 15" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Modalidade do FGTS</label>
            <select value={modalidadeFGTS} onChange={(e) => setModalidadeFGTS(e.target.value as ModalidadeFGTS)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
              <option value="saque_rescisao">Saque-Rescisão (padrão)</option>
              <option value="saque_aniversario">Saque-Aniversário</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Férias</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Períodos completos de férias não gozadas</label>
              <select value={periodosAdquiridos} onChange={(e) => setPeriodosAdquiridos(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                <option value="0">0 — Não tenho férias acumuladas</option>
                <option value="1">1 período</option>
                <option value="2">2 períodos</option>
                <option value="3">3 períodos</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Períodos aquisitivos de 12 meses já completados cujas férias ainda não foram tiradas nem pagas.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Desses, quantos estão vencidos (em dobro)?</label>
              <select value={periodosEmDobro} onChange={(e) => setPeriodosEmDobro(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white">
                <option value="0">Nenhum</option>
                <option value="1">1 período</option>
                <option value="2">2 períodos</option>
                <option value="3">3 períodos</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Férias vencem quando o período concessivo (12 meses após o aquisitivo) expira sem concessão. Nesse caso, são pagas em dobro (Art. 137 CLT).</p>
            </div>
          </div>
        </div>

        {tipo === "pedido_demissao" && (
          <div className="border-t border-gray-200 pt-4 mt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Situação do Aviso Prévio</h3>
            <div className="flex flex-wrap gap-2">
              {([
                { value: "cumprido" as const, label: "Cumpri/cumprirei o aviso" },
                { value: "nao_cumprido" as const, label: "Não cumpri (haverá desconto)" },
                { value: "dispensado" as const, label: "Dispensado sem desconto" },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSituacaoAviso(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    situacaoAviso === opt.value ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">No pedido de demissão, se o empregado não cumprir o aviso prévio de 30 dias, o empregador pode descontar o valor correspondente da rescisão (Art. 487 §2º CLT).</p>
          </div>
        )}

        <button onClick={calcular} className="w-full bg-rose-600 text-white rounded-lg py-3 font-semibold hover:bg-rose-700 transition-colors cursor-pointer mt-2">
          Calcular Rescisão
        </button>
      </div>

      {resultado && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-green-700 mb-1">Valor Estimado Bruto da Rescisão</p>
            <p className="text-4xl font-bold text-green-800">{fmt(resultado.totalLiquido)}</p>
            <p className="text-xs text-green-600 mt-1">Estimativa bruta — não inclui cálculo completo de INSS, IRRF ou outros descontos legais</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900">Verbas Rescisórias</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Saldo de Salário", value: resultado.saldoSalario },
                  ...(resultado.feriasAdquiridas > 0 ? [
                    { label: "Férias Adquiridas (não gozadas)", value: resultado.feriasAdquiridas },
                    { label: "1/3 Férias Adquiridas", value: resultado.tercoFeriasAdquiridas },
                  ] : []),
                  ...(resultado.feriasEmDobro > 0 ? [
                    { label: "Férias Vencidas (em dobro)", value: resultado.feriasEmDobro },
                    { label: "1/3 Férias Vencidas", value: resultado.tercoFeriasEmDobro },
                  ] : []),
                  { label: "Férias Proporcionais", value: resultado.feriasProp },
                  { label: "1/3 de Férias Proporcionais", value: resultado.tercoFeriasProp },
                  { label: "13º Proporcional", value: resultado.decimoTerceiro },
                  ...(resultado.avisoPrevio > 0 ? [
                    { label: "Aviso Prévio Indenizado", value: resultado.avisoPrevio },
                  ] : []),
                ].map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmt(row.value)}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-4 py-3 font-semibold">Subtotal Verbas</td>
                  <td className="px-4 py-3 text-right font-semibold">{fmt(resultado.totalVerbas)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {resultado.descontoAviso > 0 && (
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden mb-6">
              <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                <h3 className="font-semibold text-sm text-red-900">Descontos</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-red-100">
                    <td className="px-4 py-3">Aviso prévio não cumprido (30 dias)</td>
                    <td className="px-4 py-3 text-right font-medium text-red-700">- {fmt(resultado.descontoAviso)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {resultado.multaFGTS > 0 && (
            <div className="bg-white rounded-xl border border-amber-200 overflow-hidden mb-6">
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                <h3 className="font-semibold text-sm text-amber-900">Multa Rescisória do FGTS</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-amber-100">
                    <td className="px-4 py-3">Multa FGTS ({tipo === "sem_justa_causa" ? "40%" : "20%"})</td>
                    <td className="px-4 py-3 text-right font-medium">{fmt(resultado.multaFGTS)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-sm mb-2 text-blue-900">FGTS — Saldo para Saque</h3>
            <p className="text-sm text-blue-800">{resultado.infoFGTS}</p>
            <p className="text-xs text-blue-600 mt-2">O saldo do FGTS disponível para saque não é somado às verbas rescisórias — é um valor separado, administrado pela Caixa Econômica Federal.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-sm mb-2">Detalhes do Cálculo</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {resultado.detalhes.map((d, i) => <li key={i}>• {d}</li>)}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Aviso Importante:</strong> Esta calculadora fornece uma estimativa com base nas informações inseridas e nas regras gerais aplicáveis. O valor real pode variar conforme o TRCT (Termo de Rescisão do Contrato de Trabalho), descontos de INSS e IRRF, convenção coletiva, situação do FGTS e particularidades do vínculo. Convenções ou acordos coletivos podem estabelecer condições específicas para determinadas categorias. Não constitui aconselhamento jurídico — consulte um contador ou advogado trabalhista para cálculos oficiais.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-sm mb-2 text-gray-900">Base Legal e Metodologia</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 13º Salário Proporcional — Lei 4.090/1962</li>
              <li>• Férias — CLT Art. 129 a 148, Art. 137 (férias vencidas em dobro)</li>
              <li>• Aviso Prévio Proporcional — Lei 12.506/2011</li>
              <li>• Aviso Prévio do Empregado — CLT Art. 487 §2º</li>
              <li>• FGTS e Multa Rescisória — Lei 8.036/1990, Art. 18</li>
              <li>• Saque-Rescisão e Saque-Aniversário — Lei 13.932/2019, Art. 20-A a 20-D</li>
              <li>• Acordo Mútuo — CLT Art. 484-A (Reforma Trabalhista 2017)</li>
            </ul>
          </div>
        </>
      )}

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Rescisão</h2>
          <p className="mb-3">
            A calculadora de rescisão trabalhista permite estimar rapidamente o valor que você tem a receber ao ser desligado de uma empresa. Veja o passo a passo completo para utilizar a ferramenta:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Passo 1 — Selecione o tipo de demissão:</strong> Escolha entre &quot;Demissão sem justa causa&quot; (quando a empresa demite), &quot;Pedido de demissão&quot; (quando você pede para sair) ou &quot;Acordo mútuo&quot; (quando ambas as partes concordam com o desligamento). O tipo escolhido afeta diretamente quais verbas você terá direito.</li>
            <li><strong>Passo 2 — Informe o salário bruto:</strong> Digite o valor do seu salário bruto mensal (antes dos descontos). Esse é o valor que aparece na sua carteira de trabalho ou no holerite como &quot;salário base&quot;.</li>
            <li><strong>Passo 3 — Informe a base do FGTS deste vínculo:</strong> Insira o montante de depósitos do FGTS referente a este contrato de trabalho — é a base para cálculo da multa rescisória. Não confunda com o saldo total de todas as suas contas FGTS. Você pode consultar esse valor no aplicativo FGTS da Caixa Econômica Federal ou pelo site fgts.caixa.gov.br.</li>
            <li><strong>Passo 4 — Preencha as datas:</strong> Informe a data de admissão (quando você começou a trabalhar) e a data de demissão (último dia de trabalho). Essas datas são usadas para calcular o tempo de serviço, férias proporcionais e aviso prévio.</li>
            <li><strong>Passo 5 — Dias trabalhados e férias:</strong> Informe quantos dias você trabalhou no último mês. Selecione quantos períodos completos de férias você tem acumulados (não gozados) e, desses, quantos estão juridicamente vencidos (pagos em dobro).</li>
            <li><strong>Passo 6 — Modalidade do FGTS:</strong> Selecione se você está no Saque-Rescisão (padrão) ou no Saque-Aniversário. Isso afeta o que acontece com o saldo da sua conta FGTS na rescisão.</li>
            <li><strong>Passo 7 — Clique em Calcular:</strong> O resultado aparecerá detalhado, com verbas, descontos, multa FGTS e informações sobre o saque separados em blocos claros.</li>
          </ul>
          <p className="mt-3">
            O cálculo é instantâneo e funciona diretamente no navegador, sem necessidade de cadastro ou instalação de aplicativos. Todos os dados permanecem no seu dispositivo — nenhuma informação é enviada para servidores.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Cálculo da Rescisão Trabalhista</h2>
          <p className="mb-3">
            A rescisão trabalhista é composta por diversas verbas que variam conforme o tipo de desligamento. Entender cada componente é fundamental para saber se o valor que a empresa está oferecendo está correto.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Saldo de Salário</h3>
          <p className="mb-3">
            É o pagamento proporcional aos dias trabalhados no mês da demissão. A fórmula é simples: salário bruto dividido por 30, multiplicado pelo número de dias efetivamente trabalhados. Por exemplo, se você ganha R$ 3.000 e trabalhou 15 dias, o saldo será R$ 1.500.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Férias — Proporcionais, Adquiridas e Vencidas</h3>
          <p className="mb-3">
            A cada 12 meses trabalhados (período aquisitivo), o funcionário adquire direito a 30 dias de férias. Na rescisão, as férias se dividem em três categorias: <strong>férias proporcionais</strong> (meses do período aquisitivo incompleto atual, com fração superior a 14 dias contando como mês completo), <strong>férias adquiridas</strong> (períodos completos que não foram gozados) e <strong>férias vencidas em dobro</strong> (períodos cujo prazo de concessão expirou — Art. 137 CLT). Todas incluem o adicional de 1/3 constitucional.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">13º Salário Proporcional</h3>
          <p className="mb-3">
            O décimo terceiro proporcional é calculado dividindo o salário por 12 e multiplicando pelo número de meses trabalhados no ano da demissão. Meses com 15 dias ou mais trabalhados contam como mês completo para esse cálculo (Lei 4.090/1962, Art. 1º §2º). Na demissão sem justa causa e no acordo mútuo, o período do aviso prévio indenizado é projetado para fins de contagem de avos.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Aviso Prévio</h3>
          <p className="mb-3">
            Na demissão sem justa causa, o aviso prévio é de no mínimo 30 dias, acrescido de 3 dias para cada ano completo trabalhado na mesma empresa, limitado a 90 dias no total (Lei 12.506/2011). Se o empregador optar por indenizar o aviso, o valor é pago integralmente e o período integra o tempo de serviço para cálculo das demais verbas. No acordo mútuo, o aviso prévio indenizado é pago pela metade. No pedido de demissão, se o empregado não cumprir o aviso de 30 dias e não for dispensado pelo empregador, o valor pode ser descontado da rescisão (Art. 487 §2º CLT).
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Multa do FGTS</h3>
          <p className="mb-3">
            Na demissão sem justa causa, o empregador deve depositar multa de 40% sobre o montante de todos os depósitos realizados na conta vinculada durante a vigência do contrato de trabalho (Lei 8.036/1990, Art. 18 §1º). No acordo mútuo, a multa é de 20%. No pedido de demissão, não há multa. Importante: a base da multa são os depósitos deste contrato específico, não o saldo total do FGTS do trabalhador.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Saque-Rescisão vs. Saque-Aniversário</h3>
          <p className="mb-3">
            Desde 2019, o FGTS opera em duas modalidades (Lei 13.932/2019). No <strong>Saque-Rescisão</strong> (padrão), o trabalhador demitido sem justa causa pode sacar 100% do saldo da conta vinculada, além da multa. No <strong>Saque-Aniversário</strong>, a multa rescisória de 40% continua sendo devida, mas o saldo integral da conta não é liberado por causa da rescisão — o trabalhador recebe saques anuais no mês de aniversário. Essa distinção é fundamental para o planejamento financeiro.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferença entre demissão sem justa causa e acordo mútuo?</summary>
              <p className="px-4 pb-3 text-sm">Na demissão sem justa causa, o empregador toma a decisão sozinho e o trabalhador tem direito a todas as verbas rescisórias: aviso prévio integral, multa de 40% do FGTS, saque do FGTS (se estiver no Saque-Rescisão) e seguro-desemprego. No acordo mútuo (Art. 484-A da CLT), ambas as partes concordam com o fim do contrato, e o trabalhador recebe metade do aviso prévio indenizado, multa de 20% do FGTS, pode movimentar até 80% do saldo (no Saque-Rescisão), mas não tem direito ao seguro-desemprego.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como consultar a base de depósitos do FGTS deste vínculo?</summary>
              <p className="px-4 pb-3 text-sm">Você pode consultar pelo aplicativo FGTS da Caixa Econômica Federal (disponível para Android e iOS), pelo site fgts.caixa.gov.br, ou em qualquer agência da Caixa. No extrato, verifique os depósitos associados ao empregador atual — é essa soma (atualizada monetariamente) que serve de base para a multa rescisória, e não o saldo total de todas as contas.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O resultado é bruto ou líquido?</summary>
              <p className="px-4 pb-3 text-sm">O resultado é uma estimativa bruta. Na prática, incidem descontos de INSS sobre o saldo de salário e 13º proporcional, e pode haver retenção de Imposto de Renda dependendo do valor total. Para um cálculo líquido preciso, consulte o departamento de RH ou um contador.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Tenho direito a seguro-desemprego?</summary>
              <p className="px-4 pb-3 text-sm">O seguro-desemprego é pago apenas na demissão sem justa causa. O trabalhador precisa ter trabalhado pelo menos 12 meses nos últimos 18 meses (primeira solicitação), 9 meses nos últimos 12 meses (segunda solicitação) ou 6 meses (demais solicitações). No pedido de demissão e no acordo mútuo, não há direito ao seguro-desemprego.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual o prazo para a empresa pagar a rescisão?</summary>
              <p className="px-4 pb-3 text-sm">De acordo com a CLT (Art. 477 §6º, com redação dada pela Lei 13.467/2017), o pagamento das verbas rescisórias deve ser efetuado em até 10 dias contados do término do contrato, independentemente do tipo de demissão ou da forma de cumprimento do aviso prévio.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O que são férias vencidas e como saber se as minhas estão vencidas?</summary>
              <p className="px-4 pb-3 text-sm">Férias vencidas são aquelas cujo período concessivo expirou. O período aquisitivo é de 12 meses de trabalho; após completá-lo, o empregador tem mais 12 meses (período concessivo) para conceder as férias. Se esse prazo passar sem concessão, as férias são pagas em dobro, incluindo o terço constitucional (Art. 137 da CLT). Exemplo: se você completou 12 meses em janeiro de 2024, o empregador tinha até janeiro de 2025 para conceder as férias. Se não concedeu, são vencidas.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Estou no Saque-Aniversário. O que acontece se eu for demitido?</summary>
              <p className="px-4 pb-3 text-sm">Se você está no Saque-Aniversário e for demitido sem justa causa, a multa rescisória de 40% do FGTS continua sendo devida pelo empregador. Porém, o saldo integral da conta vinculada não é liberado automaticamente — você continua recebendo saques anuais no mês de aniversário. Para voltar ao Saque-Rescisão, é necessário solicitar a alteração, que levará 25 meses para ser efetivada (Art. 20-C §1º, Lei 13.932/2019).</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Práticas e Exemplos do Dia a Dia</h2>
          <p className="mb-3">
            Entender seus direitos trabalhistas é fundamental para não ser prejudicado no momento da rescisão. Veja algumas situações práticas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Exemplo — Demissão sem justa causa:</strong> Maria trabalhou por 3 anos e 4 meses com salário de R$ 3.000. Ela tem direito a aviso prévio de 39 dias (30 + 3×3 anos), férias proporcionais de 4 meses do período aquisitivo atual, 13º proporcional e multa de 40% sobre os depósitos do FGTS deste contrato. Com base FGTS de R$ 12.000, só a multa já soma R$ 4.800.</li>
            <li><strong>Exemplo — Acordo mútuo:</strong> João quer sair da empresa, mas deseja sacar parte do FGTS. Negociando um acordo mútuo, ele recebe metade do aviso prévio, multa de 20% do FGTS e, se estiver no Saque-Rescisão, pode movimentar até 80% do saldo. A desvantagem é que não terá direito ao seguro-desemprego.</li>
            <li><strong>Exemplo — Pedido de demissão:</strong> Ana pede demissão após 8 meses. Ela recebe saldo de salário, férias proporcionais com 1/3 e 13º proporcional, mas não tem direito a aviso prévio indenizado, multa do FGTS nem seguro-desemprego. Se não cumprir os 30 dias de aviso e o empregador não dispensá-la, poderá ter o valor de um salário descontado da rescisão.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Muitos trabalhadores não sabem que o aviso prévio proporcional (3 dias extras por ano) só se aplica quando a empresa demite. Quando o funcionário pede demissão, o aviso prévio é sempre de 30 dias, sem acréscimo.
          </p>
          <p className="mt-2">
            <strong>Dica importante:</strong> Guarde sempre seus holerites, contracheques e comprovantes de depósito do FGTS. Esses documentos são essenciais caso haja divergência nos valores da rescisão. Se perceber que o valor pago está incorreto, você pode reclamar na Justiça do Trabalho em até 2 anos após o desligamento (prescrição bienal), cobrando direitos dos últimos 5 anos trabalhados (prescrição quinquenal).
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
