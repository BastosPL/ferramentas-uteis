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

      {/* ── CONTEUDO EDITORIAL ── */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Consulta de CEP</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>A ferramenta possui duas abas com funcoes complementares:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Buscar por CEP:</strong> Digite os 8 digitos do CEP (com ou sem hifen) e clique em &quot;Consultar&quot; ou pressione Enter. O resultado exibe logradouro, bairro, cidade, estado, codigo IBGE e DDD da regiao. Use o botao &quot;Copiar endereco&quot; para levar o endereco completo formatado para a area de transferencia.</li>
            <li><strong>Buscar por Endereco:</strong> Selecione o estado no dropdown, digite o nome da cidade e pelo menos parte do nome da rua. A ferramenta retorna todos os CEPs que correspondem a busca. Cada resultado mostra o logradouro, bairro, cidade e CEP, com botao de copiar individual. Essa aba e ideal quando voce tem o endereco mas nao sabe o CEP.</li>
          </ul>
          <p>A consulta acessa a API publica do ViaCEP em tempo real. Isso significa que voce precisa de conexao com a internet para usar esta ferramenta — diferente das outras ferramentas do site, que funcionam offline.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Estrutura do CEP</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>O CEP (Codigo de Enderecamento Postal) foi criado pelos Correios em 1971 e possui 8 digitos no formato XXXXX-XXX. Cada posicao tem significado:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>1o digito — Regiao postal:</strong> 0 e 1 = Grande Sao Paulo e interior de SP; 2 = Rio de Janeiro e Espirito Santo; 3 = Minas Gerais; 4 = Bahia e Sergipe; 5 = Pernambuco, Alagoas, Paraiba e Rio Grande do Norte; 6 = Ceara, Piaui, Maranhao, Para e Amapa; 7 = Distrito Federal, Goias, Tocantins, Mato Grosso, Mato Grosso do Sul, Rondonia e Acre; 8 = Parana e Santa Catarina; 9 = Rio Grande do Sul.</li>
            <li><strong>2o e 3o digitos — Sub-regiao e setor:</strong> Refinam a localizacao dentro do estado, identificando a cidade ou grupo de cidades.</li>
            <li><strong>4o e 5o digitos — Subsetor e divisor:</strong> Indicam o bairro ou regiao dentro da cidade.</li>
            <li><strong>Sufixo (3 ultimos digitos):</strong> Identificam o logradouro especifico. CEPs terminados em 000 sao &quot;genericos&quot; — representam uma cidade inteira, comum em municipios pequenos com pouco volume de correspondencia.</li>
          </ul>
          <p>Quando voce consulta um CEP aqui, a ferramenta envia apenas o numero do CEP para a API do ViaCEP (viacep.com.br), que retorna os dados do endereco. Na busca por endereco, sao enviados estado, cidade e nome da rua. O ViaCEP utiliza a base oficial dos Correios, atualizada periodicamente.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Por que alguns CEPs nao retornam resultado?</summary>
            <p className="text-gray-700 mt-2">Tres motivos comuns: (1) CEPs de loteamentos novos podem demorar meses para entrar na base dos Correios e, consequentemente, no ViaCEP. (2) Areas rurais frequentemente usam o CEP generico da cidade — o CEP especifico de uma fazenda ou sitio pode nao existir. (3) CEPs antigos que foram desativados apos reestruturacoes postais retornam erro. Em todos esses casos, tente buscar pelo endereco na segunda aba.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Que dados sao enviados para a internet durante a consulta?</summary>
            <p className="text-gray-700 mt-2">Na busca por CEP, apenas o numero de 8 digitos e enviado para a API do ViaCEP. Na busca por endereco, sao enviados o estado (UF), o nome da cidade e o trecho do nome da rua. O ViaCEP nao registra quem fez a consulta e nao exige autenticacao. Nenhuma outra informacao pessoal e transmitida.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Por que alguns CEPs nao mostram o nome da rua?</summary>
            <p className="text-gray-700 mt-2">CEPs genericos (sufixo 000) cobrem uma cidade inteira ou grande regiao e nao estao vinculados a um logradouro. Isso e padrao em municipios com menos de 50 mil habitantes, onde um unico CEP atende toda a area urbana. Capitais e cidades grandes possuem CEPs especificos por rua ou ate por trecho de rua.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">O que e o codigo IBGE exibido no resultado?</summary>
            <p className="text-gray-700 mt-2">E o codigo numerico atribuido pelo Instituto Brasileiro de Geografia e Estatistica a cada municipio do Brasil. Ele e usado em sistemas governamentais, notas fiscais eletronicas (NF-e) e integracoes com a Receita Federal. Se voce precisa do codigo IBGE de uma cidade, basta consultar qualquer CEP dela aqui.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Posso integrar essa consulta no meu sistema?</summary>
            <p className="text-gray-700 mt-2">Esta ferramenta e voltada para consultas manuais pelo navegador. Para integrar em sistemas, use diretamente a API do ViaCEP (viacep.com.br), que e gratuita e aceita requisicoes nos formatos JSON, XML e PIPED. A documentacao oficial explica os endpoints e limites de uso.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Calculo de frete em lojas online:</strong> Muitos e-commerces pedem o CEP para estimar o frete antes da compra. Se voce esta cotando para um cliente em outra cidade, use a busca por endereco para encontrar o CEP dele rapidamente.</li>
            <li><strong>Validacao de cadastros:</strong> Ao preencher formularios que pedem CEP + endereco, consulte o CEP primeiro para verificar se o endereco que voce tem corresponde. Isso evita devolucoes de encomendas por endereco incorreto.</li>
            <li><strong>Busca parcial de rua:</strong> Na aba &quot;Buscar por Endereco&quot;, nao e necessario digitar o nome completo da rua. &quot;Paulist&quot; em Sao Paulo retorna a Avenida Paulista e ruas similares. Use termos curtos para obter mais resultados.</li>
            <li><strong>Cidades com CEP unico:</strong> Se voce mora em cidade pequena e o CEP generico nao retorna sua rua, e normal. Use o CEP terminado em 000 da sua cidade — os Correios entregam corretamente com base no endereco completo, nao apenas no CEP.</li>
            <li><strong>Mudanca de CEP:</strong> Os Correios eventualmente alteram CEPs quando criam novos setores de distribuicao. Se um CEP antigo nao funciona mais, busque pelo endereco na segunda aba para encontrar o CEP atualizado.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
