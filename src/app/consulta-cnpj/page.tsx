"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

/* ── helpers ── */
function somenteNumeros(v: string) {
  return v.replace(/\D/g, "");
}

function formatarCNPJ(v: string) {
  const n = somenteNumeros(v).slice(0, 14);
  if (n.length <= 2) return n;
  if (n.length <= 5) return n.replace(/(\d{2})(\d+)/, "$1.$2");
  if (n.length <= 8) return n.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  if (n.length <= 12) return n.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
  return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, "$1.$2.$3/$4-$5");
}

function validarCNPJ(cnpj: string): boolean {
  const n = somenteNumeros(cnpj);
  if (n.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(n)) return false;

  const calc = (digits: string, weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) sum += parseInt(digits[i]) * weights[i];
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calc(n, w1);
  const d2 = calc(n, w2);
  return parseInt(n[12]) === d1 && parseInt(n[13]) === d2;
}

/* ── IE validation rules per state ── */
const IE_RULES: Record<string, { mask: string; len: number[]; validate: (ie: string) => boolean }> = {
  AC: { mask: "01.XXX.XXX/XXX-XX", len: [13], validate: (ie) => ie.startsWith("01") && ie.length === 13 },
  AL: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.startsWith("24") && ie.length === 9 },
  AM: { mask: "XX.XXX.XXX-X", len: [9], validate: (ie) => ie.length === 9 },
  AP: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.startsWith("03") && ie.length === 9 },
  BA: { mask: "XXXXXXX-XX", len: [9], validate: (ie) => ie.length === 9 },
  CE: { mask: "XXXXXXXX-X", len: [9], validate: (ie) => ie.length === 9 },
  DF: { mask: "XXXXXXXXXXX-XX", len: [13], validate: (ie) => ie.startsWith("07") && ie.length === 13 },
  ES: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.length === 9 },
  GO: { mask: "XX.XXX.XXX-X", len: [9], validate: (ie) => ["10", "11", "15", "20", "29"].some(p => ie.startsWith(p)) && ie.length === 9 },
  MA: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.startsWith("12") && ie.length === 9 },
  MG: { mask: "XXX.XXX.XXX/XXXX", len: [13], validate: (ie) => ie.length === 13 },
  MS: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.startsWith("28") && ie.length === 9 },
  MT: { mask: "XXXXXXXXXXX", len: [11], validate: (ie) => ie.length === 11 },
  PA: { mask: "XX-XXXXXX-X", len: [9], validate: (ie) => ie.startsWith("15") && ie.length === 9 },
  PB: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.startsWith("06") && ie.length === 9 },
  PE: { mask: "XXXXXXX-XX", len: [9], validate: (ie) => ie.length === 9 },
  PI: { mask: "XXXXXXXXX", len: [9], validate: (ie) => ie.length === 9 },
  PR: { mask: "XXXXXXXX-XX", len: [10], validate: (ie) => ie.length === 10 },
  RJ: { mask: "XX.XXX.XX-X", len: [8], validate: (ie) => ie.length === 8 },
  RN: { mask: "XX.XXX.XXX-X", len: [9, 10], validate: (ie) => ie.startsWith("20") && (ie.length === 9 || ie.length === 10) },
  RO: { mask: "XXXXXXXXXXXXXX", len: [14], validate: (ie) => ie.length === 14 },
  RR: { mask: "XXXXXXXX-X", len: [9], validate: (ie) => ie.startsWith("24") && ie.length === 9 },
  RS: { mask: "XXX/XXXXXXX", len: [10], validate: (ie) => ie.length === 10 },
  SC: { mask: "XXX.XXX.XXX", len: [9], validate: (ie) => ie.length === 9 },
  SE: { mask: "XXXXXXXXX-X", len: [9], validate: (ie) => ie.length === 9 },
  SP: { mask: "XXX.XXX.XXX.XXX", len: [12, 13], validate: (ie) => ie.length === 12 || ie.length === 13 },
  TO: { mask: "XXXXXXXXXXX", len: [11], validate: (ie) => ie.length === 11 },
};

const UF_LIST = Object.keys(IE_RULES).sort();

type DadosCNPJ = {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios: { codigo: number; descricao: string }[];
  natureza_juridica: string;
  porte: string;
  capital_social: number;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
  email: string;
  qsa: { nome: string; qual: string }[];
  opcao_pelo_simples: boolean | null;
  opcao_pelo_mei: boolean | null;
};

export default function ConsultaCNPJ() {
  // Consulta CNPJ
  const [cnpjInput, setCnpjInput] = useState("");
  const [dados, setDados] = useState<DadosCNPJ | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState("");

  // Validador CNPJ
  const [cnpjValidar, setCnpjValidar] = useState("");
  const [resultadoValidacao, setResultadoValidacao] = useState<boolean | null>(null);

  // Validador IE
  const [ieInput, setIeInput] = useState("");
  const [ufSelecionada, setUfSelecionada] = useState("SP");
  const [resultadoIE, setResultadoIE] = useState<{ valido: boolean; msg: string } | null>(null);

  // Tab
  const [aba, setAba] = useState<"consulta" | "validar" | "ie">("consulta");

  async function consultarCNPJ() {
    const num = somenteNumeros(cnpjInput);
    if (num.length !== 14) {
      setErroBusca("Digite um CNPJ com 14 digitos.");
      return;
    }
    if (!validarCNPJ(num)) {
      setErroBusca("CNPJ invalido. Verifique os digitos.");
      return;
    }

    setBuscando(true);
    setErroBusca("");
    setDados(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${num}`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 404) throw new Error("CNPJ nao encontrado na base da Receita Federal.");
        throw new Error("Erro ao consultar. Tente novamente.");
      }

      const data = await res.json();
      setDados(data);
    } catch (err) {
      setErroBusca(err instanceof Error ? err.message : "Erro de conexao. Tente novamente.");
    }
    setBuscando(false);
  }

  function handleValidarCNPJ() {
    const num = somenteNumeros(cnpjValidar);
    if (num.length === 0) return;
    setResultadoValidacao(validarCNPJ(num));
  }

  function handleValidarIE() {
    const num = somenteNumeros(ieInput);
    if (num.length === 0) {
      setResultadoIE({ valido: false, msg: "Digite uma Inscricao Estadual." });
      return;
    }
    const rule = IE_RULES[ufSelecionada];
    if (!rule) {
      setResultadoIE({ valido: false, msg: "UF nao encontrada." });
      return;
    }
    const valido = rule.validate(num);
    setResultadoIE({
      valido,
      msg: valido
        ? `IE valida para ${ufSelecionada}. Formato: ${rule.mask} (${rule.len.join(" ou ")} digitos)`
        : `IE invalida para ${ufSelecionada}. Esperado: ${rule.len.join(" ou ")} digitos no formato ${rule.mask}`,
    });
  }

  function situacaoColor(sit: string) {
    if (sit === "02" || sit?.toLowerCase().includes("ativa")) return "text-green-700 bg-green-100";
    if (sit === "08" || sit?.toLowerCase().includes("baixa")) return "text-red-700 bg-red-100";
    return "text-yellow-700 bg-yellow-100";
  }

  return (
    <ToolPage
      title="Consulta CNPJ"
      description="Consulte dados da Receita Federal, valide CNPJ e Inscricao Estadual gratuitamente."
      accent="blue"
      icon="🏢"
      slug="consulta-cnpj"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {([
          ["consulta", "🔍 Consultar CNPJ"],
          ["validar", "✅ Validar CNPJ"],
          ["ie", "📋 Validar IE"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              aba === key ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── CONSULTA CNPJ ── */}
      {aba === "consulta" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultar CNPJ na Receita Federal</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={cnpjInput}
              onChange={(e) => setCnpjInput(formatarCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
              onKeyDown={(e) => e.key === "Enter" && consultarCNPJ()}
            />
            <button
              onClick={consultarCNPJ}
              disabled={buscando}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {buscando ? "Buscando..." : "Consultar"}
            </button>
          </div>

          {erroBusca && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{erroBusca}</p>
            </div>
          )}

          {buscando && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
              <p className="text-gray-500">Consultando Receita Federal...</p>
            </div>
          )}

          {dados && (
            <div className="space-y-6 mt-4">
              {/* Header da empresa */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{dados.razao_social}</h3>
                    {dados.nome_fantasia && (
                      <p className="text-gray-600 mt-1">Nome Fantasia: <strong>{dados.nome_fantasia}</strong></p>
                    )}
                    <p className="text-gray-500 text-sm mt-1 font-mono">{formatarCNPJ(dados.cnpj)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${situacaoColor(dados.situacao_cadastral || dados.descricao_situacao_cadastral)}`}>
                    {dados.descricao_situacao_cadastral || `Situacao ${dados.situacao_cadastral}`}
                  </span>
                </div>
              </div>

              {/* Grid de informacoes */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Dados Gerais */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">📄 Dados Gerais</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Natureza Juridica</dt>
                      <dd className="text-gray-900 font-medium text-right max-w-[60%]">{dados.natureza_juridica || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Porte</dt>
                      <dd className="text-gray-900 font-medium">{dados.porte || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Capital Social</dt>
                      <dd className="text-gray-900 font-medium">
                        {dados.capital_social ? `R$ ${dados.capital_social.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Abertura</dt>
                      <dd className="text-gray-900 font-medium">{dados.data_inicio_atividade || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Simples Nacional</dt>
                      <dd className="text-gray-900 font-medium">
                        {dados.opcao_pelo_simples === true ? "Sim" : dados.opcao_pelo_simples === false ? "Nao" : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">MEI</dt>
                      <dd className="text-gray-900 font-medium">
                        {dados.opcao_pelo_mei === true ? "Sim" : dados.opcao_pelo_mei === false ? "Nao" : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Endereco */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">📍 Endereco</h4>
                  <p className="text-sm text-gray-900">
                    {[dados.logradouro, dados.numero, dados.complemento].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-sm text-gray-900">{dados.bairro}</p>
                  <p className="text-sm text-gray-900">
                    {dados.municipio} - {dados.uf}
                  </p>
                  <p className="text-sm text-gray-500">CEP: {dados.cep}</p>
                  {dados.ddd_telefone_1 && (
                    <p className="text-sm text-gray-500 mt-2">Tel: {dados.ddd_telefone_1}</p>
                  )}
                  {dados.email && (
                    <p className="text-sm text-gray-500">Email: {dados.email.toLowerCase()}</p>
                  )}
                </div>
              </div>

              {/* Atividade */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">💼 Atividade Economica</h4>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CNAE Principal</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {dados.cnae_fiscal} - {dados.cnae_fiscal_descricao}
                  </p>
                </div>
                {dados.cnaes_secundarios && dados.cnaes_secundarios.length > 0 && dados.cnaes_secundarios[0]?.codigo !== 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">CNAEs Secundarios</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {dados.cnaes_secundarios.filter(c => c.codigo !== 0).map((c, i) => (
                        <p key={i} className="text-xs text-gray-700">{c.codigo} - {c.descricao}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Socios */}
              {dados.qsa && dados.qsa.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">👥 Quadro Societario ({dados.qsa.length})</h4>
                  <div className="space-y-2">
                    {dados.qsa.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                        <span className="text-sm text-gray-900 font-medium">{s.nome}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{s.qual}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── VALIDAR CNPJ ── */}
      {aba === "validar" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Validar CNPJ</h2>
          <p className="text-sm text-gray-500 mb-4">
            Verifica se os digitos verificadores do CNPJ estao corretos (validacao matematica).
          </p>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={cnpjValidar}
              onChange={(e) => { setCnpjValidar(formatarCNPJ(e.target.value)); setResultadoValidacao(null); }}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleValidarCNPJ()}
            />
            <button
              onClick={handleValidarCNPJ}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
            >
              Validar
            </button>
          </div>

          {resultadoValidacao !== null && (
            <div className={`rounded-lg p-4 ${resultadoValidacao ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className={`font-semibold ${resultadoValidacao ? "text-green-700" : "text-red-700"}`}>
                {resultadoValidacao ? "✅ CNPJ valido!" : "❌ CNPJ invalido!"}
              </p>
              <p className={`text-sm mt-1 ${resultadoValidacao ? "text-green-600" : "text-red-600"}`}>
                {resultadoValidacao
                  ? "Os digitos verificadores estao corretos. Isso nao garante que o CNPJ esteja ativo na Receita Federal."
                  : "Os digitos verificadores nao conferem. Verifique o numero digitado."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── VALIDAR IE ── */}
      {aba === "ie" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Validar Inscricao Estadual</h2>
          <p className="text-sm text-gray-500 mb-4">
            Verifica se o formato da Inscricao Estadual esta correto para o estado selecionado.
          </p>

          <div className="grid md:grid-cols-[120px_1fr_auto] gap-3 mb-4">
            <select
              value={ufSelecionada}
              onChange={(e) => { setUfSelecionada(e.target.value); setResultadoIE(null); }}
              className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UF_LIST.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            <input
              type="text"
              value={ieInput}
              onChange={(e) => { setIeInput(e.target.value); setResultadoIE(null); }}
              placeholder={`Formato: ${IE_RULES[ufSelecionada]?.mask || ""}`}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleValidarIE()}
            />
            <button
              onClick={handleValidarIE}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Validar
            </button>
          </div>

          {resultadoIE && (
            <div className={`rounded-lg p-4 ${resultadoIE.valido ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className={`font-semibold ${resultadoIE.valido ? "text-green-700" : "text-red-700"}`}>
                {resultadoIE.valido ? "✅ Formato valido!" : "❌ Formato invalido!"}
              </p>
              <p className={`text-sm mt-1 ${resultadoIE.valido ? "text-green-600" : "text-red-600"}`}>
                {resultadoIE.msg}
              </p>
            </div>
          )}

          {/* Tabela de formatos por estado */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Formatos por Estado</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {UF_LIST.map((uf) => (
                <div key={uf} className="bg-gray-50 rounded-lg px-3 py-2 text-xs">
                  <span className="font-semibold text-gray-900">{uf}</span>
                  <span className="text-gray-500 ml-2">{IE_RULES[uf].len.join("/")} dig. — {IE_RULES[uf].mask}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como consultar um CNPJ?</h2>
        <p>
          Digite o CNPJ completo (14 digitos) no campo acima e clique em Consultar.
          Os dados sao obtidos diretamente da base publica da Receita Federal e incluem:
          razao social, nome fantasia, situacao cadastral, CNAE, endereco, telefone, email,
          capital social, quadro societario e opcao pelo Simples Nacional ou MEI.
        </p>

        <h2>O que e a Inscricao Estadual (IE)?</h2>
        <p>
          A Inscricao Estadual e o registro do contribuinte no cadastro do ICMS junto a
          Secretaria da Fazenda (SEFAZ) de cada estado. Cada UF tem um formato proprio
          com quantidade de digitos diferente. Use o validador acima para verificar se
          o formato da IE esta correto para o estado desejado.
        </p>

        <h2>A consulta e gratuita?</h2>
        <p>
          Sim, a consulta e 100% gratuita e utiliza dados publicos da Receita Federal.
          Nenhuma informacao e armazenada em nossos servidores.
        </p>
      </section>
    </ToolPage>
  );
}
