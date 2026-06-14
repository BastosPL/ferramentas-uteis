"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

interface ResultadoValidacao {
  valido: boolean;
  erros: string[];
  sugestoes: string[];
  partes: { usuario: string; dominio: string } | null;
}

const DOMINIOS_COMUNS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.com.br": "gmail.com",
  "gmaill.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "outllook.com": "outlook.com",
  "outlok.com": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhaoo.com": "yahoo.com",
};

const DOMINIOS_VALIDOS = [
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.com.br",
  "live.com", "icloud.com", "protonmail.com", "uol.com.br", "bol.com.br",
  "terra.com.br", "ig.com.br", "globo.com", "msn.com",
];

function validarEmail(email: string): ResultadoValidacao {
  const erros: string[] = [];
  const sugestoes: string[] = [];

  const trimmed = email.trim().toLowerCase();

  if (!trimmed) return { valido: false, erros: ["Digite um email"], sugestoes: [], partes: null };

  // Check basic structure
  const partes = trimmed.split("@");
  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    erros.push("Email deve conter exatamente um @");
    return { valido: false, erros, sugestoes, partes: null };
  }

  const [usuario, dominio] = partes;

  // Validate user part
  if (usuario.length < 1) erros.push("Nome de usuario esta vazio");
  if (usuario.startsWith(".") || usuario.endsWith(".")) erros.push("Nome de usuario nao pode comecar ou terminar com ponto");
  if (/\.\./.test(usuario)) erros.push("Nome de usuario nao pode ter pontos consecutivos");
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(usuario)) erros.push("Nome de usuario contem caracteres invalidos");

  // Validate domain
  if (!dominio.includes(".")) erros.push("Dominio deve conter pelo menos um ponto (ex: gmail.com)");
  if (dominio.startsWith(".") || dominio.endsWith(".")) erros.push("Dominio nao pode comecar ou terminar com ponto");
  if (dominio.startsWith("-") || dominio.endsWith("-")) erros.push("Dominio nao pode comecar ou terminar com hifen");

  const extensao = dominio.split(".").pop() || "";
  if (extensao.length < 2) erros.push("Extensao do dominio e muito curta");

  // Check common typos
  if (DOMINIOS_COMUNS[dominio]) {
    sugestoes.push(`Voce quis dizer ${usuario}@${DOMINIOS_COMUNS[dominio]}?`);
  }

  // Check if known domain
  if (erros.length === 0 && !DOMINIOS_VALIDOS.includes(dominio) && !DOMINIOS_COMUNS[dominio]) {
    sugestoes.push(`Dominio "${dominio}" nao e um provedor comum — verifique se esta correto`);
  }

  return {
    valido: erros.length === 0,
    erros,
    sugestoes,
    partes: { usuario, dominio },
  };
}

export default function ValidadorEmail() {
  const [email, setEmail] = useState("");
  const [resultado, setResultado] = useState<ResultadoValidacao | null>(null);
  const [lote, setLote] = useState("");
  const [resultadoLote, setResultadoLote] = useState<{ email: string; valido: boolean }[]>([]);

  const validar = () => {
    setResultado(validarEmail(email));
  };

  const validarLote = () => {
    const emails = lote.split("\n").map((e) => e.trim()).filter(Boolean);
    setResultadoLote(emails.map((e) => ({ email: e, valido: validarEmail(e).valido })));
  };

  return (
    <ToolPage
      title="Validador de Email"
      description="Verifique se enderecos de email tem formato valido. Detecta erros de digitacao e sugere correcoes."
      accent="cyan"
      icon="📧"
      slug="validador-email"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">Email para validar</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && validar()}
            placeholder="exemplo@gmail.com"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
          />
          <button onClick={validar} className="bg-cyan-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-cyan-700 cursor-pointer">
            Validar
          </button>
        </div>
      </div>

      {resultado && (
        <div className={`rounded-xl p-6 mb-6 border ${resultado.valido ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{resultado.valido ? "✅" : "❌"}</span>
            <div>
              <p className={`text-lg font-bold ${resultado.valido ? "text-green-800" : "text-red-800"}`}>
                {resultado.valido ? "Email valido!" : "Email invalido"}
              </p>
              {resultado.partes && (
                <p className="text-sm text-gray-600">
                  Usuario: <span className="font-mono">{resultado.partes.usuario}</span> | Dominio: <span className="font-mono">{resultado.partes.dominio}</span>
                </p>
              )}
            </div>
          </div>

          {resultado.erros.length > 0 && (
            <ul className="space-y-1 mb-3">
              {resultado.erros.map((e, i) => (
                <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                  <span>⚠️</span> {e}
                </li>
              ))}
            </ul>
          )}

          {resultado.sugestoes.length > 0 && (
            <ul className="space-y-1">
              {resultado.sugestoes.map((s, i) => (
                <li key={i} className="text-sm text-amber-700 flex items-center gap-2">
                  <span>💡</span> {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">Validacao em Lote</h2>
        <textarea
          value={lote}
          onChange={(e) => setLote(e.target.value)}
          placeholder="Cole um email por linha..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm mb-3 resize-y"
        />
        <button onClick={validarLote} className="bg-cyan-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-cyan-700 cursor-pointer">
          Validar Todos
        </button>

        {resultadoLote.length > 0 && (
          <div className="mt-4 space-y-1">
            {resultadoLote.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm py-1">
                <span>{r.valido ? "✅" : "❌"}</span>
                <span className={`font-mono ${r.valido ? "text-green-700" : "text-red-700"}`}>{r.email}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              {resultadoLote.filter((r) => r.valido).length} validos de {resultadoLote.length} total
            </p>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto mt-16 space-y-12 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Validador de Email</h2>
          <p className="mb-3">Validar enderecos de email e essencial para evitar erros em cadastros, campanhas de marketing e comunicacoes importantes. Veja como utilizar cada funcionalidade da ferramenta:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Validacao individual:</strong> Digite o endereco de email no campo principal e clique em &quot;Validar&quot; ou pressione Enter. O sistema analisa a sintaxe completa do email.</li>
            <li><strong>Analise do resultado:</strong> Voce recebe um diagnostico detalhado mostrando se o email e valido, quais erros foram encontrados (se houver) e sugestoes de correcao para erros de digitacao comuns.</li>
            <li><strong>Deteccao de typos:</strong> Se voce digitar &quot;gmial.com&quot; em vez de &quot;gmail.com&quot;, a ferramenta detecta automaticamente e sugere a correcao.</li>
            <li><strong>Validacao em lote:</strong> Para verificar varios emails de uma vez, cole uma lista (um email por linha) na area de texto da secao &quot;Validacao em Lote&quot; e clique em &quot;Validar Todos&quot;.</li>
            <li><strong>Interpretacao do lote:</strong> O resultado mostra cada email com um indicador verde (valido) ou vermelho (invalido), alem do total de emails validos.</li>
          </ol>
          <p className="mt-3">A ferramenta processa tudo localmente no navegador, sem enviar seus emails para servidores externos.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Validacao de Email</h2>
          <p className="mb-3">A validacao segue as regras definidas pela RFC 5321 e RFC 5322, os padroes internacionais que definem o formato de enderecos de email. O processo verifica varias camadas:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Estrutura basica:</strong> Verifica se o email contem exatamente um caractere @ separando o nome de usuario do dominio.</li>
            <li><strong>Nome de usuario:</strong> Confere se nao comeca ou termina com ponto, se nao contem pontos consecutivos e se utiliza apenas caracteres permitidos (letras, numeros, pontos, hifens e alguns caracteres especiais).</li>
            <li><strong>Dominio:</strong> Valida se o dominio contem pelo menos um ponto, se nao comeca ou termina com ponto ou hifen, e se a extensao tem no minimo 2 caracteres.</li>
            <li><strong>Dicionario de typos:</strong> Compara o dominio com uma lista de erros de digitacao conhecidos em provedores populares como Gmail, Hotmail, Outlook e Yahoo.</li>
            <li><strong>Provedores conhecidos:</strong> Se o dominio nao esta na lista de provedores comuns, emite um alerta para que o usuario verifique se digitou corretamente.</li>
          </ul>
          <p className="mt-3">E importante entender que a validacao de sintaxe nao garante que o email existe — apenas que o formato esta correto. Para verificar se uma caixa de entrada realmente existe, seria necessario enviar um email de confirmacao.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">A validacao confirma que o email existe?</summary>
              <p className="mt-2">Nao. A ferramenta valida apenas o formato (sintaxe) do email, verificando se ele segue as regras da RFC. Para confirmar que o email existe e recebe mensagens, seria necessario enviar um email de verificacao, o que esta fora do escopo desta ferramenta.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Quais erros de digitacao sao detectados?</summary>
              <p className="mt-2">A ferramenta detecta typos comuns em provedores populares como: gmial.com, gmal.com, hotmial.com, outllook.com, yaho.com, entre outros. Ao identificar um desses dominios, sugere automaticamente a correcao para o dominio correto.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso validar emails corporativos?</summary>
              <p className="mt-2">Sim. A ferramenta valida a sintaxe de qualquer email, incluindo dominios corporativos (ex: joao@empresa.com.br). Se o dominio nao estiver na lista de provedores conhecidos, voce recebera um aviso para verificar o dominio, mas isso nao significa que o email seja invalido.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Quantos emails posso validar em lote?</summary>
              <p className="mt-2">Nao ha limite definido. Como o processamento acontece no seu navegador, a velocidade depende da capacidade do seu dispositivo. Na pratica, listas com ate 1.000 emails sao processadas instantaneamente.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">E seguro inserir emails de clientes nesta ferramenta?</summary>
              <p className="mt-2">Sim. Todos os dados sao processados localmente no seu navegador e nao sao enviados para nenhum servidor. Os emails inseridos nao sao armazenados, coletados ou compartilhados. A ferramenta funciona mesmo sem conexao com a internet.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Por que um email valido pode nao funcionar?</summary>
              <p className="mt-2">Um email pode ter formato correto mas nao existir (ex: asdkjh@gmail.com). Alem disso, a caixa pode estar cheia, desativada ou bloqueando recebimentos. A validacao de sintaxe e o primeiro passo, mas nao substitui a verificacao pratica.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Quais caracteres sao permitidos em um email?</summary>
              <p className="mt-2">No nome de usuario (antes do @): letras, numeros, pontos, hifens e caracteres especiais como ! # $ % & e outros definidos pela RFC 5322. No dominio (apos o @): letras, numeros, hifens e pontos. Acentos e caracteres especiais no dominio podem funcionar com internacionalizacao (IDN), mas nao sao universalmente suportados.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Validacao de Emails</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Limpeza de listas:</strong> Antes de enviar campanhas de email marketing, valide toda a lista. Emails invalidos aumentam a taxa de bounce e podem prejudicar a reputacao do seu dominio.</li>
            <li><strong>Formularios web:</strong> Implemente validacao de email em formularios de cadastro para evitar que usuarios digitem emails com formato incorreto. Isso reduz problemas de comunicacao e cadastros perdidos.</li>
            <li><strong>Erros mais comuns:</strong> Os typos mais frequentes sao: trocar letras no Gmail (gmial, gmal), esquecer o ponto no dominio (.com vira com), usar virgula em vez de ponto e esquecer o @ ao copiar e colar.</li>
            <li><strong>Emails temporarios:</strong> Servicos como Guerrilla Mail e Temp Mail geram emails validos sintaticamente, mas temporarios. A validacao de formato nao detecta esses casos.</li>
            <li><strong>Double opt-in:</strong> A melhor pratica para confirmar emails e o double opt-in: enviar um email com link de confirmacao. Isso garante que o email existe e que o dono realmente quer se cadastrar.</li>
          </ul>
        </section>

      </div>
    </ToolPage>
  );
}
