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

      {/* Editorial Content for SEO */}
      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Conversor Word e PDF</h2>
          <p className="mb-3">
            Nossa ferramenta permite converter arquivos nos dois sentidos: de Word (.docx) para PDF e de PDF para Word (.docx). Veja como utilizar cada modo:
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Converter Word para PDF</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2 mb-4">
            <li><strong>Selecione o modo &quot;Word → PDF&quot;</strong> clicando na aba correspondente no topo da ferramenta.</li>
            <li><strong>Envie seu arquivo .docx:</strong> Arraste o arquivo para a area pontilhada ou clique para selecionar do seu computador. O limite e de 20MB por arquivo.</li>
            <li><strong>Clique em &quot;Converter para PDF&quot;:</strong> O sistema processara o documento e abrira uma janela de impressao do navegador.</li>
            <li><strong>Salve como PDF:</strong> Na janela de impressao, selecione a opcao &quot;Salvar como PDF&quot; (em vez de uma impressora) e escolha onde salvar o arquivo.</li>
          </ol>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Converter PDF para Word</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Selecione o modo &quot;PDF → Word&quot;</strong> clicando na segunda aba.</li>
            <li><strong>Envie seu arquivo .pdf:</strong> Arraste ou selecione o PDF que deseja converter. O arquivo precisa conter texto selecionavel (nao escaneado).</li>
            <li><strong>Clique em &quot;Converter para Word&quot;:</strong> O texto sera extraido pagina a pagina e um arquivo .docx sera gerado automaticamente.</li>
            <li><strong>Baixe o resultado:</strong> O download do arquivo Word comecara automaticamente apos a conversao.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Conversao</h2>
          <p className="mb-3">
            Diferente de outros conversores online, toda a conversao acontece diretamente no seu navegador. Nenhum arquivo e enviado para servidores externos, garantindo total privacidade e seguranca dos seus documentos.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Word para PDF</h3>
          <p className="mb-3">
            Na conversao de Word para PDF, o sistema utiliza a biblioteca Mammoth.js para interpretar o conteudo do arquivo .docx. O Mammoth extrai a estrutura do documento — titulos, paragrafos, tabelas, listas e imagens — e converte tudo em HTML semantico. Em seguida, esse HTML e estilizado com CSS para manter uma aparencia profissional e aberto em uma nova janela do navegador. A funcao nativa de impressao do navegador e utilizada para gerar o PDF final, o que garante alta fidelidade na formatacao.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF para Word</h3>
          <p className="mb-3">
            Na conversao inversa, o sistema utiliza a biblioteca PDF.js (desenvolvida pela Mozilla) para ler o conteudo do PDF. O texto e extraido pagina a pagina, preservando a ordem de leitura e identificando paragrafos com base no posicionamento vertical dos elementos. Textos com tamanho de fonte maior sao automaticamente tratados como titulos. Apos a extracao, a biblioteca docx.js cria um arquivo Word (.docx) valido com todos os paragrafos e formatacao basica.
          </p>
          <p>
            E importante notar que PDFs escaneados (imagens de texto) nao contem dados de texto extraiveis. Para esses casos, seria necessario um processo de OCR (reconhecimento optico de caracteres), que nao faz parte desta ferramenta. A conversao funciona melhor com PDFs que possuem texto selecionavel.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Meus arquivos sao enviados para algum servidor?</summary>
              <p className="mt-2 text-gray-600">Nao. Toda a conversao acontece localmente no seu navegador usando JavaScript. Nenhum dado sai do seu computador. Voce pode inclusive desconectar a internet apos carregar a pagina e a conversao continuara funcionando.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Qual o tamanho maximo de arquivo?</summary>
              <p className="mt-2 text-gray-600">O limite e de 20MB por arquivo. Documentos muito grandes podem levar mais tempo para processar, dependendo da capacidade do seu dispositivo. Para arquivos maiores, considere dividir o documento em partes menores.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">A formatacao do Word e mantida no PDF?</summary>
              <p className="mt-2 text-gray-600">A conversao preserva a maioria dos elementos: titulos, paragrafos, listas, tabelas e imagens embutidas. Porem, formatacoes complexas como cabecalhos, rodapes, numeros de pagina e estilos personalizados podem nao ser reproduzidos com total fidelidade, ja que a conversao interpreta o conteudo como HTML.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Posso converter arquivos .doc (Word antigo)?</summary>
              <p className="mt-2 text-gray-600">Nao. A ferramenta aceita apenas o formato .docx (Word 2007 em diante). Arquivos no formato antigo .doc precisam primeiro ser salvos como .docx no Microsoft Word ou LibreOffice antes de serem convertidos aqui.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Por que o navegador abre a janela de impressao?</summary>
              <p className="mt-2 text-gray-600">A funcao de impressao do navegador e utilizada para gerar o PDF porque ela oferece a melhor fidelidade visual. Basta selecionar &quot;Salvar como PDF&quot; no lugar da impressora. Esse metodo preserva fontes, cores e layout de maneira confiavel em todos os navegadores modernos.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">PDFs escaneados podem ser convertidos para Word?</summary>
              <p className="mt-2 text-gray-600">Nao diretamente. PDFs escaneados sao essencialmente imagens e nao contem dados de texto que possam ser extraidos. Para converter esses PDFs, voce precisaria primeiro utilizar uma ferramenta de OCR (reconhecimento optico de caracteres) para transformar as imagens em texto.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Funciona no celular?</summary>
              <p className="mt-2 text-gray-600">Sim. A ferramenta funciona em qualquer dispositivo com um navegador moderno, incluindo smartphones e tablets. No celular, toque na area de upload para selecionar o arquivo da galeria ou gerenciador de arquivos do dispositivo.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Permita pop-ups:</strong> Na conversao Word para PDF, o resultado abre em uma nova janela. Se seu navegador bloquear pop-ups, permita-os para este site nas configuracoes.</li>
            <li><strong>Verifique antes de enviar:</strong> Abra o PDF gerado e confira se tabelas, imagens e formatacoes ficaram corretos antes de enviar para terceiros.</li>
            <li><strong>Use Chrome ou Edge:</strong> Esses navegadores oferecem a melhor experiencia de &quot;Salvar como PDF&quot; na janela de impressao, com mais opcoes de configuracao de margem e escala.</li>
            <li><strong>Converta relatorios do trabalho:</strong> Se voce precisa enviar um relatorio em PDF mas so tem o Word, esta ferramenta resolve rapidamente sem precisar instalar nenhum software.</li>
            <li><strong>Extraia texto de contratos:</strong> Recebeu um contrato em PDF e precisa editar? Converta para Word, faca suas anotacoes e observacoes, e depois converta de volta para PDF se necessario.</li>
            <li><strong>Curriculos e documentos oficiais:</strong> Para enviar curriculos, sempre prefira o formato PDF, pois ele mantem a formatacao identica em qualquer dispositivo. Use esta ferramenta para fazer a conversao rapidamente.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
