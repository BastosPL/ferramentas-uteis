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

      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Conversor de Imagem para PDF</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Converter imagens para PDF com nossa ferramenta e rapido e nao exige cadastro nem instalacao de software. Siga o passo a passo:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Escolha a orientacao da pagina:</strong> Selecione &quot;Retrato (A4)&quot; para documentos verticais ou &quot;Paisagem&quot; para imagens mais largas do que altas, como banners e fotos panoramicas.</li>
            <li><strong>Selecione suas imagens:</strong> Clique na area pontilhada para abrir o seletor de arquivos do seu computador. Voce pode selecionar multiplas imagens de uma vez segurando Ctrl (ou Cmd no Mac) enquanto clica nos arquivos. Os formatos aceitos sao JPG e PNG.</li>
            <li><strong>Revise e organize:</strong> As imagens selecionadas aparecem como miniaturas na tela. Passe o mouse sobre qualquer imagem e clique no &quot;X&quot; vermelho para remover as que nao deseja incluir no PDF.</li>
            <li><strong>Converta para PDF:</strong> Clique no botao &quot;Converter X imagem(ns) para PDF&quot;. O arquivo PDF sera gerado instantaneamente e o download comecara automaticamente.</li>
            <li><strong>Adicione mais imagens:</strong> Voce pode clicar novamente na area de selecao para adicionar mais imagens antes de converter. Todas serao combinadas em um unico PDF.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Conversao</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Diferente de ferramentas que combinam PDFs ja existentes, este conversor transforma imagens JPG e PNG em paginas de um documento PDF. Cada foto selecionada vira uma pagina independente no arquivo final — se voce escolher 12 fotos, o PDF tera exatamente 12 paginas.</p>
          <p>O processo de incorporacao (embedding) funciona assim: cada imagem e decodificada pelo navegador e inserida diretamente no PDF como dados graficos. A ferramenta calcula a proporcao da foto e compara com as dimensoes da pagina A4 (210 x 297 mm). Uma foto de celular no formato 4:3, por exemplo, nao preenche a pagina inteira — o sistema centraliza a imagem e distribui margens iguais nas laterais para manter o enquadramento harmonico.</p>
          <p>Quando a imagem e mais larga que alta (paisagem), a pagina e automaticamente rotacionada para acomodar a foto na horizontal. Isso evita que fotos panoramicas aparecam diminutas no centro de uma pagina vertical. O resultado e um PDF onde cada imagem ocupa o maximo de espaco possivel sem distorcer ou cortar o conteudo original.</p>
          <p>Todo o processamento usa a biblioteca pdf-lib diretamente no navegador. As imagens nao passam por nenhum servidor — o PDF e montado na memoria do seu dispositivo e entregue como download instantaneo.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Por que minhas fotos ficam com bordas brancas no PDF?</summary>
            <p className="px-4 pb-4 text-gray-700">Isso acontece porque a proporcao da sua foto e diferente da proporcao da pagina A4. Uma foto de celular tipica tem formato 4:3 ou 16:9, enquanto o A4 e aproximadamente 1:1.41. Como a ferramenta nunca corta ou distorce a imagem, ela centraliza a foto e preenche o espaco restante com margens brancas. Para reduzir as bordas, voce pode recortar a imagem antes para uma proporcao mais proxima do A4 (por exemplo, 210 x 297 pixels de proporcao).</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso misturar fotos na vertical e na horizontal?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. Cada pagina do PDF se adapta individualmente a orientacao da imagem. Se voce selecionar 5 fotos em retrato e 3 em paisagem, as paginas correspondentes serao automaticamente ajustadas — retrato para as verticais, paisagem para as horizontais. Nao e necessario separar as fotos por orientacao.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Qual a resolucao ideal das imagens?</summary>
            <p className="px-4 pb-4 text-gray-700">Depende do uso final. Para imprimir o PDF com qualidade profissional, o ideal e usar imagens com pelo menos 300 DPI — o que equivale a aproximadamente 2480 x 3508 pixels para preencher uma pagina A4 inteira. Para visualizacao em tela (enviar por email, anexar em formulario), 150 DPI ja e suficiente, ou seja, cerca de 1240 x 1754 pixels. Fotos de celulares modernos geralmente ultrapassam esses valores, entao na maioria dos casos a resolucao ja sera adequada.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso converter WebP ou HEIC?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao diretamente. A ferramenta aceita apenas JPG e PNG, que sao os formatos mais universais. Fotos do iPhone em formato HEIC e imagens WebP da internet precisam ser convertidas antes. Voce pode usar o aplicativo Fotos do celular para exportar como JPG, ou sites gratuitos de conversao de formato. Apos converter, basta selecionar os arquivos JPG ou PNG resultantes nesta ferramenta.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O PDF gerado tem texto pesquisavel?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. O PDF criado contem apenas as imagens como elementos graficos — nao ha camada de texto. Isso significa que voce nao consegue selecionar, copiar ou pesquisar palavras dentro do PDF. Para criar PDFs com texto pesquisavel a partir de fotos de documentos, seria necessario um software de OCR (reconhecimento optico de caracteres), que e um processo diferente. Esta ferramenta foca em preservar a qualidade visual exata das suas imagens.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>Converter fotos para PDF e essencial em situacoes que exigem documentos padronizados. Veja como aproveitar melhor esta ferramenta:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Digitalizar documentos com o celular:</strong> Posicione o documento sobre uma superficie lisa e bem iluminada. Fotografe de cima, mantendo o celular paralelo ao papel para evitar distorcao trapezoidal. Evite sombras e reflexos — luz natural difusa e o ideal.</li>
            <li><strong>Fotos para concurso ou processo seletivo:</strong> Muitos editais exigem fotos 3x4 ou documentos em PDF com resolucao minima de 200 DPI. Verifique as especificacoes do edital antes de converter. Uma foto de celular com 12 MP ou mais geralmente atende aos requisitos.</li>
            <li><strong>Comprovantes e recibos em lote:</strong> Se voce tem dezenas de comprovantes para organizar, considere comprimir as imagens antes (reduzindo para 1000 pixels de largura, por exemplo). Isso mantem a legibilidade e reduz o tamanho final do PDF de centenas de MB para poucos MB.</li>
            <li><strong>Portfolio de design ou fotografia:</strong> Organize as imagens na ordem desejada antes de selecionar. A sequencia no PDF sera a mesma da selecao. Para portfolios profissionais, use imagens na maior resolucao disponivel.</li>
            <li><strong>Documentos para orgaos publicos:</strong> Sites como gov.br, DETRAN e prefeituras geralmente exigem PDF em formato A4, orientacao retrato e tamanho maximo de 5 MB. Converta cada documento separadamente e verifique se o texto esta legivel antes de enviar.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
