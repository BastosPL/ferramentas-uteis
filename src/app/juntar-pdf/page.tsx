"use client";

import { useState, useRef } from "react";
import ToolPage from "../components/ToolPage";

export default function JuntarPDF() {
  const [arquivos, setArquivos] = useState<{ name: string; data: ArrayBuffer }[]>([]);
  const [processando, setProcessando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (inputRef.current) inputRef.current.value = "";
  };

  const remover = (index: number) => {
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
    setProcessando(true);

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

    setProcessando(false);
  };

  return (
    <ToolPage
      title="Juntar PDF"
      description="Combine varios arquivos PDF em um so. 100% gratis e privado — seus arquivos nunca saem do seu navegador."
      accent="red"
      icon="📄"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors cursor-pointer mb-4"
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-4xl mb-2">📁</p>
          <p className="text-gray-700 font-medium">Clique para selecionar PDFs</p>
          <p className="text-gray-500 text-sm mt-1">ou arraste os arquivos aqui</p>
          <input
            ref={inputRef}
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
                <button onClick={() => remover(i)} className="text-red-400 hover:text-red-600 cursor-pointer" title="Remover">✕</button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={juntarPDFs}
          disabled={arquivos.length < 2 || processando}
          className={`w-full rounded-lg py-3 font-semibold transition-colors cursor-pointer ${
            arquivos.length < 2 || processando
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {processando ? "Processando..." : concluido ? "PDF Baixado! Juntar novamente?" : `Juntar ${arquivos.length} PDFs`}
        </button>
      </div>

      {concluido && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-8">
          <p className="text-green-700 font-medium">PDF combinado com sucesso e baixado!</p>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como juntar PDFs online?</h2>
        <p>
          Selecione os arquivos PDF que deseja combinar, organize na ordem desejada usando
          as setas, e clique em Juntar. O arquivo combinado sera baixado automaticamente.
          Todo o processamento acontece no seu navegador — nenhum arquivo e enviado para servidores.
        </p>
        <h2>E seguro?</h2>
        <p>
          Sim! Diferente de outros sites, seus arquivos nunca saem do seu computador.
          Usamos a biblioteca pdf-lib que processa tudo localmente no navegador.
        </p>
      </section>
    </ToolPage>
  );
}
