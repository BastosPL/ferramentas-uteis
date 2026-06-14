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

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como comprimir imagens?</h2>
        <p>
          Selecione ou arraste suas imagens para a area de upload. Ajuste a qualidade desejada
          (recomendamos 70-85% para um bom equilibrio entre tamanho e qualidade), escolha a
          largura maxima e o formato de saida. A compressao acontece instantaneamente no seu
          navegador.
        </p>

        <h2>Qual formato escolher?</h2>
        <p>
          <strong>JPEG</strong> e ideal para fotos e imagens com muitas cores. <strong>PNG</strong> e
          melhor para imagens com transparencia e graficos simples. <strong>WebP</strong> oferece
          o menor tamanho de arquivo com boa qualidade — ideal para sites e redes sociais.
        </p>
      </section>

      {/* ── EDITORIAL CONTENT ── */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Compressor de Imagem</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Para comprimir suas imagens, comece ajustando as configuracoes no painel superior. Defina a <strong>qualidade</strong> desejada usando o controle deslizante — valores entre 70% e 85% oferecem o melhor equilibrio entre reducao de tamanho e qualidade visual. Escolha a <strong>largura maxima</strong> para redimensionar imagens grandes automaticamente (1920px e ideal para a maioria dos usos na web). Selecione o <strong>formato de saida</strong>: mantenha o original, converta para JPEG, PNG ou WebP.
          </p>
          <p>
            Em seguida, arraste suas imagens diretamente para a area de upload ou clique nela para abrir o seletor de arquivos do seu computador. Voce pode selecionar multiplas imagens de uma vez. A compressao comeca automaticamente assim que os arquivos sao carregados. Quando o processamento terminar, voce vera um resumo com o tamanho original, o tamanho comprimido e a porcentagem de reducao de cada imagem.
          </p>
          <p>
            Para baixar as imagens comprimidas, clique no botao "Baixar" ao lado de cada imagem individual ou use o botao "Baixar todas" para fazer o download de todas de uma vez. Se precisar comprimir mais imagens com configuracoes diferentes, clique em "Limpar" para remover os resultados anteriores e comece novamente.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Como Funciona a Compressao de Imagens</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            Nossa ferramenta utiliza as APIs nativas do navegador para processar as imagens diretamente no seu dispositivo, sem enviar nenhum arquivo para servidores externos. Isso garante total privacidade e velocidade no processamento. O mecanismo principal e baseado no elemento Canvas do HTML5, que permite manipular pixels de imagens de forma eficiente.
          </p>
          <p>
            O processo funciona em tres etapas. Primeiro, a imagem original e carregada e decodificada pelo navegador usando a API <em>createImageBitmap</em>. Em seguida, ela e redesenhada em um Canvas com as dimensoes desejadas (respeitando a largura maxima configurada e mantendo a proporcao original). Por fim, o Canvas exporta a imagem no formato escolhido, aplicando a compressao com o nivel de qualidade definido pelo usuario.
          </p>
          <p>
            A compressao JPEG funciona eliminando detalhes visuais que o olho humano dificilmente percebe, utilizando a Transformada Discreta de Cosseno (DCT). Quanto menor a qualidade selecionada, mais detalhes sao descartados, resultando em arquivos menores mas com possivel perda de nitidez. O formato WebP, desenvolvido pelo Google, utiliza tecnicas mais avancadas de compressao preditiva e geralmente produz arquivos 25-35% menores que JPEG com qualidade equivalente. O PNG usa compressao sem perda (lossless), preservando todos os detalhes, incluindo transparencia, mas resultando em arquivos maiores.
          </p>
          <p>
            A reducao de dimensoes (redimensionamento) tambem contribui significativamente para diminuir o tamanho do arquivo. Uma foto de 4000x3000 pixels tirada por um celular moderno pode ter 5 MB ou mais. Ao redimensiona-la para 1920px de largura (Full HD), o tamanho ja cai drasticamente antes mesmo da compressao de qualidade ser aplicada.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3">
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">A compressao reduz a qualidade da imagem?</summary>
            <p className="text-gray-700 mt-2">Depende do formato e do nivel de qualidade selecionado. Com qualidade entre 75% e 85% em JPEG ou WebP, a perda e praticamente imperceptivel ao olho humano na maioria das imagens. Abaixo de 50%, artefatos visuais como borroes e blocos podem se tornar visiveis. O formato PNG nao perde qualidade, pois usa compressao lossless, mas a reducao de tamanho e menor.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Minhas imagens sao enviadas para algum servidor?</summary>
            <p className="text-gray-700 mt-2">Nao. Todo o processamento acontece localmente no seu navegador. Nenhum arquivo e enviado para servidores externos. Isso significa que suas fotos pessoais, documentos e imagens confidenciais permanecem completamente privados no seu dispositivo. Voce pode ate usar a ferramenta sem conexao com a internet apos carregar a pagina.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Qual a diferenca entre JPEG, PNG e WebP?</summary>
            <p className="text-gray-700 mt-2"><strong>JPEG</strong> e o formato mais universal para fotos, com boa compressao e compatibilidade em todos os dispositivos. <strong>PNG</strong> preserva transparencia e detalhes finos, ideal para logos, capturas de tela e graficos. <strong>WebP</strong> e o formato mais moderno, oferecendo compressao superior a JPEG e suporte a transparencia como PNG — e a melhor escolha para sites e aplicacoes web, pois e suportado por todos os navegadores modernos.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Quantas imagens posso comprimir de uma vez?</summary>
            <p className="text-gray-700 mt-2">Nao ha limite fixo de quantidade. Voce pode selecionar ou arrastar quantas imagens quiser de uma vez. Porem, como o processamento acontece no seu navegador, muitas imagens grandes simultaneamente podem tornar o processo mais lento dependendo do seu dispositivo. Para lotes muito grandes (mais de 50 imagens), recomendamos processar em grupos menores.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Qual qualidade devo usar para redes sociais?</summary>
            <p className="text-gray-700 mt-2">Para redes sociais como Instagram, Facebook e WhatsApp, uma qualidade de 75-80% em JPEG ou WebP e mais do que suficiente. Essas plataformas ja recomprimem as imagens ao fazer upload, entao enviar uma imagem em qualidade maxima nao traz beneficios visiveis. Uma largura de 1280px a 1920px atende a maioria dos posts e stories.</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4 group">
            <summary className="font-semibold text-gray-900 cursor-pointer">Por que minha imagem PNG ficou maior apos a compressao?</summary>
            <p className="text-gray-700 mt-2">Isso pode acontecer quando uma imagem JPEG e convertida para PNG. Como o PNG usa compressao sem perda, ele preserva todos os detalhes da imagem, o que pode resultar em um arquivo maior. Se voce quer reduzir o tamanho de fotos, use JPEG ou WebP. O PNG e mais adequado para imagens com areas solidas de cor, como logos e capturas de tela.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>Para sites e blogs:</strong> Use WebP com qualidade de 80% e largura maxima de 1280px para imagens de conteudo. Para banners e imagens de destaque, mantenha 1920px. Imagens otimizadas melhoram o tempo de carregamento da pagina, o que impacta positivamente o SEO e a experiencia do usuario. O Google PageSpeed Insights recomenda que imagens de paginas web tenham menos de 100 KB quando possivel.
          </p>
          <p>
            <strong>Para e-commerce:</strong> Fotos de produtos devem ter qualidade entre 80-85% em JPEG com largura de 1200px a 1600px. Isso garante que os clientes possam ver detalhes do produto sem que as paginas fiquem lentas. Se o produto tem fundo transparente, use WebP (que suporta transparencia) em vez de PNG para arquivos muito menores.
          </p>
          <p>
            <strong>Para enviar por email ou WhatsApp:</strong> Reduza a qualidade para 70-75% e a largura para 1024px. Isso resulta em arquivos pequenos que nao travam o envio e carregam rapidamente para quem recebe. E especialmente util para enviar multiplas fotos de uma vez sem exceder os limites de tamanho de anexos de email (geralmente 25 MB no Gmail).
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
