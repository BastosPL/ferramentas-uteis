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

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como validar um email?</h2>
        <p>
          O validador verifica a sintaxe do email (formato correto com @ e dominio),
          detecta erros comuns de digitacao em provedores populares (Gmail, Hotmail, Outlook)
          e sugere correcoes. Tambem suporta validacao em lote para verificar varios emails de uma vez.
        </p>
      </section>
    </ToolPage>
  );
}
