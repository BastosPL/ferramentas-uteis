"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit".split(" ");

function gerarPalavras(n: number): string {
  const resultado: string[] = [];
  for (let i = 0; i < n; i++) {
    resultado.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  resultado[0] = resultado[0].charAt(0).toUpperCase() + resultado[0].slice(1);
  return resultado.join(" ") + ".";
}

function gerarFrase(): string {
  const tam = 8 + Math.floor(Math.random() * 12);
  return gerarPalavras(tam);
}

function gerarParagrafo(): string {
  const numFrases = 3 + Math.floor(Math.random() * 5);
  return Array.from({ length: numFrases }, gerarFrase).join(" ");
}

export default function GeradorLoremIpsum() {
  const [tipo, setTipo] = useState<"paragrafos" | "frases" | "palavras">("paragrafos");
  const [quantidade, setQuantidade] = useState(3);
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [iniciarComLorem, setIniciarComLorem] = useState(true);

  const gerar = () => {
    let resultado = "";
    if (tipo === "paragrafos") {
      resultado = Array.from({ length: quantidade }, gerarParagrafo).join("\n\n");
    } else if (tipo === "frases") {
      resultado = Array.from({ length: quantidade }, gerarFrase).join(" ");
    } else {
      resultado = gerarPalavras(quantidade);
    }

    if (iniciarComLorem) {
      resultado = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + resultado;
    }
    setTexto(resultado);
    setCopiado(false);
  };

  const copiar = async () => {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const stats = texto ? {
    chars: texto.length,
    words: texto.split(/\s+/).length,
    paragraphs: texto.split("\n\n").length,
  } : null;

  return (
    <ToolPage
      title="Gerador de Lorem Ipsum"
      description="Gere textos placeholder Lorem Ipsum para preencher layouts, mockups e prototipos. Escolha entre paragrafos, frases ou palavras."
      accent="purple"
      icon="📜"
      slug="gerador-lorem-ipsum"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: "paragrafos" as const, label: "Paragrafos" },
            { id: "frases" as const, label: "Frases" },
            { id: "palavras" as const, label: "Palavras" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                tipo === t.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Quantidade</label>
            <input
              type="number"
              min={1}
              max={tipo === "palavras" ? 1000 : 50}
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={iniciarComLorem} onChange={(e) => setIniciarComLorem(e.target.checked)} className="w-4 h-4 accent-purple-600" />
            <span className="text-sm text-gray-700">Iniciar com &quot;Lorem ipsum...&quot;</span>
          </label>
        </div>

        <button
          onClick={gerar}
          className="w-full bg-purple-600 text-white rounded-lg py-3 font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
        >
          Gerar Lorem Ipsum
        </button>
      </div>

      {texto && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Texto Gerado</h2>
            <div className="flex items-center gap-3">
              {stats && (
                <span className="text-xs text-gray-500">
                  {stats.chars} caracteres | {stats.words} palavras | {stats.paragraphs} paragrafo(s)
                </span>
              )}
              <button
                onClick={copiar}
                className="bg-purple-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-purple-700 cursor-pointer"
              >
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {texto}
          </div>
        </div>
      )}

      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">O que e Lorem Ipsum?</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Lorem Ipsum e um texto placeholder usado na industria grafica e de design desde o seculo XVI. Ele e utilizado para preencher espacos em layouts e prototipos sem distrair o leitor com conteudo significativo, permitindo que designers e desenvolvedores foquem exclusivamente no design visual. O trecho classico tem origem na obra &quot;de Finibus Bonorum et Malorum&quot;, escrita por Cicero em 45 a.C., e foi popularizado nos anos 1960 com folhas de letraset e, mais tarde, com softwares de editoracao eletronica como o Aldus PageMaker.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador de Lorem Ipsum</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Usar nosso gerador de Lorem Ipsum e simples e rapido. Siga o passo a passo abaixo para gerar textos placeholder sob medida para o seu projeto:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Escolha o tipo de conteudo:</strong> Selecione entre &quot;Paragrafos&quot;, &quot;Frases&quot; ou &quot;Palavras&quot; clicando nos botoes correspondentes. Paragrafos sao ideais para preencher blocos de texto em paginas web. Frases funcionam bem para legendas, descricoes curtas e campos de formulario. Palavras sao uteis para titulos, nomes de botoes e labels de interface.</li>
            <li><strong>Defina a quantidade:</strong> Insira o numero desejado no campo &quot;Quantidade&quot;. Voce pode gerar ate 50 paragrafos ou frases, e ate 1000 palavras por vez.</li>
            <li><strong>Escolha se quer o inicio classico:</strong> Marque ou desmarque a opcao &quot;Iniciar com Lorem ipsum...&quot; para decidir se o texto comeca com a frase tradicional.</li>
            <li><strong>Clique em &quot;Gerar Lorem Ipsum&quot;:</strong> O texto sera exibido imediatamente na area de resultado, com estatisticas de caracteres, palavras e paragrafos.</li>
            <li><strong>Copie o resultado:</strong> Use o botao &quot;Copiar&quot; para enviar o texto diretamente para a area de transferencia do seu computador e colar onde precisar.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o Gerador</h2>
        <div className="text-gray-700 leading-relaxed space-y-3 mb-8">
          <p>Nosso gerador de Lorem Ipsum utiliza um algoritmo que combina palavras do vocabulario classico do Lorem Ipsum de forma pseudo-aleatoria, garantindo que cada texto gerado seja unico. O processo funciona da seguinte maneira:</p>
          <p>O banco de palavras contem mais de 90 termos extraidos do texto original em latim, incluindo as palavras tradicionais como &quot;lorem&quot;, &quot;ipsum&quot;, &quot;dolor&quot;, &quot;sit&quot; e &quot;amet&quot;, alem de extensoes do texto de Cicero. Quando voce clica em gerar, o algoritmo seleciona palavras aleatoriamente desse banco e as organiza em frases com tamanho variavel entre 8 e 19 palavras cada.</p>
          <p>Para paragrafos, o sistema cria entre 3 e 7 frases por paragrafo, simulando a estrutura natural de um texto corrido. Cada frase comeca automaticamente com letra maiuscula e termina com ponto final. A primeira palavra de cada bloco gerado tambem recebe capitalizacao automatica.</p>
          <p>Todo o processamento acontece diretamente no seu navegador, usando JavaScript puro. Nenhum dado e enviado para servidores externos, o que significa que a geracao e instantanea e totalmente privada. O contador de estatisticas calcula em tempo real o numero de caracteres, palavras e paragrafos do texto gerado, facilitando o planejamento de conteudo para layouts com restricoes de espaco.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3 mb-8">
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O que significa Lorem Ipsum?</summary>
            <p className="px-4 pb-4 text-gray-700">Lorem Ipsum nao e um texto com significado coerente em latim. Ele deriva de uma obra de Cicero escrita em 45 a.C. chamada &quot;de Finibus Bonorum et Malorum&quot; (Sobre os Extremos do Bem e do Mal), mas as palavras foram alteradas e embaralhadas ao longo dos seculos. O objetivo nunca foi comunicar uma mensagem, mas sim servir como texto de preenchimento visual para layouts graficos.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Por que usar Lorem Ipsum em vez de texto real?</summary>
            <p className="px-4 pb-4 text-gray-700">Usar texto placeholder como o Lorem Ipsum evita que clientes e revisores se distraiam com o conteudo escrito e foquem no design visual. Quando um layout usa texto real, a tendencia natural e ler e avaliar o conteudo em vez de analisar tipografia, espacamento e hierarquia visual. O Lorem Ipsum, por nao ter significado aparente, permite que a atencao se concentre nos elementos de design.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Posso usar o Lorem Ipsum gerado em projetos comerciais?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim, absolutamente. O Lorem Ipsum e um texto de dominio publico e pode ser usado livremente em qualquer projeto, seja pessoal ou comercial. No entanto, lembre-se de que ele deve ser substituido por conteudo real antes da publicacao final. Motores de busca como o Google podem penalizar paginas que contenham Lorem Ipsum, pois interpretam como conteudo incompleto ou de baixa qualidade.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Qual a diferenca entre gerar paragrafos, frases e palavras?</summary>
            <p className="px-4 pb-4 text-gray-700">Paragrafos geram blocos completos de texto com multiplas frases, ideais para preencher areas grandes como corpo de artigos, descricoes de produto e secoes de paginas. Frases geram sentencas individuais concatenadas, uteis para subtitulos, legendas e textos curtos. Palavras geram uma sequencia solta de termos, perfeita para titulos, labels de botoes, itens de menu e campos de formulario onde o espaco e limitado.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O texto gerado e sempre o mesmo?</summary>
            <p className="px-4 pb-4 text-gray-700">Nao. Cada vez que voce clica em &quot;Gerar Lorem Ipsum&quot;, o algoritmo seleciona palavras aleatoriamente, produzindo combinacoes unicas. Isso e util quando voce precisa de multiplos blocos de texto distintos para diferentes secoes de um layout, evitando a repeticao visual que poderia distorcer a percepcao do design final.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">O gerador funciona no celular?</summary>
            <p className="px-4 pb-4 text-gray-700">Sim, a ferramenta e totalmente responsiva e funciona em qualquer dispositivo com navegador moderno, incluindo smartphones e tablets. O botao de copiar tambem funciona em dispositivos moveis, enviando o texto para a area de transferencia do aparelho.</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">Existe um limite de texto que posso gerar?</summary>
            <p className="px-4 pb-4 text-gray-700">Voce pode gerar ate 50 paragrafos ou frases, e ate 1000 palavras por geracao. Caso precise de mais texto, basta clicar novamente em &quot;Gerar&quot; e combinar os resultados. Nao existe limite de vezes que voce pode usar o gerador — e totalmente gratuito e ilimitado.</p>
          </details>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>O Lorem Ipsum e extremamente versatil e pode ser aplicado em diversos cenarios do dia a dia de quem trabalha com design, desenvolvimento web ou marketing digital. Aqui estao algumas sugestoes de uso:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Prototipos no Figma ou Canva:</strong> Gere paragrafos para preencher blocos de texto em mockups de sites, aplicativos ou materiais graficos. Isso ajuda o cliente a visualizar como o layout ficara com conteudo real.</li>
            <li><strong>Desenvolvimento web:</strong> Use frases para testar componentes como cards, listas e secoes de conteudo enquanto o texto definitivo nao esta pronto.</li>
            <li><strong>Apresentacoes e documentos:</strong> Preencha slides e documentos com texto placeholder para demonstrar a estrutura e o formato antes de inserir o conteudo final.</li>
            <li><strong>Testes de tipografia:</strong> Gere volumes variados de texto para testar como diferentes fontes, tamanhos e espacamentos se comportam em situacoes reais de uso.</li>
            <li><strong>Templates de email marketing:</strong> Preencha templates de email com Lorem Ipsum para avaliar o design visual antes de escrever o copy final da campanha.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
