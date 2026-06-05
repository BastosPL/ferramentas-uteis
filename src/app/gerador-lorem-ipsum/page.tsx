"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit".split(" ");

function gerarPalavras(n: number): string {
  const resultado: string[] = [];
  for (let i = 0; i < n; i++) {
    resultado.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  resultado[0] = resultado[0].charAt(0).toUpperCase() + resultado[0].slice(1);
  return resultado.join(" ") + ".";
}

function gerarFrase(): string {
  const tam = 8 + Math.floor(Math.random() * 12);
  return gerarPalavras(tam);
}

function gerarParagrafo(): string {
  const numFrases = 3 + Math.floor(Math.random() * 5);
  return Array.from({ length: numFrases }, gerarFrase).join(" ");
}

export default function GeradorLoremIpsum() {
  const [tipo, setTipo] = useState<"paragrafos" | "frases" | "palavras">("paragrafos");
  const [quantidade, setQuantidade] = useState(3);
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [iniciarComLorem, setIniciarComLorem] = useState(true);

  const gerar = () => {
    let resultado = "";
    if (tipo === "paragrafos") {
      resultado = Array.from({ length: quantidade }, gerarParagrafo).join("\n\n");
    } else if (tipo === "frases") {
      resultado = Array.from({ length: quantidade }, gerarFrase).join(" ");
    } else {
      resultado = gerarPalavras(quantidade);
    }

    if (iniciarComLorem) {
      resultado = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + resultado;
    }
    setTexto(resultado);
    setCopiado(false);
  };

  const copiar = async () => {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const stats = texto ? {
    chars: texto.length,
    words: texto.split(/\s+/).length,
    paragraphs: texto.split("\n\n").length,
  } : null;

  return (
    <ToolPage
      title="Gerador de Lorem Ipsum"
      description="Gere textos placeholder Lorem Ipsum para preencher layouts, mockups e prototipos. Escolha entre paragrafos, frases ou palavras."
      accent="purple"
      icon="📜"
      slug="gerador-lorem-ipsum"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: "paragrafos" as const, label: "Paragrafos" },
            { id: "frases" as const, label: "Frases" },
            { id: "palavras" as const, label: "Palavras" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                tipo === t.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Quantidade</label>
            <input
              type="number"
              min={1}
              max={tipo === "palavras" ? 1000 : 50}
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={iniciarComLorem} onChange={(e) => setIniciarComLorem(e.target.checked)} className="w-4 h-4 accent-purple-600" />
            <span className="text-sm text-gray-700">Iniciar com &quot;Lorem ipsum...&quot;</span>
          </label>
        </div>

        <button
          onClick={gerar}
          className="w-full bg-purple-600 text-white rounded-lg py-3 font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
        >
          Gerar Lorem Ipsum
        </button>
      </div>

      {texto && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Texto Gerado</h2>
            <div className="flex items-center gap-3">
              {stats && (
                <span className="text-xs text-gray-500">
                  {stats.chars} caracteres | {stats.words} palavras | {stats.paragraphs} paragrafo(s)
                </span>
              )}
              <button
                onClick={copiar}
                className="bg-purple-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-purple-700 cursor-pointer"
              >
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {texto}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que e Lorem Ipsum?</h2>
        <p>
          Lorem Ipsum e um texto placeholder usado na industria grafica e de design desde
          o seculo XVI. Ele e usado para preencher espacos em layouts e prototipos sem
          distrair o leitor com conteudo significativo, permitindo focar no design visual.
        </p>
      </section>
    </ToolPage>
  );
}
