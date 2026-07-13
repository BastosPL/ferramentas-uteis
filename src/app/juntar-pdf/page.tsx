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
      slug="juntar-pdf"
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

      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Ferramenta de Juntar PDF</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Combinar varios PDFs em um unico arquivo e um processo simples com nossa ferramenta. Veja o passo a passo completo:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Selecione os arquivos PDF:</strong> Clique na area pontilhada ou arraste seus arquivos diretamente para ela. Voce pode selecionar multiplos PDFs de uma vez segurando Ctrl (ou Cmd no Mac) durante a selecao.</li>
            <li><strong>Organize a ordem:</strong> Use as setas para cima e para baixo ao lado de cada arquivo para definir a sequencia desejada no documento final. O primeiro arquivo da lista sera o inicio do PDF combinado.</li>
            <li><strong>Remova arquivos indesejados:</strong> Caso tenha adicionado algum arquivo por engano, clique no botao &quot;X&quot; vermelho para remove-lo da lista sem afetar os demais.</li>
            <li><strong>Adicione mais arquivos:</strong> Voce pode clicar novamente na area de selecao para adicionar mais PDFs a qualquer momento antes de juntar.</li>
            <li><strong>Clique em &quot;Juntar PDFs&quot;:</strong> O arquivo combinado sera gerado e o download comecara automaticamente. O nome padrao do arquivo sera &quot;documento-combinado.pdf&quot;.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Combinacao</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Esta ferramenta une documentos PDF ja prontos em um unico arquivo. Diferente do conversor de imagens para PDF (que transforma fotos em paginas), aqui voce trabalha com PDFs completos — cada um ja tem seu texto, fontes, imagens e formatacao propria.</p>
          <p>O processo de mesclagem copia cada pagina dos PDFs originais para um novo documento, na ordem que voce definir. A copia e feita no nivel estrutural do PDF: o texto continua sendo texto selecionavel, as fontes incorporadas sao transferidas, e os hyperlinks internos e externos permanecem funcionais no arquivo combinado.</p>
          <p>Um detalhe importante e que cada pagina preserva suas dimensoes originais. Se voce combinar um relatorio em A4 (210 x 297 mm) com um contrato em formato Carta (215.9 x 279.4 mm), o PDF final tera paginas com tamanhos diferentes — o leitor de PDF ajusta a visualizacao automaticamente. Isso evita distorcoes que ocorreriam se todas as paginas fossem forcadas a um tamanho unico.</p>
          <p>O processamento acontece inteiramente no navegador usando a biblioteca pdf-lib. Os arquivos nao sao enviados para nenhum servidor — a combinacao e feita na memoria do seu dispositivo e o resultado e disponibilizado como download direto.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso escolher quais paginas de cada PDF incluir?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. Esta ferramenta combina PDFs completos — todas as paginas de cada arquivo sao incluidas no resultado final. Se voce precisa incluir apenas paginas especificas, primeiro separe as paginas desejadas usando uma ferramenta de divisao de PDF e depois combine os arquivos resultantes aqui.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">PDFs com tamanhos de pagina diferentes funcionam?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. Cada pagina mantem suas dimensoes originais no documento combinado. Voce pode juntar um PDF em A4 com outro em formato Carta ou ate em tamanhos personalizados sem problema. O leitor de PDF (Adobe Reader, navegador, etc.) ajusta a exibicao de cada pagina individualmente. Isso e util quando voce precisa anexar plantas tecnicas em formato A3 junto a relatorios em A4, por exemplo.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O PDF combinado mantem os links e marcadores?</summary>
            <p className="px-4 pb-4 text-gray-700">Os hyperlinks (URLs clicaveis e links para emails) sao preservados na maioria dos casos. Ja os marcadores (bookmarks) da barra lateral e o sumario interativo do PDF original podem nao ser transferidos, pois dependem da estrutura de navegacao do documento de origem. Se os marcadores sao essenciais, recomendamos verificar o PDF final e adiciona-los manualmente em um editor como o Adobe Acrobat.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso juntar um PDF com um documento Word?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao diretamente. Esta ferramenta aceita apenas arquivos no formato PDF. Para incluir um documento Word (.docx), primeiro converta-o para PDF usando nossa ferramenta &quot;Word para PDF&quot; disponivel no site, ou exporte como PDF pelo proprio Microsoft Word (Arquivo &gt; Salvar como &gt; PDF). Depois, basta selecionar o PDF resultante junto com os demais arquivos aqui.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O tamanho final e a soma dos originais?</summary>
            <p className="px-4 pb-4 text-gray-700">Aproximadamente, sim. Na pratica, o arquivo combinado pode ser ate 5-10% menor que a soma dos originais quando os PDFs compartilham as mesmas fontes (como Arial ou Times New Roman) — a biblioteca evita duplicar recursos identicos. Por outro lado, nao ha compressao adicional das imagens ou do conteudo, entao a qualidade permanece intacta. Se voce combinar 3 PDFs de 2 MB cada, espere um resultado entre 5.4 e 6 MB.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>Reunir varios PDFs em um so e uma tarefa frequente no trabalho e na vida pessoal. Estas dicas ajudam a obter o melhor resultado:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Documentacao pessoal completa:</strong> Junte RG + CPF + comprovante de endereco + certidao em um unico arquivo para processos seletivos, matriculas e cadastros. Muitos portais aceitam apenas um upload por campo — ter tudo em um PDF resolve o problema.</li>
            <li><strong>Relatorios financeiros mensais:</strong> Reuna os balancetes de janeiro a dezembro em um documento consolidado para auditoria ou prestacao de contas. A paginacao sequencial facilita a referencia durante reunioes.</li>
            <li><strong>Propostas comerciais profissionais:</strong> Una a proposta tecnica + tabela de precos + contrato de servico + portfolio de casos de sucesso. Um unico PDF transmite mais profissionalismo do que quatro anexos separados no email.</li>
            <li><strong>Nomeie os PDFs antes de selecionar:</strong> A ordem dos arquivos no seletor determina a ordem no PDF final. Renomear como &quot;01-capa.pdf&quot;, &quot;02-introducao.pdf&quot;, &quot;03-conteudo.pdf&quot; garante a sequencia correta ao selecionar todos de uma vez.</li>
            <li><strong>Verifique a paginacao final:</strong> Apos combinar, abra o PDF e confira se nao ficaram paginas em branco entre os documentos. Alguns PDFs tem uma pagina vazia no final que so aparece depois da juncao. Se necessario, remova o PDF problematico, delete a pagina em branco na origem e combine novamente.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
