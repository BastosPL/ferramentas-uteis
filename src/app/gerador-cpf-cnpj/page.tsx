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

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona a validacao de CPF?</h2>
        <p>
          O CPF possui 11 digitos, sendo os dois ultimos digitos verificadores calculados
          a partir dos 9 primeiros. O algoritmo usa multiplicacao por pesos decrescentes
          e modulo 11 para garantir a integridade do numero.
        </p>
        <h2>Para que usar CPF/CNPJ de teste?</h2>
        <p>
          Desenvolvedores precisam testar formularios, validacoes e integracoes com sistemas
          que exigem CPF/CNPJ validos. Usar numeros reais e ilegal e perigoso. Esta ferramenta
          gera numeros matematicamente validos mas que nao pertencem a ninguem.
        </p>
      </section>
    </ToolPage>
  );
}
