"use client";

import { useState, useCallback } from "react";
import ToolPage from "../components/ToolPage";

export default function GeradorDeSenha() {
  const [tamanho, setTamanho] = useState(16);
  const [usarMaiusculas, setUsarMaiusculas] = useState(true);
  const [usarMinusculas, setUsarMinusculas] = useState(true);
  const [usarNumeros, setUsarNumeros] = useState(true);
  const [usarSimbolos, setUsarSimbolos] = useState(true);
  const [senha, setSenha] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [historico, setHistorico] = useState<string[]>([]);

  const gerarSenha = useCallback(() => {
    let chars = "";
    if (usarMaiusculas) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (usarMinusculas) chars += "abcdefghijklmnopqrstuvwxyz";
    if (usarNumeros) chars += "0123456789";
    if (usarSimbolos) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setSenha("Selecione pelo menos uma opcao");
      return;
    }

    const array = new Uint32Array(tamanho);
    crypto.getRandomValues(array);
    const novaSenha = Array.from(array, (v) => chars[v % chars.length]).join("");
    setSenha(novaSenha);
    setCopiado(false);
    setHistorico((prev) => [novaSenha, ...prev.slice(0, 9)]);
  }, [tamanho, usarMaiusculas, usarMinusculas, usarNumeros, usarSimbolos]);

  const copiar = async () => {
    await navigator.clipboard.writeText(senha);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const calcularForca = (s: string) => {
    if (!s || s === "Selecione pelo menos uma opcao") return { label: "", cor: "", pct: 0 };
    let score = 0;
    if (s.length >= 8) score++;
    if (s.length >= 12) score++;
    if (s.length >= 16) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[a-z]/.test(s)) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;

    if (score <= 2) return { label: "Fraca", cor: "bg-red-500", pct: 25 };
    if (score <= 4) return { label: "Media", cor: "bg-yellow-500", pct: 50 };
    if (score <= 5) return { label: "Forte", cor: "bg-blue-500", pct: 75 };
    return { label: "Muito Forte", cor: "bg-green-500", pct: 100 };
  };

  const forca = calcularForca(senha);

  return (
    <ToolPage title="Gerador de Senha Segura" description="Gere senhas fortes e aleatorias usando criptografia do navegador. Nenhum dado e enviado para servidores. Sua senha e gerada 100% localmente." accent="green" icon="🔐">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        {senha && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg break-all select-all">
                {senha}
              </div>
              <button
                onClick={copiar}
                className="bg-green-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-green-700 transition-colors shrink-0 cursor-pointer"
              >
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
            {forca.label && (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${forca.cor}`}
                    style={{ width: `${forca.pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{forca.label}</span>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Tamanho: <span className="text-green-600 font-bold">{tamanho}</span> caracteres
          </label>
          <input
            type="range"
            min={4}
            max={64}
            value={tamanho}
            onChange={(e) => setTamanho(parseInt(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Maiusculas (A-Z)", value: usarMaiusculas, set: setUsarMaiusculas },
            { label: "Minusculas (a-z)", value: usarMinusculas, set: setUsarMinusculas },
            { label: "Numeros (0-9)", value: usarNumeros, set: setUsarNumeros },
            { label: "Simbolos (!@#$)", value: usarSimbolos, set: setUsarSimbolos },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={opt.value}
                onChange={(e) => opt.set(e.target.checked)}
                className="w-4 h-4 accent-green-600"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={gerarSenha}
          className="w-full bg-green-600 text-white rounded-lg py-3 font-semibold hover:bg-green-700 transition-colors cursor-pointer"
        >
          Gerar Senha
        </button>
      </div>

      {historico.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">Historico de Senhas Geradas</h2>
          <div className="space-y-2">
            {historico.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-mono text-sm flex-1 break-all">{s}</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(s);
                  }}
                  className="text-green-600 text-xs hover:underline shrink-0 cursor-pointer"
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Por que usar senhas fortes?</h2>
        <p>
          Senhas fracas sao a principal causa de invasoes de contas online. Uma senha forte
          deve ter pelo menos 12 caracteres e combinar letras maiusculas, minusculas, numeros
          e simbolos. Nosso gerador utiliza a API Web Crypto do navegador para gerar numeros
          verdadeiramente aleatorios.
        </p>
        <h2>Dicas de seguranca</h2>
        <ul>
          <li>Use uma senha diferente para cada conta</li>
          <li>Ative a autenticacao em dois fatores sempre que possivel</li>
          <li>Nunca compartilhe suas senhas por mensagem ou email</li>
          <li>Use um gerenciador de senhas para guardar suas credenciais</li>
        </ul>
      </section>
    </ToolPage>
  );
}
