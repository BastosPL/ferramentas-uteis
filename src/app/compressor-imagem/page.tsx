"use client";

import { useState, useRef, useCallback } from "react";
import ToolPage from "../components/ToolPage";

type ImagemComprimida = {
  nome: string;
  originalSize: number;
  compressedSize: number;
  reducao: number;
  url: string;
  preview: string;
};

export default function CompressorImagem() {
  const [qualidade, setQualidade] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [formato, setFormato] = useState<"original" | "jpeg" | "png" | "webp">("original");
  const [imagens, setImagens] = useState<ImagemComprimida[]>([]);
  const [processando, setProcessando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatoMime = (f: string, original: string): string => {
    if (f === "jpeg") return "image/jpeg";
    if (f === "png") return "image/png";
    if (f === "webp") return "image/webp";
    return original;
  };

  const extensao = (f: string, originalName: string): string => {
    if (f === "jpeg") return ".jpg";
    if (f === "png") return ".png";
    if (f === "webp") return ".webp";
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    return "." + ext;
  };

  const comprimir = useCallback(async (files: FileList) => {
    setProcessando(true);
    const resultados: ImagemComprimida[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      try {
        const bitmap = await createImageBitmap(file);
        let w = bitmap.width;
        let h = bitmap.height;

        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0, w, h);

        const mime = formatoMime(formato, file.type);
        const q = mime === "image/png" ? undefined : qualidade / 100;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), mime, q);
        });

        const url = URL.createObjectURL(blob);

        // Preview thumbnail
        const previewCanvas = document.createElement("canvas");
        const pw = 200;
        const ph = Math.round((h * pw) / w);
        previewCanvas.width = pw;
        previewCanvas.height = ph;
        const pctx = previewCanvas.getContext("2d")!;
        pctx.drawImage(bitmap, 0, 0, pw, ph);
        const preview = previewCanvas.toDataURL("image/jpeg", 0.6);

        const reducao = Math.round((1 - blob.size / file.size) * 100);

        const ext = extensao(formato, file.name);
        const nomeBase = file.name.replace(/\.[^/.]+$/, "");

        resultados.push({
          nome: nomeBase + "-comprimido" + ext,
          originalSize: file.size,
          compressedSize: blob.size,
          reducao: Math.max(reducao, 0),
          url,
          preview,
        });

        bitmap.close();
      } catch {
        // Skip invalid images
      }
    }

    setImagens((prev) => [...prev, ...resultados]);
    setProcessando(false);
  }, [qualidade, maxWidth, formato]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) comprimir(e.dataTransfer.files);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) comprimir(e.target.files);
  }

  function baixarTodas() {
    imagens.forEach((img) => {
      const a = document.createElement("a");
      a.href = img.url;
      a.download = img.nome;
      a.click();
    });
  }

  function limpar() {
    imagens.forEach((img) => URL.revokeObjectURL(img.url));
    setImagens([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  const totalOriginal = imagens.reduce((s, i) => s + i.originalSize, 0);
  const totalComprimido = imagens.reduce((s, i) => s + i.compressedSize, 0);
  const totalReducao = totalOriginal > 0 ? Math.round((1 - totalComprimido / totalOriginal) * 100) : 0;

  return (
    <ToolPage
      title="Compressor de Imagem"
      description="Comprima imagens JPG, PNG e WebP online. Reduza o tamanho sem perder qualidade. 100% privado."
      accent="emerald"
      icon="🖼️"
      slug="compressor-imagem"
    >
      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuracoes</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualidade: {qualidade}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={qualidade}
              onChange={(e) => setQualidade(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Menor</span>
              <span>Maior</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Largura maxima (px)
            </label>
            <select
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={640}>640px</option>
              <option value={1024}>1024px</option>
              <option value={1280}>1280px</option>
              <option value={1920}>1920px (Full HD)</option>
              <option value={3840}>3840px (4K)</option>
              <option value={99999}>Manter original</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato de saida
            </label>
            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value as typeof formato)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="original">Manter original</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP (menor tamanho)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-emerald-400 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-4xl block mb-3">📸</span>
          <p className="text-gray-700 font-medium">
            Arraste imagens aqui ou clique para selecionar
          </p>
          <p className="text-sm text-gray-400 mt-1">JPG, PNG ou WebP — Multiplas imagens de uma vez</p>
        </div>

        {processando && (
          <div className="text-center py-6">
            <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-2" />
            <p className="text-gray-500 text-sm">Comprimindo...</p>
          </div>
        )}
      </div>

      {/* Results */}
      {imagens.length > 0 && (
        <>
          {/* Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-emerald-800 font-semibold text-lg">
                  {imagens.length} {imagens.length === 1 ? "imagem comprimida" : "imagens comprimidas"}
                </p>
                <p className="text-emerald-700 text-sm">
                  {formatBytes(totalOriginal)} → {formatBytes(totalComprimido)} (
                  <strong>-{totalReducao}%</strong>)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={baixarTodas}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 cursor-pointer text-sm"
                >
                  ⬇ Baixar todas
                </button>
                <button
                  onClick={limpar}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 cursor-pointer text-sm"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* Image list */}
          <div className="space-y-3 mb-8">
            {imagens.map((img, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <img
                  src={img.preview}
                  alt={img.nome}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{img.nome}</p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(img.originalSize)} → {formatBytes(img.compressedSize)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-sm font-bold ${img.reducao > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                    {img.reducao > 0 ? `-${img.reducao}%` : "0%"}
                  </span>
                </div>
                <a
                  href={img.url}
                  download={img.nome}
                  className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-200 flex-shrink-0"
                >
                  ⬇ Baixar
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Info section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Como funciona?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">🔒</span>
            <h3 className="font-semibold text-sm mb-1">100% Privado</h3>
            <p className="text-xs text-gray-600">Nenhum arquivo e enviado para servidores. Toda compressao acontece no seu navegador.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">⚡</span>
            <h3 className="font-semibold text-sm mb-1">Compressao Inteligente</h3>
            <p className="text-xs text-gray-600">Ajuste a qualidade e o tamanho maximo. Converta para WebP para arquivos ainda menores.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">📦</span>
            <h3 className="font-semibold text-sm mb-1">Multiplas de uma vez</h3>
            <p className="text-xs text-gray-600">Selecione varias imagens e comprima todas de uma vez. Baixe individualmente ou todas juntas.</p>
          </div>
        </div>
      </div>

      {/* ── EDITORIAL CONTENT ── */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Compressor de Imagem</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Antes de enviar suas imagens, ajuste os tres controles no painel superior:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Qualidade (slider):</strong> Controla o nivel de compressao. Para fotos de produto, use 80-85%. Para thumbnails e imagens decorativas, 65-75% ja basta.</li>
            <li><strong>Largura maxima:</strong> Redimensiona automaticamente imagens maiores que o valor definido, mantendo a proporcao. Use 1920px para banners, 1280px para conteudo de blog, 1024px para miniaturas.</li>
            <li><strong>Formato de saida:</strong> Mantenha o original ou force a conversao para JPEG (fotos), PNG (graficos com transparencia) ou WebP (melhor compressao geral).</li>
          </ul>
          <p>
            Depois, arraste as imagens para a area de upload ou clique para selecionar. A compressao comeca automaticamente. Ao terminar, cada resultado mostra o tamanho original, o comprimido e a porcentagem de economia. Baixe individualmente ou todas de uma vez.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Funciona a Compressao</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            O processamento usa a API Canvas do HTML5 diretamente no seu navegador, em tres etapas: decodificacao da imagem original via <em>createImageBitmap</em>, redesenho no Canvas com as dimensoes configuradas e exportacao no formato escolhido com o nivel de qualidade definido.
          </p>
          <p>
            No JPEG, a compressao aplica a Transformada Discreta de Cosseno (DCT), descartando frequencias visuais que o olho humano mal percebe. O WebP vai alem, usando compressao preditiva que analisa blocos vizinhos — por isso gera arquivos 25-35% menores que JPEG em qualidade equivalente. O PNG, por sua vez, usa compressao lossless (sem perda), ideal quando cada pixel importa, como em logos e screenshots.
          </p>
          <p>
            <strong>Exemplo concreto:</strong> Uma foto de 4000x3000 (12 megapixels) em JPEG a 100% pesa cerca de 5 MB. Com qualidade 80% e largura maxima de 1920px, o arquivo cai para aproximadamente 300 KB — uma reducao de 94%. O redimensionamento contribui tanto quanto a compressao de qualidade nessa economia.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3">
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Qual a diferenca entre redimensionar e comprimir?</summary>
            <p className="text-gray-700 mt-2">Sao processos distintos que funcionam juntos. Redimensionar reduz a quantidade de pixels da imagem (ex: de 4000px para 1920px de largura), o que diminui o tamanho do arquivo de forma significativa. Comprimir reduz a quantidade de dados armazenados por pixel, descartando detalhes visuais imperceptiveis. Esta ferramenta faz as duas coisas simultaneamente para a maxima reducao.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">WebP funciona em todos os navegadores?</summary>
            <p className="text-gray-700 mt-2">Sim, desde 2020. O Chrome suporta WebP desde 2014, o Firefox desde 2019 e o Safari desde a versao 14 (setembro de 2020). Hoje, mais de 97% dos navegadores em uso no Brasil suportam WebP. E a escolha mais segura para sites que buscam performance sem abrir mao de compatibilidade.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Como saber se a qualidade esta boa o suficiente?</summary>
            <p className="text-gray-700 mt-2">Apos a compressao, clique na imagem resultante para visualiza-la em tamanho real no navegador. Compare visualmente com a original. Para a maioria das fotos, qualidade entre 75% e 85% nao apresenta diferenca perceptivel. Se notar blocos ou borroes (especialmente em areas de gradiente ou texto sobre imagem), aumente a qualidade em 5-10 pontos e reprocesse.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Por que minha imagem PNG ficou maior apos a compressao?</summary>
            <p className="text-gray-700 mt-2">Isso acontece quando uma foto em JPEG e convertida para PNG. O JPEG descarta dados para reduzir tamanho, enquanto o PNG preserva cada pixel sem perda — o resultado e um arquivo maior. Se a imagem e uma foto (nao um grafico ou logo), use JPEG ou WebP. Reserve o PNG para imagens com transparencia, texto nitido ou areas de cor solida.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Posso comprimir GIF ou SVG?</summary>
            <p className="text-gray-700 mt-2">Nao. Esta ferramenta processa apenas formatos raster estaticos: JPEG, PNG e WebP. GIFs animados exigem um compressor especializado que preserve os quadros da animacao. SVGs sao arquivos vetoriais baseados em texto (XML) e se beneficiam de minificacao de codigo, nao de compressao de pixels.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Dicas por Tipo de Uso</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>Site ou blog (SEO):</strong> WebP a 80% com largura maxima de 1280px. O Google PageSpeed Insights penaliza imagens acima de 100 KB — com essas configuracoes, a maioria das fotos fica entre 40 KB e 90 KB, ideal para Core Web Vitals e carregamento rapido.
          </p>
          <p>
            <strong>E-commerce (fotos de produto):</strong> JPEG a 85% com largura de 1600px. O cliente precisa ver detalhes como textura e costura, entao a qualidade importa mais do que em banners. Se o produto tem fundo transparente (recorte), use WebP em vez de PNG — o arquivo fica ate 70% menor.
          </p>
          <p>
            <strong>WhatsApp e email:</strong> JPEG ou WebP a 70% com largura de 1024px. Isso gera arquivos entre 50 KB e 150 KB que enviam instantaneamente, sem travar em conexoes moveis. Util para enviar multiplas fotos sem estourar o limite de 16 MB do WhatsApp ou 25 MB do Gmail.
          </p>
          <p>
            <strong>Marketplace (OLX, Mercado Livre):</strong> JPEG a 75% com largura de 1024px, limitando a 5 fotos por anuncio. Essas plataformas recomprimem as imagens internamente, entao enviar em qualidade maxima nao traz ganho visual — so torna o upload mais lento.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
