"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function gerarCorAleatoria(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

export default function GeradorCores() {
  const [cor, setCor] = useState("#3B82F6");
  const [paleta, setPaleta] = useState<string[]>([]);
  const [copiado, setCopiado] = useState("");

  const rgb = hexToRgb(cor);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const copiar = async (texto: string) => {
    await navigator.clipboard.writeText(texto);
    setCopiado(texto);
    setTimeout(() => setCopiado(""), 1500);
  };

  const gerarPaleta = () => {
    setPaleta(Array.from({ length: 6 }, gerarCorAleatoria));
  };

  const gerarComplementar = () => {
    if (!rgb) return;
    const comp = rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
    const lighter = rgbToHex(
      Math.min(255, rgb.r + 60), Math.min(255, rgb.g + 60), Math.min(255, rgb.b + 60)
    );
    const darker = rgbToHex(
      Math.max(0, rgb.r - 60), Math.max(0, rgb.g - 60), Math.max(0, rgb.b - 60)
    );
    setPaleta([darker, cor, lighter, comp]);
  };

  return (
    <ToolPage
      title="Gerador e Conversor de Cores"
      description="Gere paletas, converta entre HEX, RGB e HSL. Color picker visual para designers e desenvolvedores."
      accent="pink"
      icon="🎨"
    >
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">Escolha uma cor</label>
          <div className="flex gap-3 items-center mb-4">
            <input
              type="color"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="space-y-2">
            {[
              { label: "HEX", value: cor.toUpperCase() },
              { label: "RGB", value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "" },
              { label: "HSL", value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "" },
            ].map((fmt) => (
              <div key={fmt.label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs font-medium text-gray-500 w-8">{fmt.label}</span>
                <span className="flex-1 font-mono text-sm text-gray-900">{fmt.value}</span>
                <button onClick={() => copiar(fmt.value)} className="text-pink-600 text-xs hover:underline cursor-pointer">
                  {copiado === fmt.value ? "Copiado!" : "Copiar"}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setCor(gerarCorAleatoria())} className="flex-1 bg-pink-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-pink-700 cursor-pointer">
              Cor Aleatoria
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-full h-40 rounded-xl mb-4 border border-gray-200" style={{ backgroundColor: cor }} />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-3 text-center text-sm" style={{ backgroundColor: cor, color: "#fff" }}>
              Texto Branco
            </div>
            <div className="rounded-lg p-3 text-center text-sm" style={{ backgroundColor: cor, color: "#000" }}>
              Texto Preto
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Paleta de Cores</h2>
          <div className="flex gap-2">
            <button onClick={gerarPaleta} className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-200 cursor-pointer">
              Paleta Aleatoria
            </button>
            <button onClick={gerarComplementar} className="bg-pink-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-pink-700 cursor-pointer">
              Complementar
            </button>
          </div>
        </div>
        {paleta.length > 0 && (
          <div className="flex gap-2">
            {paleta.map((c, i) => (
              <button key={i} onClick={() => { setCor(c); copiar(c); }} className="flex-1 cursor-pointer group" title={c}>
                <div className="h-20 rounded-lg mb-1 border border-gray-200 group-hover:ring-2 ring-pink-500" style={{ backgroundColor: c }} />
                <p className="text-xs font-mono text-center text-gray-600">{c.toUpperCase()}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Formatos de cor: HEX, RGB e HSL</h2>
        <p>
          <strong>HEX</strong> usa 6 digitos hexadecimais (ex: #3B82F6). <strong>RGB</strong> define
          vermelho, verde e azul de 0 a 255. <strong>HSL</strong> usa matiz (0-360), saturacao e
          luminosidade em porcentagem. Todos representam a mesma cor, apenas em formatos diferentes.
        </p>
      </section>
    </ToolPage>
  );
}
