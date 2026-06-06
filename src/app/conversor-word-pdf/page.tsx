"use client";

import { useState, useRef } from "react";
import ToolPage from "../components/ToolPage";

type Modo = "word-pdf" | "pdf-word";

export default function ConversorWordPDF() {
  const [modo, setModo] = useState<Modo>("word-pdf");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [convertendo, setConvertendo] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [htmlPreview, setHtmlPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validarArquivo(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validarArquivo(file);
  }

  function validarArquivo(file: File) {
    setErro("");
    setSucesso("");
    setHtmlPreview("");

    if (modo === "word-pdf") {
      if (!file.name.match(/\.docx$/i)) {
        setErro("Selecione um arquivo .docx (Word 2007+)");
        return;
      }
    } else {
      if (!file.name.match(/\.pdf$/i)) {
        setErro("Selecione um arquivo .pdf");
        return;
      }
    }

    if (file.size > 20 * 1024 * 1024) {
      setErro("Arquivo muito grande. Maximo 20MB.");
      return;
    }

    setArquivo(file);
  }

  async function converterWordParaPDF() {
    if (!arquivo) return;
    setConvertendo(true);
    setErro("");
    setSucesso("");

    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await arquivo.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Create styled HTML document
      const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
  h1 { font-size: 24px; margin-top: 24px; }
  h2 { font-size: 20px; margin-top: 20px; }
  h3 { font-size: 16px; margin-top: 16px; }
  p { margin: 8px 0; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
  img { max-width: 100%; }
  @media print { body { margin: 0; } }
</style></head><body>${html}</body></html>`;

      setHtmlPreview(fullHtml);

      // Open print dialog for PDF save
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(fullHtml);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
        setSucesso("Documento convertido! Na janela que abriu, selecione 'Salvar como PDF' na opcao de impressora.");
      } else {
        setErro("Pop-up bloqueado. Permita pop-ups para este site e tente novamente.");
      }
    } catch {
      setErro("Erro ao converter. Verifique se o arquivo e um .docx valido.");
    }
    setConvertendo(false);
  }

  async function converterPDFParaWord() {
    if (!arquivo) return;
    setConvertendo(true);
    setErro("");
    setSucesso("");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await arquivo.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const paragraphs: { text: string; isHeading: boolean }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let pageText = "";
        let lastY: number | null = null;

        for (const item of textContent.items) {
          if ("str" in item) {
            const y = item.transform[5];
            if (lastY !== null && Math.abs(y - lastY) > 5) {
              if (pageText.trim()) {
                const fontSize = item.transform[0] || 12;
                paragraphs.push({
                  text: pageText.trim(),
                  isHeading: fontSize > 14,
                });
              }
              pageText = "";
            }
            pageText += item.str + " ";
            lastY = y;
          }
        }
        if (pageText.trim()) {
          paragraphs.push({ text: pageText.trim(), isHeading: false });
        }

        if (i < pdf.numPages) {
          paragraphs.push({ text: "---", isHeading: false });
        }
      }

      // Create DOCX using docx library
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

      const docParagraphs = paragraphs.map((p) => {
        if (p.text === "---") {
          return new Paragraph({ children: [] });
        }
        return new Paragraph({
          heading: p.isHeading ? HeadingLevel.HEADING_1 : undefined,
          children: [new TextRun({ text: p.text, size: p.isHeading ? 28 : 24 })],
          spacing: { after: 120 },
        });
      });

      const doc = new Document({
        sections: [{ children: docParagraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = arquivo.name.replace(/\.pdf$/i, ".docx");
      a.click();
      URL.revokeObjectURL(url);

      setSucesso(`Arquivo convertido! ${paragraphs.length} paragrafos extraidos de ${pdf.numPages} paginas.`);
    } catch (err) {
      console.error(err);
      setErro("Erro ao converter. Verifique se o PDF nao esta protegido por senha.");
    }
    setConvertendo(false);
  }

  function converter() {
    if (modo === "word-pdf") converterWordParaPDF();
    else converterPDFParaWord();
  }

  function limpar() {
    setArquivo(null);
    setErro("");
    setSucesso("");
    setHtmlPreview("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const aceita = modo === "word-pdf" ? ".docx" : ".pdf";
  const icone = modo === "word-pdf" ? "📄 → 📕" : "📕 → 📄";

  return (
    <ToolPage
      title="Conversor Word ⇄ PDF"
      description="Converta Word para PDF e PDF para Word online. 100% privado, nenhum arquivo e enviado para servidores."
      accent="red"
      icon="📄"
      slug="conversor-word-pdf"
    >
      {/* Modo selector */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => { setModo("word-pdf"); limpar(); }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            modo === "word-pdf" ? "bg-white text-red-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📄 Word → PDF
        </button>
        <button
          onClick={() => { setModo("pdf-word"); limpar(); }}
          className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            modo === "pdf-word" ? "bg-white text-red-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📕 PDF → Word
        </button>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-red-400 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={aceita}
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-4xl block mb-3">{icone}</span>
          {arquivo ? (
            <div>
              <p className="text-lg font-semibold text-gray-900">{arquivo.name}</p>
              <p className="text-sm text-gray-500">{(arquivo.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">
                {modo === "word-pdf"
                  ? "Arraste seu arquivo .docx aqui ou clique para selecionar"
                  : "Arraste seu arquivo .pdf aqui ou clique para selecionar"}
              </p>
              <p className="text-sm text-gray-400 mt-1">Maximo 20MB</p>
            </div>
          )}
        </div>

        {arquivo && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={converter}
              disabled={convertendo}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {convertendo ? "Convertendo..." : `Converter para ${modo === "word-pdf" ? "PDF" : "Word"}`}
            </button>
            <button
              onClick={limpar}
              className="px-6 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              Limpar
            </button>
          </div>
        )}

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-700 text-sm">{sucesso}</p>
          </div>
        )}
      </div>

      {/* Preview for Word to PDF */}
      {htmlPreview && modo === "word-pdf" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-visualizacao</h2>
          <div
            className="prose prose-sm max-w-none border border-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: htmlPreview.replace(/[\s\S]*<body>/, "").replace(/<\/body>[\s\S]*/, "") }}
          />
        </div>
      )}

      {/* Info section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Como funciona?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">🔒</span>
            <h3 className="font-semibold text-sm mb-1">100% Privado</h3>
            <p className="text-xs text-gray-600">Nenhum arquivo e enviado para servidores. Toda conversao acontece no seu navegador.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">⚡</span>
            <h3 className="font-semibold text-sm mb-1">Rapido e Gratis</h3>
            <p className="text-xs text-gray-600">Conversao instantanea sem limites de uso. Sem cadastro, sem fila de espera.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">📱</span>
            <h3 className="font-semibold text-sm mb-1">Funciona em Qualquer Dispositivo</h3>
            <p className="text-xs text-gray-600">Desktop, tablet ou celular. Basta ter um navegador moderno.</p>
          </div>
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como converter Word para PDF?</h2>
        <p>
          Selecione o modo &quot;Word → PDF&quot;, arraste ou selecione seu arquivo .docx e clique em Converter.
          O documento sera processado no seu navegador e uma janela de impressao abrira para voce salvar como PDF.
          Nenhum dado e enviado para servidores externos.
        </p>

        <h2>Como converter PDF para Word?</h2>
        <p>
          Selecione o modo &quot;PDF → Word&quot;, arraste ou selecione seu arquivo .pdf e clique em Converter.
          O texto sera extraido do PDF e um arquivo .docx sera gerado automaticamente para download.
          Funciona melhor com PDFs que contem texto selecionavel (nao escaneados).
        </p>
      </section>
    </ToolPage>
  );
}
