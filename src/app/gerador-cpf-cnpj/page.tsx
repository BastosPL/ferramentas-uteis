"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

function gerarCPF(formatado: boolean): string {
  const rand = () => Math.floor(Math.random() * 10);
  const n = Array.from({ length: 9 }, rand);

  // Digito 1
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += n[i] * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  // Digito 2
  soma = 0;
  for (let i = 0; i < 10; i++) soma += n[i] * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  const cpf = n.join("");
  if (formatado) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  return cpf;
}

function gerarCNPJ(formatado: boolean): string {
  const rand = () => Math.floor(Math.random() * 10);
  const n = [...Array.from({ length: 8 }, rand), 0, 0, 0, 1];

  // Digito 1
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) soma += n[i] * pesos1[i];
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  // Digito 2
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) soma += n[i] * pesos2[i];
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  const cnpj = n.join("");
  if (formatado) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
  return cnpj;
}

function validarCPF(cpf: string): boolean {
  const nums = cpf.replace(/\D/g, "");
  if (nums.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(nums)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  if (parseInt(nums[9]) !== d1) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return parseInt(nums[10]) === d2;
}

function validarCNPJ(cnpj: string): boolean {
  const nums = cnpj.replace(/\D/g, "");
  if (nums.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(nums)) return false;

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) soma += parseInt(nums[i]) * pesos1[i];
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  if (parseInt(nums[12]) !== d1) return false;

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) soma += parseInt(nums[i]) * pesos2[i];
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return parseInt(nums[13]) === d2;
}

export default function GeradorCpfCnpj() {
  const [modo, setModo] = useState<"cpf" | "cnpj" | "validar">("cpf");
  const [formatado, setFormatado] = useState(true);
  const [gerados, setGerados] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [copiado, setCopiado] = useState<number | null>(null);
  const [validarInput, setValidarInput] = useState("");
  const [validarResultado, setValidarResultado] = useState<boolean | null>(null);

  const gerar = () => {
    const novos = Array.from({ length: quantidade }, () =>
      modo === "cpf" ? gerarCPF(formatado) : gerarCNPJ(formatado)
    );
    setGerados(novos);
  };

  const copiar = async (texto: string, index: number) => {
    await navigator.clipboard.writeText(texto);
    setCopiado(index);
    setTimeout(() => setCopiado(null), 1500);
  };

  const validar = () => {
    const input = validarInput.trim();
    if (input.replace(/\D/g, "").length === 11) {
      setValidarResultado(validarCPF(input));
    } else if (input.replace(/\D/g, "").length === 14) {
      setValidarResultado(validarCNPJ(input));
    } else {
      setValidarResultado(false);
    }
  };

  return (
    <ToolPage title="Gerador de CPF e CNPJ" description="Gere CPFs e CNPJs validos para testes de software. Numeros ficticios com digitos verificadores matematicamente corretos. Tambem valide CPFs e CNPJs existentes." accent="pink" icon="🆔" slug="gerador-cpf-cnpj">

      <div className="flex gap-2 mb-6">
        {[
          { id: "cpf" as const, label: "Gerar CPF" },
          { id: "cnpj" as const, label: "Gerar CNPJ" },
          { id: "validar" as const, label: "Validar" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setModo(t.id); setGerados([]); setValidarResultado(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              modo === t.id ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {modo !== "validar" ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Quantidade</label>
              <select value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2.5">
                {[1, 5, 10, 20, 50].map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formatado} onChange={(e) => setFormatado(e.target.checked)} className="w-4 h-4 accent-pink-600" />
              <span className="text-sm">Com formatacao</span>
            </label>
          </div>
          <button onClick={gerar} className="w-full bg-pink-600 text-white rounded-lg py-3 font-semibold hover:bg-pink-700 transition-colors cursor-pointer">
            Gerar {modo === "cpf" ? "CPF" : "CNPJ"}
          </button>

          {gerados.length > 0 && (
            <div className="mt-4 space-y-2">
              {gerados.map((g, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                  <span className="font-mono text-lg flex-1">{g}</span>
                  <button
                    onClick={() => copiar(g, i)}
                    className="text-pink-600 text-sm hover:underline cursor-pointer"
                  >
                    {copiado === i ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              ))}
              {gerados.length > 1 && (
                <button
                  onClick={() => copiar(gerados.join("\n"), -1)}
                  className="w-full text-center text-sm text-pink-600 hover:underline cursor-pointer py-2"
                >
                  {copiado === -1 ? "Todos copiados!" : "Copiar todos"}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-medium mb-1 text-gray-800">Digite o CPF ou CNPJ</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={validarInput}
              onChange={(e) => { setValidarInput(e.target.value); setValidarResultado(null); }}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
            />
            <button onClick={validar} className="bg-pink-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-pink-700 transition-colors cursor-pointer">
              Validar
            </button>
          </div>
          {validarResultado !== null && (
            <div className={`mt-4 rounded-lg p-4 text-center font-semibold ${validarResultado ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {validarResultado ? "Valido! Os digitos verificadores estao corretos." : "Invalido! Os digitos verificadores nao conferem."}
            </div>
          )}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-yellow-800">
          <strong>Aviso legal:</strong> Os numeros gerados sao ficticios e destinados exclusivamente
          para testes de software e desenvolvimento. O uso para fins fraudulentos e crime previsto
          no Codigo Penal (Art. 299).
        </p>
      </div>

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador de CPF e CNPJ</h2>
          <p className="mb-3">
            Nossa ferramenta gera numeros de CPF e CNPJ ficticios com digitos verificadores matematicamente corretos, alem de validar numeros existentes. Veja como utilizar cada funcao:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Gerar CPF:</strong> Selecione a aba &quot;Gerar CPF&quot;, escolha a quantidade desejada (1, 5, 10, 20 ou 50 de uma vez) e clique em &quot;Gerar CPF&quot;. Os numeros aparecem em uma lista com botao de copiar individual. Voce pode marcar ou desmarcar a opcao &quot;Com formatacao&quot; para obter o CPF com ou sem pontos e traco (exemplo: 123.456.789-09 ou 12345678909).</li>
            <li><strong>Gerar CNPJ:</strong> Selecione a aba &quot;Gerar CNPJ&quot; e siga o mesmo processo. O CNPJ sera gerado no formato completo com 14 digitos. Com formatacao, o resultado aparece como 12.345.678/0001-90.</li>
            <li><strong>Validar CPF ou CNPJ:</strong> Selecione a aba &quot;Validar&quot;, digite ou cole o numero no campo de texto e clique em &quot;Validar&quot;. A ferramenta aceita numeros com ou sem formatacao e informa se os digitos verificadores estao matematicamente corretos.</li>
            <li><strong>Copiar resultados:</strong> Clique em &quot;Copiar&quot; ao lado de qualquer numero gerado para copia-lo para a area de transferencia. Quando gerar varios numeros, use &quot;Copiar todos&quot; para copiar a lista completa de uma vez.</li>
          </ul>
          <p className="mt-3">
            Todos os numeros sao gerados diretamente no seu navegador. Nenhum dado e enviado para servidores, garantindo total privacidade e velocidade instantanea.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o Algoritmo de Validacao</h2>
          <p className="mb-3">
            Os numeros de CPF e CNPJ no Brasil seguem regras matematicas rigorosas definidas pela Receita Federal. Os ultimos digitos de cada numero sao chamados &quot;digitos verificadores&quot; e sao calculados a partir dos demais usando um algoritmo especifico.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Algoritmo do CPF</h3>
          <p className="mb-3">
            O CPF possui 11 digitos: os 9 primeiros sao a base numerica e os 2 ultimos sao os digitos verificadores. O calculo do primeiro digito verificador funciona assim: cada um dos 9 primeiros digitos e multiplicado por um peso decrescente (de 10 a 2). A soma desses produtos e dividida por 11. Se o resto for menor que 2, o digito verificador e 0; caso contrario, e 11 menos o resto.
          </p>
          <p className="mb-3">
            O segundo digito verificador segue a mesma logica, mas usa os 10 primeiros digitos (incluindo o primeiro verificador ja calculado) com pesos de 11 a 2. Esse mecanismo de dupla verificacao torna extremamente improvavel que um erro de digitacao gere um CPF acidentalmente valido.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Algoritmo do CNPJ</h3>
          <p className="mb-3">
            O CNPJ tem 14 digitos, sendo os 8 primeiros a raiz (identificacao da empresa), os 4 seguintes o sufixo (0001 para a matriz, 0002 em diante para filiais) e os 2 ultimos sao os digitos verificadores. O calculo usa pesos diferentes do CPF: para o primeiro digito, os pesos sao 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2; para o segundo, acrescenta-se o peso 6 no inicio da sequencia.
          </p>
          <p className="mb-3">
            Alem dos digitos verificadores, o algoritmo rejeita sequencias repetidas (como 111.111.111-11 ou 00.000.000/0000-00), pois embora passem no calculo matematico, nao representam documentos reais.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Os CPFs e CNPJs gerados sao de pessoas ou empresas reais?</summary>
              <p className="px-4 pb-3 text-sm">Nao. Os numeros sao gerados aleatoriamente e possuem apenas validade matematica (digitos verificadores corretos). Eles nao estao vinculados a nenhuma pessoa fisica ou juridica real. A Receita Federal possui uma base de dados propria que nao se baseia apenas no algoritmo matematico para cadastrar documentos.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">E ilegal gerar CPF ou CNPJ para testes?</summary>
              <p className="px-4 pb-3 text-sm">Gerar numeros ficticios para fins de teste de software, desenvolvimento e aprendizado e perfeitamente legal. O que e crime (Art. 299 do Codigo Penal — falsidade ideologica) e usar um CPF ou CNPJ falso para se passar por outra pessoa, abrir contas bancarias, fazer compras ou qualquer outro ato fraudulento. A ferramenta existe exclusivamente para auxiliar desenvolvedores.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Por que desenvolvedores precisam de CPFs de teste?</summary>
              <p className="px-4 pb-3 text-sm">Ao desenvolver sistemas, aplicativos ou sites que coletam CPF ou CNPJ, e necessario testar se os campos de formulario aceitam numeros validos e rejeitam invalidos. Usar documentos reais em ambientes de teste e arriscado (vazamento de dados) e potencialmente ilegal (LGPD). Numeros ficticios com digitos verificadores corretos permitem testar as validacoes sem riscos.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como saber se um CPF e verdadeiro ou foi gerado?</summary>
              <p className="px-4 pb-3 text-sm">A unica forma de saber se um CPF esta efetivamente cadastrado na Receita Federal e consultando diretamente no site da Receita (servicos.receita.fazenda.gov.br). O algoritmo matematico sozinho nao diferencia um CPF real de um gerado — ambos possuem digitos verificadores corretos. A validacao que esta ferramenta faz e exclusivamente matematica.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre validacao matematica e consulta na Receita?</summary>
              <p className="px-4 pb-3 text-sm">A validacao matematica verifica se os digitos verificadores estao corretos segundo o algoritmo oficial. E uma verificacao rapida e local. Ja a consulta na Receita Federal verifica se o numero esta efetivamente cadastrado, qual o nome do titular e a situacao cadastral. Sao verificacoes complementares: a matematica e o primeiro filtro (elimina erros de digitacao), e a consulta na Receita confirma a existencia real do documento.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O CNPJ 0001 e sempre a matriz?</summary>
              <p className="px-4 pb-3 text-sm">Sim. O sufixo /0001 identifica o estabelecimento matriz da empresa. Filiais recebem sufixos sequenciais: /0002, /0003, etc. Todos compartilham os mesmos 8 digitos de raiz, mas possuem digitos verificadores diferentes. Nossa ferramenta gera CNPJs sempre com sufixo /0001, representando a matriz.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso usar esses numeros em ambientes de producao?</summary>
              <p className="px-4 pb-3 text-sm">Nunca. Os numeros gerados devem ser usados exclusivamente em ambientes de desenvolvimento e teste (homologacao). Em producao, o sistema deve validar CPFs e CNPJs reais, idealmente consultando APIs oficiais da Receita Federal ou servicos de validacao cadastral como Serpro e outros.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Desenvolvedores</h2>
          <p className="mb-3">
            Se voce trabalha com desenvolvimento de software, estas dicas vao ajudar a implementar validacoes de CPF e CNPJ de forma correta:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Sempre valide no backend:</strong> Nunca confie apenas na validacao do frontend (navegador). Usuarios maliciosos podem burlar validacoes JavaScript. Implemente a verificacao dos digitos verificadores tambem no servidor.</li>
            <li><strong>Aceite com e sem formatacao:</strong> Seu sistema deve aceitar tanto &quot;123.456.789-09&quot; quanto &quot;12345678909&quot;. Remova caracteres nao numericos antes de processar (regex: <code className="bg-gray-100 px-1 rounded text-sm">replace(/\D/g, &quot;&quot;)</code>).</li>
            <li><strong>Rejeite sequencias repetidas:</strong> CPFs como 111.111.111-11, 222.222.222-22, etc., passam na validacao matematica mas sao conhecidamente invalidos. Adicione uma verificacao extra para esses casos.</li>
            <li><strong>LGPD e armazenamento:</strong> Ao armazenar CPFs em banco de dados, considere criptografar o campo e nunca exiba o numero completo em interfaces (mascare como ***.456.789-**). A Lei Geral de Protecao de Dados exige cuidados especiais com dados pessoais.</li>
            <li><strong>Testes automatizados:</strong> Use esta ferramenta para gerar lotes de CPFs e CNPJs validos e inclua-os nos seus testes automatizados. Teste tambem com numeros invalidos para garantir que seu sistema rejeita documentos incorretos.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Muitos desenvolvedores implementam apenas a validacao de formato (11 digitos para CPF, 14 para CNPJ) sem verificar os digitos verificadores. Isso permite que numeros completamente aleatorios passem pela validacao, o que prejudica a qualidade dos dados do sistema.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
