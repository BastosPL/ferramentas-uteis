"use client";

import { useState, useRef } from "react";
import ToolPage from "../components/ToolPage";

type Modo = "juntar" | "imagens";

export default function JuntarPDF() {
  const [modo, setModo] = useState<Modo>("juntar");

  // --- Estado: Juntar PDFs ---
  const [arquivos, setArquivos] = useState<{ name: string; data: ArrayBuffer }[]>([]);
  const [processandoPdf, setProcessandoPdf] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const inputPdfRef = useRef<HTMLInputElement>(null);

  // --- Estado: Imagens para PDF ---
  const [imagens, setImagens] = useState<{ name: string; url: string; data: Uint8Array; type: string }[]>([]);
  const [processandoImg, setProcessandoImg] = useState(false);
  const [orientacao, setOrientacao] = useState<"retrato" | "paisagem">("retrato");
  const inputImgRef = useRef<HTMLInputElement>(null);

  // === Handlers: Juntar PDFs ===
  const adicionarArquivos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const novos: { name: string; data: ArrayBuffer }[] = [];
    for (const file of Array.from(files)) {
      if (file.type === "application/pdf") {
        const data = await file.arrayBuffer();
        novos.push({ name: file.name, data });
      }
    }
    setArquivos((prev) => [...prev, ...novos]);
    setConcluido(false);
    if (inputPdfRef.current) inputPdfRef.current.value = "";
  };

  const removerPdf = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
    setConcluido(false);
  };

  const moverParaCima = (index: number) => {
    if (index === 0) return;
    setArquivos((prev) => {
      const novo = [...prev];
      [novo[index - 1], novo[index]] = [novo[index], novo[index - 1]];
      return novo;
    });
  };

  const moverParaBaixo = (index: number) => {
    if (index === arquivos.length - 1) return;
    setArquivos((prev) => {
      const novo = [...prev];
      [novo[index], novo[index + 1]] = [novo[index + 1], novo[index]];
      return novo;
    });
  };

  const juntarPDFs = async () => {
    if (arquivos.length < 2) return;
    setProcessandoPdf(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfFinal = await PDFDocument.create();

      for (const arq of arquivos) {
        const pdfOrigem = await PDFDocument.load(arq.data);
        const paginas = await pdfFinal.copyPages(pdfOrigem, pdfOrigem.getPageIndices());
        paginas.forEach((pagina) => pdfFinal.addPage(pagina));
      }

      const pdfBytes = await pdfFinal.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documento-combinado.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setConcluido(true);
    } catch (err) {
      alert("Erro ao processar os PDFs. Verifique se os arquivos nao estao protegidos.");
    }

    setProcessandoPdf(false);
  };

  // === Handlers: Imagens para PDF ===
  const adicionarImagens = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const novas: { name: string; url: string; data: Uint8Array; type: string }[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        const buffer = await file.arrayBuffer();
        const url = URL.createObjectURL(file);
        novas.push({ name: file.name, url, data: new Uint8Array(buffer), type: file.type });
      }
    }
    setImagens((prev) => [...prev, ...novas]);
    if (inputImgRef.current) inputImgRef.current.value = "";
  };

  const removerImg = (index: number) => {
    URL.revokeObjectURL(imagens[index].url);
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const converterImagens = async () => {
    if (imagens.length === 0) return;
    setProcessandoImg(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();

      for (const img of imagens) {
        let embeddedImg;
        if (img.type === "image/png") {
          embeddedImg = await pdf.embedPng(img.data);
        } else {
          embeddedImg = await pdf.embedJpg(img.data);
        }

        const pageWidth = orientacao === "retrato" ? 595.28 : 841.89;
        const pageHeight = orientacao === "retrato" ? 841.89 : 595.28;
        const page = pdf.addPage([pageWidth, pageHeight]);

        const imgRatio = embeddedImg.width / embeddedImg.height;
        const pageRatio = pageWidth / pageHeight;

        let drawWidth, drawHeight;
        if (imgRatio > pageRatio) {
          drawWidth = pageWidth - 40;
          drawHeight = drawWidth / imgRatio;
        } else {
          drawHeight = pageHeight - 40;
          drawWidth = drawHeight * imgRatio;
        }

        page.drawImage(embeddedImg, {
          x: (pageWidth - drawWidth) / 2,
          y: (pageHeight - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "imagens.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao converter. Verifique se as imagens sao JPG ou PNG.");
    }

    setProcessandoImg(false);
  };

  return (
    <ToolPage
      title="Juntar PDF e Converter Imagens em PDF"
      description="Combine varios PDFs em um so ou converta imagens JPG e PNG para PDF. 100% gratis e privado — seus arquivos nunca saem do navegador."
      accent="red"
      icon="📄"
      slug="juntar-pdf"
    >
      {/* Abas */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setModo("juntar")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            modo === "juntar"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📄 Juntar PDFs
        </button>
        <button
          onClick={() => setModo("imagens")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            modo === "imagens"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🖼️ Imagens para PDF
        </button>
      </div>

      {/* Fluxo A — Juntar PDFs */}
      {modo === "juntar" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors cursor-pointer mb-4"
            onClick={() => inputPdfRef.current?.click()}
          >
            <p className="text-4xl mb-2">📁</p>
            <p className="text-gray-700 font-medium">Clique para selecionar PDFs</p>
            <p className="text-gray-500 text-sm mt-1">ou arraste os arquivos aqui</p>
            <input
              ref={inputPdfRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={adicionarArquivos}
              className="hidden"
            />
          </div>

          {arquivos.length > 0 && (
            <div className="space-y-2 mb-4">
              {arquivos.map((arq, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-red-500">📄</span>
                  <span className="flex-1 text-sm text-gray-900 truncate">{arq.name}</span>
                  <span className="text-xs text-gray-500">{(arq.data.byteLength / 1024).toFixed(0)} KB</span>
                  <button onClick={() => moverParaCima(i)} className="text-gray-400 hover:text-gray-700 cursor-pointer" title="Mover para cima">▲</button>
                  <button onClick={() => moverParaBaixo(i)} className="text-gray-400 hover:text-gray-700 cursor-pointer" title="Mover para baixo">▼</button>
                  <button onClick={() => removerPdf(i)} className="text-red-400 hover:text-red-600 cursor-pointer" title="Remover">✕</button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={juntarPDFs}
            disabled={arquivos.length < 2 || processandoPdf}
            className={`w-full rounded-lg py-3 font-semibold transition-colors cursor-pointer ${
              arquivos.length < 2 || processandoPdf
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {processandoPdf ? "Processando..." : concluido ? "PDF Baixado! Juntar novamente?" : `Juntar ${arquivos.length} PDFs`}
          </button>

          {concluido && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mt-4">
              <p className="text-green-700 font-medium">PDF combinado com sucesso e baixado!</p>
            </div>
          )}
        </div>
      )}

      {/* Fluxo B — Imagens para PDF */}
      {modo === "imagens" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setOrientacao("retrato")} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${orientacao === "retrato" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              Retrato (A4)
            </button>
            <button onClick={() => setOrientacao("paisagem")} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${orientacao === "paisagem" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              Paisagem
            </button>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors cursor-pointer mb-4"
            onClick={() => inputImgRef.current?.click()}
          >
            <p className="text-4xl mb-2">🖼️</p>
            <p className="text-gray-700 font-medium">Clique para selecionar imagens</p>
            <p className="text-gray-500 text-sm mt-1">JPG, PNG (multiplas imagens)</p>
            <input ref={inputImgRef} type="file" accept="image/jpeg,image/png,image/jpg" multiple onChange={adicionarImagens} className="hidden" />
          </div>

          {imagens.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
              {imagens.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                  <button onClick={() => removerImg(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">✕</button>
                  <p className="text-xs text-gray-500 truncate mt-1">{img.name}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={converterImagens}
            disabled={imagens.length === 0 || processandoImg}
            className={`w-full rounded-lg py-3 font-semibold transition-colors cursor-pointer ${
              imagens.length === 0 || processandoImg ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {processandoImg ? "Convertendo..." : `Converter ${imagens.length} imagem(ns) para PDF`}
          </button>
        </div>
      )}

      {/* Conteudo editorial */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Esta ferramenta oferece duas funcoes relacionadas a PDF, acessiveis pelas abas acima:</p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">Juntar PDFs</h3>
          <p>Combine varios arquivos PDF em um unico documento:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Selecione os arquivos PDF:</strong> Clique na area pontilhada ou arraste seus arquivos. Voce pode selecionar multiplos PDFs segurando Ctrl (ou Cmd no Mac).</li>
            <li><strong>Organize a ordem:</strong> Use as setas para cima e para baixo para definir a sequencia no documento final.</li>
            <li><strong>Remova arquivos indesejados:</strong> Clique no &quot;X&quot; para remover qualquer arquivo da lista.</li>
            <li><strong>Clique em &quot;Juntar PDFs&quot;:</strong> O arquivo combinado sera gerado e o download comecara automaticamente.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6">Imagens para PDF</h3>
          <p>Converta fotos JPG e PNG em um documento PDF:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Escolha a orientacao:</strong> Retrato (A4) para documentos verticais ou Paisagem para imagens mais largas.</li>
            <li><strong>Selecione suas imagens:</strong> Clique na area pontilhada para escolher arquivos JPG ou PNG. Voce pode selecionar multiplas imagens de uma vez.</li>
            <li><strong>Revise e remova:</strong> As imagens aparecem como miniaturas. Passe o mouse e clique no &quot;X&quot; para remover as que nao deseja.</li>
            <li><strong>Converta para PDF:</strong> Clique no botao para gerar o PDF. Cada imagem vira uma pagina do documento.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p><strong>Juntar PDFs:</strong> A ferramenta copia cada pagina dos PDFs originais para um novo documento, na ordem que voce definir. O texto continua selecionavel, as fontes sao transferidas e os hyperlinks permanecem funcionais. Cada pagina preserva suas dimensoes originais — um relatorio A4 combinado com um contrato em formato Carta tera paginas com tamanhos diferentes.</p>
          <p><strong>Imagens para PDF:</strong> Cada foto selecionada vira uma pagina independente no PDF. A ferramenta calcula a proporcao da imagem e compara com as dimensoes da pagina A4, centralizando a imagem com margens iguais para manter o enquadramento harmonico. Fotos em paisagem sao automaticamente acomodadas quando voce seleciona a orientacao paisagem.</p>
          <p>Ambos os modos usam a biblioteca pdf-lib diretamente no navegador. Nenhum arquivo e enviado para servidores — o processamento acontece na memoria do seu dispositivo.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso escolher quais paginas de cada PDF incluir?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. A ferramenta combina PDFs completos — todas as paginas de cada arquivo sao incluidas. Se precisa apenas paginas especificas, primeiro separe as paginas desejadas usando uma ferramenta de divisao de PDF e depois combine os arquivos resultantes aqui.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">PDFs com tamanhos de pagina diferentes funcionam?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. Cada pagina mantem suas dimensoes originais no documento combinado. Voce pode juntar um PDF em A4 com outro em formato Carta sem problema. O leitor de PDF ajusta a exibicao de cada pagina individualmente.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Quais formatos de imagem sao aceitos?</summary>
            <p className="px-4 pb-4 text-gray-700">A ferramenta aceita JPG e PNG. Fotos do iPhone em formato HEIC e imagens WebP precisam ser convertidas antes para JPG ou PNG.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Por que minhas fotos ficam com bordas brancas no PDF?</summary>
            <p className="px-4 pb-4 text-gray-700">Isso acontece porque a proporcao da foto e diferente da proporcao da pagina A4. A ferramenta nunca corta ou distorce a imagem — ela centraliza a foto e preenche o espaco restante com margens brancas.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O PDF gerado a partir de imagens tem texto pesquisavel?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. O PDF contem apenas as imagens como elementos graficos. Para PDFs com texto pesquisavel a partir de fotos, seria necessario um software de OCR (reconhecimento optico de caracteres).</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">PDFs protegidos por senha funcionam?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. Se algum PDF exigir senha para abrir, a ferramenta nao conseguira le-lo e exibira um alerta de erro. Remova a protecao antes de combinar.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso juntar um PDF com um documento Word?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao diretamente. Primeiro converta o Word para PDF usando nossa ferramenta <a href="/conversor-word-pdf" className="text-red-600 hover:underline">Word para PDF</a>, depois combine o resultado aqui.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitacoes</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p><strong>Limite de tamanho:</strong> Como o processamento acontece na memoria do navegador, combinar muitos PDFs grandes (ex: 10 arquivos de 50 MB cada) pode esgotar a memoria, especialmente em celulares. Nesses casos, processe em lotes menores.</p>
          <p><strong>Marcadores (bookmarks):</strong> Os hyperlinks sao preservados na maioria dos casos, mas marcadores da barra lateral do PDF original podem nao ser transferidos.</p>
          <p><strong>PDFs corrompidos:</strong> Arquivos PDF danificados impedirao a combinacao. Tente abrir o PDF isoladamente no navegador para confirmar que esta integro.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Documentacao pessoal:</strong> Junte RG + CPF + comprovante de endereco em um unico PDF para processos seletivos e matriculas.</li>
            <li><strong>Digitalizar documentos:</strong> Fotografe documentos com o celular e converta para PDF usando o modo &quot;Imagens para PDF&quot;.</li>
            <li><strong>Propostas comerciais:</strong> Una proposta tecnica + tabela de precos + contrato em um unico PDF profissional.</li>
            <li><strong>Portfolio:</strong> Combine varias imagens de trabalhos em um PDF usando o modo de imagens. Organize as fotos na ordem desejada antes de selecionar.</li>
            <li><strong>Comprovantes em lote:</strong> Converta capturas de tela de comprovantes em PDF para arquivo organizado.</li>
            <li><strong>Precisa converter Word antes?</strong> Use o <a href="/conversor-word-pdf" className="text-red-600 hover:underline">Conversor Word para PDF</a> primeiro e depois combine o resultado aqui.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
