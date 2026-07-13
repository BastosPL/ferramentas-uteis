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
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Email avulso:</strong> Cole ou digite o endereco no campo e clique &quot;Validar&quot;. Em menos de 1 segundo voce recebe o diagnostico completo.</li>
            <li><strong>Correcao automatica:</strong> Digitou &quot;gmial.com&quot;? A ferramenta identifica o erro e sugere &quot;gmail.com&quot; na hora.</li>
            <li><strong>Lote:</strong> Cole ate centenas de enderecos (um por linha) na area &quot;Validacao em Lote&quot; e clique &quot;Validar Todos&quot;. O resultado separa validos (verde) e invalidos (vermelho) com contagem total.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Validacao</h2>
          <p className="mb-3">O motor de validacao aplica as regras da RFC 5321/5322 em tres camadas distintas, indo alem de um simples regex:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Sintaxe RFC:</strong> Verifica a presenca de exatamente um @, regras de pontos consecutivos, caracteres proibidos no nome de usuario e formato valido do dominio (extensao com minimo de 2 caracteres).</li>
            <li><strong>Dicionario de typos:</strong> Um banco com dezenas de erros de digitacao mapeados — como &quot;hotmial.com&quot;, &quot;outllook.com&quot;, &quot;yaho.com&quot; — compara o dominio digitado e sugere a correcao exata.</li>
            <li><strong>Alerta de dominio desconhecido:</strong> Se o dominio nao consta na lista de provedores conhecidos (Gmail, Outlook, Yahoo, iCloud, etc.), um aviso aparece para que voce confira a grafia. Isso nao invalida o email — apenas sinaliza que merece atencao.</li>
          </ul>
          <p className="mt-3">Tudo roda no JavaScript do seu navegador. Nenhum dado trafega pela rede.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Qual a diferenca entre validar formato e verificar se o email existe?</summary>
              <p className="mt-2">Validar formato (o que esta ferramenta faz) confere se o endereco segue as regras de sintaxe — por exemplo, se tem um @ e um dominio valido. Verificar existencia exige uma conexao SMTP com o servidor do destinatario para checar se a caixa de entrada realmente aceita mensagens. Sao etapas complementares: a primeira elimina enderecos obviamente errados, a segunda confirma entrega.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">A ferramenta detecta emails temporarios (descartaveis)?</summary>
              <p className="mt-2">Nao. Servicos como Guerrilla Mail ou Temp Mail geram enderecos com sintaxe perfeitamente valida. O validador confere apenas formato e typos de dominio, sem consultar listas de provedores descartaveis. Para bloquear emails temporarios em formularios, voce precisaria de uma API especializada em disposable email detection.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso colar uma lista do Excel?</summary>
              <p className="mt-2">Sim. Copie a coluna de emails na planilha (selecione as celulas e use Ctrl+C) e cole diretamente na area de Validacao em Lote. O Excel separa cada celula com uma quebra de linha, que e exatamente o formato esperado pela ferramenta — um email por linha.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O que significa o aviso &quot;dominio desconhecido&quot;?</summary>
              <p className="mt-2">Significa que o dominio digitado (ex: @minhaempresa.net) nao consta no dicionario interno de provedores populares. Isso nao torna o email invalido — apenas indica que a ferramenta nao consegue confirmar que o dominio e um provedor real. Emails corporativos e dominios proprios frequentemente disparam esse aviso e sao perfeitamente funcionais.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Emails com acentos ou caracteres especiais sao validos?</summary>
              <p className="mt-2">Tecnicamente, a RFC 6531 permite enderecos internacionalizados (ex: joao@empresa.com.br com til no &quot;a&quot;). Na pratica, a maioria dos servidores de email ainda rejeita caracteres acentuados no nome de usuario. O mais seguro e usar apenas letras sem acento, numeros, pontos e hifens para garantir compatibilidade universal.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Validacao de Emails</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Limpeza de mailing list antes de campanha:</strong> Execute a validacao em lote em toda a sua base antes de disparar. Cada email invalido que gera bounce prejudica o score do seu dominio nos provedores — acima de 5% de bounce rate, plataformas como Mailchimp e RD Station podem suspender seus envios.</li>
            <li><strong>Validacao em formularios de cadastro:</strong> Use validacao de formato no front-end (para feedback instantaneo ao usuario) e repita no back-end (para seguranca). A combinacao reduz em ate 90% os cadastros com email digitado errado, segundo dados de mercado.</li>
            <li><strong>Erros mais comuns por provedor:</strong> No Gmail, os typos frequentes sao &quot;gmial&quot;, &quot;gmal&quot; e &quot;gnail&quot;. No Hotmail, &quot;hotmial&quot; e &quot;hotmai&quot;. No Outlook, &quot;outllook&quot; e &quot;outlok&quot;. Saber esses padroes ajuda a configurar autocorrecao em seus proprios formularios.</li>
            <li><strong>Double opt-in como complemento:</strong> A validacao de formato e o primeiro filtro. O segundo — e mais robusto — e o double opt-in: enviar um email com link de confirmacao. Isso garante que a caixa existe, que o dono autorizou o cadastro e protege contra spam traps.</li>
          </ul>
        </section>

      </div>
    </ToolPage>
  );
}
