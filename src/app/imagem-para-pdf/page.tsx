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
          <p>Nossa ferramenta utiliza a biblioteca pdf-lib, uma solucao robusta em JavaScript que opera inteiramente no seu navegador. Isso significa que nenhuma imagem e enviada para servidores externos — todo o processamento acontece localmente no seu dispositivo.</p>
          <p>O processo tecnico funciona assim: quando voce seleciona as imagens, cada arquivo e lido e armazenado temporariamente na memoria do navegador como um buffer binario. No momento da conversao, o sistema cria um documento PDF vazio e, para cada imagem, adiciona uma nova pagina no tamanho A4 (595.28 x 841.89 pontos em retrato, ou invertido para paisagem).</p>
          <p>Cada imagem e incorporada (embedded) no PDF respeitando sua proporcao original. O algoritmo calcula a razao entre largura e altura da imagem e compara com a razao da pagina. Se a imagem for mais larga proporcionalmente, ela ocupa toda a largura da pagina com margens laterais; se for mais alta, ocupa toda a altura. Em ambos os casos, a imagem e centralizada na pagina com uma margem minima de 20 pontos em cada lado.</p>
          <p>O resultado e um PDF com qualidade profissional, onde cada pagina contem uma imagem perfeitamente enquadrada e centralizada. O arquivo final e gerado como um Blob binario e disponibilizado para download instantaneo, sem necessidade de recarregar a pagina.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Minhas imagens sao enviadas para algum servidor?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. Todo o processamento acontece localmente no seu navegador. Suas imagens nunca saem do seu computador, garantindo total privacidade. Diferente de muitos sites concorrentes que enviam seus arquivos para servidores na nuvem, nossa ferramenta usa tecnologia 100% client-side.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Quais formatos de imagem sao aceitos?</summary>
            <p className="px-4 pb-4 text-gray-700">A ferramenta aceita imagens nos formatos JPG (JPEG) e PNG. Sao os formatos mais comuns usados em fotos, capturas de tela e imagens da web. Se voce tem imagens em outros formatos como WebP, BMP ou TIFF, recomendamos converter para JPG ou PNG antes de usar a ferramenta.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Quantas imagens posso converter de uma vez?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao existe um limite rigido de quantidade, mas recomendamos converter ate 50 imagens por vez para garantir um bom desempenho. Imagens muito pesadas (acima de 10MB cada) podem tornar o processamento mais lento, dependendo da memoria disponivel no seu dispositivo.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">A qualidade das imagens e preservada no PDF?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. As imagens sao incorporadas no PDF em sua resolucao original, sem compressao adicional. A qualidade visual no PDF sera identica a da imagem original. Apenas o enquadramento e ajustado para caber na pagina A4 mantendo a proporcao.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso escolher a ordem das imagens no PDF?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. As imagens aparecem no PDF na mesma ordem em que foram selecionadas e exibidas como miniaturas na tela. Caso queira alterar a ordem, remova as imagens indesejadas e adicione-as novamente na sequencia correta.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Funciona no celular?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim. A ferramenta e totalmente responsiva e funciona em smartphones e tablets com navegadores modernos. Voce pode selecionar fotos diretamente da galeria do celular e converter para PDF. O download do arquivo sera salvo na pasta de downloads do seu dispositivo.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O PDF gerado pode ser editado depois?</summary>
            <p className="px-4 pb-4 text-gray-700">O PDF contem as imagens como elementos graficos fixos, ou seja, nao e possivel editar o conteudo das imagens dentro do PDF. Porem, voce pode usar ferramentas como o Adobe Acrobat ou nosso proprio &quot;Juntar PDF&quot; para combinar o arquivo com outros documentos ou reorganizar as paginas.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>A conversao de imagem para PDF e util em muitas situacoes do dia a dia. Aqui estao cenarios onde essa ferramenta pode ajudar:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Digitalizar documentos:</strong> Tire fotos de documentos fisicos com o celular e converta para PDF para enviar por email ou armazenar digitalmente com aparencia profissional.</li>
            <li><strong>Portfolio de trabalhos:</strong> Reuna fotos de projetos, artes ou trabalhos em um unico PDF organizado para enviar a clientes ou publicar online.</li>
            <li><strong>Comprovantes e recibos:</strong> Junte capturas de tela de comprovantes de pagamento, recibos e notas fiscais em um unico arquivo PDF para facilitar a organizacao financeira.</li>
            <li><strong>Trabalhos academicos:</strong> Converta graficos, diagramas e fotos de experimentos em PDF para anexar a relatorios e trabalhos universitarios.</li>
            <li><strong>Envio para orgaos publicos:</strong> Muitos sites governamentais exigem documentos em formato PDF. Converta fotos de documentos como RG, CPF e comprovante de residencia para o formato correto.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
