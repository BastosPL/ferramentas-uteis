"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type DadosCEP = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  ddd: string;
};

function formatarCEP(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 5) return n;
  return n.replace(/(\d{5})(\d+)/, "$1-$2");
}

export default function ConsultaCEP() {
  const [aba, setAba] = useState<"cep" | "endereco">("cep");

  // Consulta por CEP
  const [cepInput, setCepInput] = useState("");
  const [dados, setDados] = useState<DadosCEP | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");

  // Busca por endereço
  const [uf, setUf] = useState("PE");
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [resultados, setResultados] = useState<DadosCEP[]>([]);
  const [buscandoEnd, setBuscandoEnd] = useState(false);
  const [erroEnd, setErroEnd] = useState("");

  async function consultarCEP() {
    const num = cepInput.replace(/\D/g, "");
    if (num.length !== 8) {
      setErro("Digite um CEP com 8 dígitos.");
      return;
    }

    setBuscando(true);
    setErro("");
    setDados(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`https://viacep.com.br/ws/${num}/json/`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error("Erro ao consultar. Tente novamente.");

      const data = await res.json();
      if (data.erro) {
        setErro("CEP não encontrado. Verifique o número digitado.");
        return;
      }
      setDados(data);
    } catch (err) {
      setErro(err instanceof Error && err.name === "AbortError"
        ? "Tempo de conexão esgotado. Tente novamente."
        : "Erro de conexão. Verifique sua internet e tente novamente.");
    }
    setBuscando(false);
  }

  async function buscarPorEndereco() {
    if (cidade.trim().length < 3) {
      setErroEnd("Digite pelo menos 3 caracteres para a cidade.");
      return;
    }
    if (rua.trim().length < 3) {
      setErroEnd("Digite pelo menos 3 caracteres para a rua.");
      return;
    }

    setBuscandoEnd(true);
    setErroEnd("");
    setResultados([]);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(
        `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(cidade.trim())}/${encodeURIComponent(rua.trim())}/json/`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) throw new Error("Erro ao buscar. Tente novamente.");

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setErroEnd("Nenhum CEP encontrado para esse endereço. Tente termos mais genéricos.");
        return;
      }
      setResultados(data);
    } catch (err) {
      setErroEnd(err instanceof Error && err.name === "AbortError"
        ? "Tempo de conexão esgotado. Tente novamente."
        : "Erro de conexão. Verifique sua internet e tente novamente.");
    }
    setBuscandoEnd(false);
  }

  const UFS = [
    "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
    "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
  ];

  function copiarTexto(texto: string) {
    navigator.clipboard.writeText(texto);
  }

  return (
    <ToolPage
      title="Consulta CEP"
      description="Encontre endereços completos por CEP ou descubra o CEP de qualquer rua do Brasil."
      accent="teal"
      slug="consulta-cep"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {([
          ["cep", "Buscar por CEP"],
          ["endereco", "Buscar por Endereço"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              aba === key ? "bg-white text-teal-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── BUSCA POR CEP ── */}
      {aba === "cep" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultar Endereço pelo CEP</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={cepInput}
              onChange={(e) => setCepInput(formatarCEP(e.target.value))}
              placeholder="00000-000"
              maxLength={9}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-mono"
              onKeyDown={(e) => e.key === "Enter" && consultarCEP()}
            />
            <button
              onClick={consultarCEP}
              disabled={buscando}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {buscando ? "Buscando..." : "Consultar"}
            </button>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{erro}</p>
            </div>
          )}

          {buscando && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3" />
              <p className="text-gray-500">Consultando ViaCEP...</p>
            </div>
          )}

          {dados && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mt-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">CEP {dados.cep}</h3>
                <button
                  onClick={() => copiarTexto(`${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}, CEP ${dados.cep}`)}
                  className="text-xs bg-white border border-teal-200 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-100 cursor-pointer whitespace-nowrap"
                >
                  Copiar endereço
                </button>
              </div>
              <dl className="space-y-2 text-sm">
                {dados.logradouro && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Logradouro</dt>
                    <dd className="text-gray-900 font-medium text-right max-w-[65%]">{dados.logradouro}</dd>
                  </div>
                )}
                {dados.complemento && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Complemento</dt>
                    <dd className="text-gray-900 font-medium text-right max-w-[65%]">{dados.complemento}</dd>
                  </div>
                )}
                {dados.bairro && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Bairro</dt>
                    <dd className="text-gray-900 font-medium">{dados.bairro}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Cidade</dt>
                  <dd className="text-gray-900 font-medium">{dados.localidade}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Estado</dt>
                  <dd className="text-gray-900 font-medium">{dados.uf}</dd>
                </div>
                {dados.ibge && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Código IBGE</dt>
                    <dd className="text-gray-900 font-medium">{dados.ibge}</dd>
                  </div>
                )}
                {dados.ddd && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">DDD</dt>
                    <dd className="text-gray-900 font-medium">({dados.ddd})</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      )}

      {/* ── BUSCA POR ENDEREÇO ── */}
      {aba === "endereco" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Encontrar CEP pelo Endereço</h2>
          <p className="text-sm text-gray-500 mb-4">
            Digite o estado, a cidade e pelo menos parte do nome da rua para encontrar o CEP.
          </p>

          <div className="grid md:grid-cols-[100px_1fr] gap-3 mb-3">
            <select
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {UFS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade (ex: Recife)"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Nome da rua (ex: Boa Viagem)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onKeyDown={(e) => e.key === "Enter" && buscarPorEndereco()}
            />
            <button
              onClick={buscarPorEndereco}
              disabled={buscandoEnd}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {buscandoEnd ? "Buscando..." : "Buscar CEP"}
            </button>
          </div>

          {erroEnd && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{erroEnd}</p>
            </div>
          )}

          {buscandoEnd && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3" />
              <p className="text-gray-500">Buscando CEPs...</p>
            </div>
          )}

          {resultados.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-3">{resultados.length} resultado{resultados.length > 1 ? "s" : ""} encontrado{resultados.length > 1 ? "s" : ""}</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {resultados.map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{r.logradouro || "Logradouro não especificado"}</p>
                      <p className="text-xs text-gray-500">{r.bairro ? `${r.bairro} — ` : ""}{r.localidade}/{r.uf}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
                        {r.cep}
                      </span>
                      <button
                        onClick={() => copiarTexto(r.cep)}
                        className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CONTEÚDO EDITORIAL ── */}
      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que é o CEP?</h2>
        <p>
          O CEP (Código de Endereçamento Postal) é um sistema numérico criado pelos Correios
          do Brasil em 1971 para organizar e agilizar a entrega de correspondências. Composto
          por 8 dígitos no formato XXXXX-XXX, cada parte do código identifica uma região,
          sub-região, setor, subsetor e divisor de subsetor do território nacional.
        </p>

        <h2>Como funciona a estrutura do CEP?</h2>
        <p>
          O primeiro dígito do CEP indica a região postal do Brasil. Por exemplo, CEPs que
          começam com 0 e 1 pertencem à Grande São Paulo e interior de São Paulo, enquanto
          CEPs iniciados com 5 correspondem a estados do Nordeste como Bahia, Sergipe e
          Pernambuco. Os dígitos seguintes refinam a localização até chegar ao logradouro
          ou grupo de logradouros específico.
        </p>

        <h2>Para que serve a consulta de CEP?</h2>
        <p>
          A consulta de CEP é essencial para diversas situações do dia a dia: preencher
          formulários de cadastro em lojas online, enviar correspondências e encomendas,
          calcular fretes de entrega, localizar endereços em sistemas de GPS e validar
          dados de clientes em sistemas empresariais. Nossa ferramenta utiliza a API gratuita
          do ViaCEP, mantida com dados oficiais dos Correios.
        </p>

        <h2>A consulta é gratuita?</h2>
        <p>
          Sim, a consulta é 100% gratuita e sem limite de uso. Os dados são obtidos em
          tempo real da base do ViaCEP, que utiliza informações oficiais dos Correios do Brasil.
          Nenhuma informação é armazenada em nossos servidores.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3">
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Como descobrir o CEP de um endereço?</summary>
            <p className="text-gray-700 mt-2">Use a aba &quot;Buscar por Endereço&quot; acima. Selecione o estado, digite o nome da cidade e pelo menos parte do nome da rua. A ferramenta retornará todos os CEPs que correspondem à busca. Quanto mais específico o nome da rua, mais preciso será o resultado.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">O CEP retornado está correto e atualizado?</summary>
            <p className="text-gray-700 mt-2">Sim. Os dados são obtidos em tempo real do ViaCEP, que utiliza a base oficial dos Correios do Brasil. A base é atualizada periodicamente conforme os Correios publicam alterações na distribuição de CEPs.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Por que alguns CEPs não retornam o nome da rua?</summary>
            <p className="text-gray-700 mt-2">CEPs genéricos (que terminam em 000) representam uma cidade inteira ou uma grande região e não estão vinculados a um logradouro específico. Isso é comum em cidades pequenas que possuem um único CEP para toda a área urbana. Nesses casos, o campo logradouro fica vazio.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Posso usar essa ferramenta para integrar no meu sistema?</summary>
            <p className="text-gray-700 mt-2">Nossa ferramenta é voltada para consultas manuais pelo navegador. Se você precisa integrar consultas de CEP no seu sistema ou aplicativo, recomendamos usar diretamente a API do ViaCEP (viacep.com.br), que é gratuita e possui documentação completa para desenvolvedores.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Qual a diferença entre CEP genérico e CEP específico?</summary>
            <p className="text-gray-700 mt-2">O CEP genérico (sufixo 000) abrange toda uma localidade ou grande área — geralmente cidades pequenas onde um único código atende toda a população. O CEP específico identifica um logradouro ou trecho de logradouro em particular, sendo mais comum em capitais e cidades maiores que possuem alta densidade de entregas postais.</p>
          </details>
        </div>
      </section>
    </ToolPage>
  );
}
