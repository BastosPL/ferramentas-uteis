"use client";

import { useState, useRef } from "react";
import ToolPage from "../components/ToolPage";

export default function ImagemParaPDF() {
  const [imagens, setImagens] = useState<{ name: string; url: string; data: Uint8Array; type: string }[]>([]);
  const [processando, setProcessando] = useState(false);
  const [orientacao, setOrientacao] = useState<"retrato" | "paisagem">("retrato");
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (inputRef.current) inputRef.current.value = "";
  };

  const remover = (index: number) => {
    URL.revokeObjectURL(imagens[index].url);
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const converter = async () => {
    if (imagens.length === 0) return;
    setProcessando(true);

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

    setProcessando(false);
  };

  return (
    <ToolPage
      title="Converter Imagem para PDF"
      description="Converta imagens JPG, PNG e WebP para PDF. Combine varias imagens em um unico arquivo. 100% privado — nada e enviado para servidores."
      accent="orange"
      icon="🖼️"
      slug="imagem-para-pdf"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setOrientacao("retrato")} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${orientacao === "retrato" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            Retrato (A4)
          </button>
          <button onClick={() => setOrientacao("paisagem")} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${orientacao === "paisagem" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            Paisagem
          </button>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer mb-4"
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-4xl mb-2">🖼️</p>
          <p className="text-gray-700 font-medium">Clique para selecionar imagens</p>
          <p className="text-gray-500 text-sm mt-1">JPG, PNG (multiplas imagens)</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/jpg" multiple onChange={adicionarImagens} className="hidden" />
        </div>

        {imagens.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {imagens.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                <button onClick={() => remover(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">✕</button>
                <p className="text-xs text-gray-500 truncate mt-1">{img.name}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={converter}
          disabled={imagens.length === 0 || processando}
          className={`w-full rounded-lg py-3 font-semibold transition-colors cursor-pointer ${
            imagens.length === 0 || processando ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          {processando ? "Convertendo..." : `Converter ${imagens.length} imagem(ns) para PDF`}
        </button>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como converter imagem para PDF?</h2>
        <p>
          Selecione uma ou mais imagens (JPG, PNG), escolha a orientacao (retrato ou paisagem)
          e clique em Converter. Cada imagem sera colocada em uma pagina do PDF, centralizada
          e ajustada automaticamente.
        </p>
      </section>
    </ToolPage>
  );
}
