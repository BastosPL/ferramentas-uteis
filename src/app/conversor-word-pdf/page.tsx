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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Word para PDF</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2 mb-4">
            <li>Selecione a aba &quot;Word → PDF&quot; e envie o arquivo .docx (arraste ou clique para selecionar, limite de 20 MB).</li>
            <li>Clique em &quot;Converter para PDF&quot;. O documento sera renderizado e a <strong>janela de impressao do navegador</strong> abrira automaticamente.</li>
            <li>Na janela de impressao, escolha &quot;Salvar como PDF&quot; no lugar da impressora e defina onde salvar. Esse passo e essencial — e a janela de impressao que gera o PDF final com alta fidelidade.</li>
          </ol>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF para Word</h3>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Selecione a aba &quot;PDF → Word&quot; e envie o PDF (precisa conter texto selecionavel, nao escaneado).</li>
            <li>Clique em &quot;Converter para Word&quot;. O texto e extraido pagina a pagina e o download do .docx comeca automaticamente.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Conversao</h2>
          <p className="mb-3">
            Toda a conversao roda no JavaScript do seu navegador — nenhum arquivo sai do seu computador. As duas direcoes usam bibliotecas diferentes, cada uma otimizada para seu formato de origem.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Word para PDF (Mammoth.js + Print)</h3>
          <p className="mb-3">
            A biblioteca Mammoth.js le a estrutura interna do .docx (que e um arquivo ZIP contendo XML) e converte cada elemento — titulos, paragrafos, tabelas, listas e imagens embutidas — em HTML semantico. Esse HTML recebe estilizacao CSS profissional e e aberto em uma nova janela, onde a funcao nativa de impressao do navegador gera o PDF. O resultado e um documento fiel ao original, com fontes, cores e espacamento preservados.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF para Word (PDF.js + docx.js)</h3>
          <p className="mb-3">
            A biblioteca PDF.js (criada pela Mozilla para o Firefox) decodifica o PDF e extrai o texto pagina a pagina, identificando paragrafos pelo posicionamento vertical e reconhecendo titulos pelo tamanho da fonte. A biblioteca docx.js entao monta um arquivo .docx valido com a estrutura e formatacao basica recuperadas. PDFs escaneados (imagens de texto) nao contem dados textuais extraiveis e precisariam de OCR antes da conversao.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Por que preciso usar a janela de impressao?</summary>
              <p className="mt-2 text-gray-600">Gerar um PDF diretamente via JavaScript produziria um resultado inferior — fontes poderiam ser substituidas, tabelas desalinhadas e imagens perderiam resolucao. A funcao de impressao nativa do navegador ja tem um motor de renderizacao otimizado para isso, garantindo que o PDF final fique identico ao que voce ve na tela. Basta escolher &quot;Salvar como PDF&quot; em vez de selecionar uma impressora.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Tabelas e imagens do Word sao preservadas?</summary>
              <p className="mt-2 text-gray-600">Tabelas simples sao convertidas corretamente pelo Mammoth.js, incluindo celulas mescladas e bordas. Imagens embutidas no documento tambem sao transferidas. Porem, layouts muito complexos — como tabelas aninhadas dentro de tabelas, caixas de texto flutuantes ou graficos SmartArt — podem sofrer deslocamento. Recomendamos verificar o resultado antes de enviar para terceiros.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Posso converter .doc (formato antigo)?</summary>
              <p className="mt-2 text-gray-600">Nao. A ferramenta aceita apenas .docx, o formato introduzido no Word 2007. Arquivos .doc usam um formato binario proprietario que as bibliotecas JavaScript atuais nao conseguem interpretar. Se voce tem um .doc, abra-o no Word ou LibreOffice e salve como .docx antes de usar o conversor.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">O PDF para Word extrai imagens?</summary>
              <p className="mt-2 text-gray-600">Nao. A conversao PDF para Word extrai apenas o conteudo textual — paragrafos, titulos e estrutura basica. Imagens presentes no PDF nao sao transferidas para o .docx. Se voce precisa das imagens, salve-as separadamente usando uma ferramenta de captura ou um editor de PDF.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Qual navegador funciona melhor?</summary>
              <p className="mt-2 text-gray-600">Chrome e Edge oferecem a melhor experiencia, especialmente na etapa &quot;Salvar como PDF&quot;: permitem ajustar margens, escala e orientacao da pagina diretamente na janela de impressao. O Firefox tambem funciona, mas com menos opcoes de configuracao. O Safari pode apresentar diferenca de fontes em alguns documentos.</p>
            </details>
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">Qual o tamanho maximo de arquivo?</summary>
              <p className="mt-2 text-gray-600">O limite e de 20 MB por arquivo. Documentos muito grandes com muitas imagens em alta resolucao podem levar mais tempo para processar, dependendo da memoria disponivel no seu dispositivo. Se o arquivo for maior, considere remover imagens desnecessarias ou dividir o documento em partes.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitacoes e Transparencia</h2>
          <p className="mb-3">
            Para que voce saiba exatamente o que esperar, listamos as limitacoes conhecidas de cada direcao de conversao:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 mb-3">
            <li><strong>Word para PDF — nao e conversao direta:</strong> A ferramenta converte o .docx em HTML e usa a funcao &quot;Salvar como PDF&quot; do navegador. O resultado depende do motor de renderizacao do seu navegador, por isso fontes, espacamentos e quebras de pagina podem variar entre Chrome, Firefox e Safari.</li>
            <li><strong>Word para PDF — layouts complexos:</strong> Caixas de texto flutuantes, graficos SmartArt, WordArt, formas geometricas e macros nao sao suportados pelo Mammoth.js. O conteudo textual sera preservado, mas a disposicao visual pode diferir do original.</li>
            <li><strong>PDF para Word — somente texto:</strong> A conversao extrai texto e identifica titulos, mas nao recupera imagens, tabelas formatadas, cabecalhos/rodapes nem numeracao de paginas. O .docx gerado e ideal para reutilizar o conteudo textual, nao para recriar o layout visual do PDF.</li>
            <li><strong>PDF para Word — PDFs escaneados:</strong> PDFs que contem imagens de texto (escaneados, fotos de documentos) nao tem dados textuais extraiveis. A conversao retornara vazio ou com erro. Nesses casos, e necessario OCR (reconhecimento optico de caracteres) antes da conversao.</li>
            <li><strong>Formato .doc nao suportado:</strong> Apenas arquivos .docx (Word 2007 em diante) sao aceitos. Arquivos .doc precisam ser convertidos para .docx pelo Word ou LibreOffice antes do uso.</li>
          </ul>
          <p>
            <strong>Exemplo verificavel:</strong> Crie um .docx simples no Word com um titulo, dois paragrafos e uma tabela de 2 colunas. Converta para PDF aqui e compare: o texto e a tabela serao preservados fielmente. Se adicionar uma imagem ao .docx, ela tambem aparecera no PDF. Esse teste confirma o funcionamento basico sem depender de nossa descricao.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas para Conversao de Documentos</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Curriculo:</strong> Sempre envie em PDF para vagas de emprego. O formato garante que fontes, espacamento e layout fiquem identicos em qualquer computador ou celular do recrutador — um .docx pode abrir diferente dependendo da versao do Word.</li>
            <li><strong>Contrato recebido em PDF:</strong> Use a conversao PDF para Word para extrair o texto e poder revisar, anotar ou comparar clausulas com mais facilidade. Lembre-se de que o .docx gerado serve para analise — o documento oficial continua sendo o PDF original.</li>
            <li><strong>Use Chrome ou Edge:</strong> Esses navegadores oferecem as melhores opcoes na janela &quot;Salvar como PDF&quot;, incluindo controle de margens, orientacao (retrato/paisagem) e escala. O resultado e visivelmente superior ao de outros navegadores.</li>
            <li><strong>Verifique tabelas apos conversao:</strong> Tabelas complexas com celulas mescladas ou larguras customizadas podem precisar de ajuste manual no Word. Confira o resultado visualmente antes de considerar a conversao finalizada.</li>
            <li><strong>Alternativa para layouts complexos:</strong> Se o documento tem muitas imagens, graficos ou formatacao avancada, considere usar a funcao &quot;Exportar como PDF&quot; do proprio Microsoft Word ou LibreOffice — esses programas conseguem reproduzir o layout com maior fidelidade do que a conversao via navegador.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
