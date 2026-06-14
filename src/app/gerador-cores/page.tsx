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
      slug="gerador-cores"
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

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador e Conversor de Cores</h2>
          <p className="mb-3">
            Esta ferramenta foi criada para designers, desenvolvedores e qualquer pessoa que trabalhe com cores digitais. Ela permite escolher cores visualmente, converter entre formatos e gerar paletas harmonicas em segundos. Veja como aproveitar cada funcionalidade:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Escolha uma cor base:</strong> use o seletor de cores (color picker) clicando no quadrado colorido a esquerda, ou digite diretamente o codigo HEX no campo de texto. A cor sera atualizada em tempo real.</li>
            <li><strong>Copie o codigo no formato desejado:</strong> abaixo do seletor, voce vera a cor convertida automaticamente em tres formatos — HEX, RGB e HSL. Clique em &quot;Copiar&quot; ao lado de qualquer formato para copia-lo para a area de transferencia.</li>
            <li><strong>Gere uma cor aleatoria:</strong> clique no botao &quot;Cor Aleatoria&quot; para descobrir cores inesperadas. Essa funcao e otima para encontrar inspiracao quando voce esta sem ideias.</li>
            <li><strong>Visualize a cor em contexto:</strong> no painel a direita, a cor e exibida em uma area grande para visualizacao, alem de dois exemplos mostrando como texto branco e preto ficam sobre ela — essencial para verificar contraste e legibilidade.</li>
            <li><strong>Crie paletas de cores:</strong> use o botao &quot;Paleta Aleatoria&quot; para gerar 6 cores aleatorias, ou clique em &quot;Complementar&quot; para gerar automaticamente uma paleta com a cor base, variacoes mais claras, mais escuras e a cor complementar.</li>
            <li><strong>Selecione cores da paleta:</strong> clique em qualquer cor da paleta para defini-la como a cor principal e copiar seu codigo automaticamente.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona: Formatos HEX, RGB e HSL</h2>
          <p className="mb-3">
            Toda cor digital e representada como uma combinacao de valores numericos. Existem varios sistemas para descrever essas cores, e cada um tem vantagens especificas dependendo do contexto de uso.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">HEX (Hexadecimal)</h3>
          <p className="mb-3">
            O formato HEX e o mais popular na web. Ele usa 6 digitos hexadecimais (base 16, de 0 a F) precedidos pelo simbolo #. Os dois primeiros digitos representam vermelho, os dois do meio representam verde e os dois ultimos representam azul. Por exemplo, #FF0000 e vermelho puro, #00FF00 e verde puro e #0000FF e azul puro. O formato HEX e compacto e amplamente suportado em CSS, editores de imagem e ferramentas de design como Figma, Canva e Photoshop.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">RGB (Red, Green, Blue)</h3>
          <p className="mb-3">
            O modelo RGB define cores pela intensidade de tres canais: vermelho (Red), verde (Green) e azul (Blue), cada um variando de 0 a 255. O valor rgb(255, 0, 0) e vermelho puro, rgb(255, 255, 255) e branco e rgb(0, 0, 0) e preto. O RGB e o modelo nativo de monitores e telas, pois cada pixel e formado fisicamente por sub-pixels vermelhos, verdes e azuis. No CSS moderno, voce tambem pode usar rgba() para adicionar transparencia (canal alfa).
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">HSL (Hue, Saturation, Lightness)</h3>
          <p className="mb-3">
            O HSL e considerado o formato mais intuitivo para humanos. Ele descreve cores com tres propriedades: matiz (Hue, de 0 a 360 graus no circulo cromatico), saturacao (de 0% a 100%, onde 0% e cinza e 100% e a cor pura) e luminosidade (de 0% a 100%, onde 0% e preto e 100% e branco). O HSL facilita ajustes: para clarear uma cor, basta aumentar a luminosidade; para desaturar, basta reduzir a saturacao. Isso o torna ideal para criar variacoes de uma mesma cor em sistemas de design.
          </p>
          <p>
            A conversao entre esses formatos e puramente matematica — todos representam o mesmo espectro de cores. Esta ferramenta realiza as conversoes automaticamente em tempo real, sem necessidade de calculos manuais.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Qual formato de cor devo usar no meu projeto web?</summary>
              <p className="mt-2">Para a maioria dos projetos web, o HEX e o formato mais utilizado por ser compacto e universalmente suportado. Porem, se voce precisa de transparencia, use rgba() ou hsla(). Se voce esta criando um sistema de design com variacoes de cores (tons claros e escuros da mesma cor), o HSL e mais pratico porque permite ajustar luminosidade e saturacao de forma intuitiva.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">O que e uma cor complementar?</summary>
              <p className="mt-2">A cor complementar e aquela que esta no lado oposto do circulo cromatico. Ela cria o maximo contraste visual quando combinada com a cor original. Por exemplo, a complementar do azul e o laranja, a do vermelho e o ciano. Cores complementares sao muito usadas em design para criar destaque visual, call-to-actions e composicoes vibrantes.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Como escolher cores acessiveis para meu site?</summary>
              <p className="mt-2">A acessibilidade de cores esta ligada ao contraste entre texto e fundo. As diretrizes WCAG recomendam uma taxa de contraste minima de 4.5:1 para texto normal e 3:1 para texto grande. Use os exemplos de texto branco e preto desta ferramenta como referencia inicial. Como regra geral, evite texto claro sobre fundo claro ou texto escuro sobre fundo escuro. Cores com luminosidade (L no HSL) abaixo de 40% geralmente funcionam bem com texto branco.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Qual a diferenca entre RGB e CMYK?</summary>
              <p className="mt-2">RGB e um modelo de cores aditivo, usado em telas e monitores — misturando vermelho, verde e azul em intensidade maxima, voce obtem branco. CMYK (Ciano, Magenta, Amarelo e Preto) e um modelo subtrativo, usado em impressao — as tintas absorvem luz e a mistura de todas resulta em preto. Se voce esta projetando para telas, use RGB/HEX. Se e para impressao, o CMYK e necessario. Esta ferramenta trabalha com RGB, ideal para projetos digitais.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Como criar uma paleta de cores harmonica?</summary>
              <p className="mt-2">Existem varias estrategias baseadas no circulo cromatico: cores analogas (vizinhas no circulo), complementares (opostas), triadicas (3 cores equidistantes) e monocromaticas (variacoes de luminosidade da mesma cor). Use o botao &quot;Complementar&quot; desta ferramenta para gerar automaticamente uma paleta com variacoes da cor selecionada. Para projetos profissionais, escolha uma cor principal, uma secundaria e uma de destaque, mantendo o restante neutro.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">Posso usar as cores geradas em ferramentas como Figma, Canva ou Photoshop?</summary>
              <p className="mt-2">Sim. Basta copiar o codigo HEX (por exemplo, #3B82F6) e colar diretamente no campo de cor de qualquer ferramenta de design. Todas as ferramentas profissionais aceitam codigos HEX. Algumas tambem aceitam RGB e HSL. O formato HEX e o mais universal e funciona em praticamente qualquer software.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Trabalhar com Cores</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Regra 60-30-10:</strong> em design, use 60% de uma cor dominante (geralmente neutra), 30% de uma cor secundaria e 10% de uma cor de destaque. Isso cria hierarquia visual sem poluir o layout.</li>
            <li><strong>Teste em modo escuro:</strong> se seu projeto suporta dark mode, verifique se as cores escolhidas funcionam bem com fundos escuros. Cores que ficam otimas em fundo branco podem perder contraste em fundo preto.</li>
            <li><strong>Cuidado com cores vibrantes em excesso:</strong> cores muito saturadas (saturacao acima de 80% no HSL) cansam a vista quando usadas em grandes areas. Reserve-as para botoes, links e elementos de destaque.</li>
            <li><strong>Considere daltonismo:</strong> cerca de 8% dos homens tem algum tipo de daltonismo. Evite depender apenas de vermelho e verde para transmitir informacao — combine cores com icones ou textos.</li>
            <li><strong>Salve suas paletas:</strong> ao encontrar uma combinacao que funciona, copie os codigos HEX e guarde em um documento de referencia. Isso evita inconsistencias visuais ao longo do projeto.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
