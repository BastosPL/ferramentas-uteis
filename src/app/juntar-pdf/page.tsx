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

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Combinacao de PDFs</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Nossa ferramenta utiliza a biblioteca pdf-lib, uma solucao JavaScript de codigo aberto que processa documentos PDF inteiramente no navegador do usuario. Isso garante que seus arquivos nunca sejam enviados para servidores externos, mantendo total privacidade e seguranca.</p>
          <p>O processo tecnico funciona da seguinte forma: quando voce seleciona os PDFs, cada arquivo e lido e armazenado como um ArrayBuffer na memoria do navegador. No momento da combinacao, o sistema cria um novo documento PDF vazio e, para cada arquivo de origem, carrega o PDF completo, copia todas as suas paginas e as adiciona sequencialmente ao documento final.</p>
          <p>A copia e feita pagina por pagina, preservando todos os elementos originais: texto, imagens, fontes incorporadas, links, anotacoes e formatacao. O tamanho de cada pagina tambem e mantido — se voce combinar um PDF A4 com um PDF carta, cada pagina preservara suas dimensoes originais no documento final.</p>
          <p>Apos copiar todas as paginas de todos os arquivos, o sistema salva o PDF combinado como um arquivo binario e dispara o download automaticamente. Todo esse processo acontece em milissegundos para arquivos de tamanho comum, sem necessidade de recarregar a pagina ou aguardar processamento em nuvem.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Meus PDFs sao enviados para algum servidor?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. Todo o processamento e feito localmente no seu navegador. Seus arquivos nunca saem do seu computador, o que garante total privacidade e seguranca. Diferente de servicos como ILovePDF ou SmallPDF que processam arquivos na nuvem, nossa ferramenta opera 100% offline apos o carregamento da pagina.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Quantos PDFs posso combinar de uma vez?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao existe um limite fixo de quantidade de arquivos. Na pratica, o desempenho depende da memoria disponivel no seu dispositivo. Para uso comum, combinar ate 20-30 PDFs funciona perfeitamente. Para volumes maiores ou arquivos muito pesados (acima de 50MB cada), recomendamos dividir em lotes menores.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">A formatacao dos PDFs originais e preservada?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. A ferramenta copia as paginas integralmente, preservando textos, imagens, fontes, tabelas, graficos, links e toda a formatacao original. O resultado e identico a abrir cada PDF separadamente — apenas reunido em um unico arquivo.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso juntar PDFs protegidos com senha?</summary>
            <p className="px-4 pb-4 text-gray-700">PDFs protegidos com senha de abertura nao podem ser processados pela ferramenta, pois o navegador nao consegue ler seu conteudo sem a senha. PDFs com restricoes de edicao (que abrem normalmente mas impedem copiar texto) geralmente funcionam, pois a copia de paginas nao e bloqueada pelas restricoes de edicao na maioria dos casos.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Funciona no celular?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. A ferramenta e responsiva e funciona em smartphones e tablets. Voce pode selecionar PDFs do armazenamento do celular ou de servicos de nuvem como Google Drive e iCloud. O arquivo combinado sera salvo na pasta de downloads do dispositivo.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso alterar a ordem das paginas de um unico PDF?</summary>
            <p className="px-4 pb-4 text-gray-700">Esta ferramenta combina PDFs inteiros na ordem que voce definir, mas nao permite reorganizar paginas individuais dentro de um mesmo PDF. Para reorganizar paginas de um unico documento, voce pode dividir o PDF em partes menores e depois recombina-las na ordem desejada.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O tamanho do arquivo final e a soma dos originais?</summary>
            <p className="px-4 pb-4 text-gray-700">Em geral, o tamanho do PDF combinado e aproximadamente a soma dos arquivos originais. Em alguns casos, pode ser ligeiramente menor se houver recursos compartilhados (como fontes iguais) que sao otimizados durante a combinacao. Nao e aplicada compressao adicional, garantindo que a qualidade original seja preservada.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>Juntar PDFs e uma necessidade comum em diversas situacoes profissionais e pessoais. Veja alguns cenarios onde essa ferramenta e especialmente util:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Documentacao para processos:</strong> Reuna RG, CPF, comprovante de residencia e outros documentos em um unico PDF para enviar em processos seletivos, matriculas ou solicitacoes governamentais.</li>
            <li><strong>Relatorios empresariais:</strong> Combine relatorios mensais, graficos de desempenho e apresentacoes em um documento consolidado para reunioes e auditorias.</li>
            <li><strong>Trabalhos academicos:</strong> Junte capa, sumario, capitulos e anexos gerados em momentos diferentes em um unico arquivo para entrega final.</li>
            <li><strong>Propostas comerciais:</strong> Una proposta tecnica, orcamento, portfolio e termos contratuais em um documento profissional para enviar a clientes.</li>
            <li><strong>Organizacao de recibos:</strong> Agrupe comprovantes de pagamento, notas fiscais e recibos do mes em um unico PDF para controle financeiro e contabilidade.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
