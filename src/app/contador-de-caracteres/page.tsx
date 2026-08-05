"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const limites = [
  { nome: "Twitter/X", limite: 280 },
  { nome: "Instagram Bio", limite: 150 },
  { nome: "Meta Description", limite: 160 },
  { nome: "Title Tag", limite: 60 },
  { nome: "LinkedIn Post", limite: 3000 },
  { nome: "YouTube Titulo", limite: 100 },
];

export default function ContadorDeCaracteres() {
  const [texto, setTexto] = useState("");

  const caracteres = texto.length;
  const semEspacos = texto.replace(/\s/g, "").length;
  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const frases = texto.trim() ? texto.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const paragrafos = texto.trim() ? texto.split(/\n\n+/).filter((p) => p.trim()).length : 0;
  const tempoLeitura = Math.max(1, Math.ceil(palavras / 200));

  return (
    <ToolPage title="Contador de Caracteres e Palavras" description="Conte caracteres, palavras, frases e paragrafos do seu texto. Verifique se esta dentro dos limites de redes sociais e SEO." accent="purple" icon="📝" slug="contador-de-caracteres">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole ou digite seu texto aqui..."
          rows={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y text-base"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {[
            { label: "Caracteres", value: caracteres },
            { label: "Sem Espacos", value: semEspacos },
            { label: "Palavras", value: palavras },
            { label: "Frases", value: frases },
            { label: "Paragrafos", value: paragrafos },
            { label: "Tempo de Leitura", value: `${tempoLeitura} min` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 rounded-lg p-3 text-center"
            >
              <p className="text-2xl font-bold text-purple-600">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Limites de Plataformas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {limites.map((item) => {
            const pct = Math.min(100, (caracteres / item.limite) * 100);
            const excedeu = caracteres > item.limite;
            return (
              <div key={item.nome} className="border border-gray-100 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.nome}</span>
                  <span className={`text-xs font-mono ${excedeu ? "text-red-600" : "text-gray-500"}`}>
                    {caracteres}/{item.limite}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${excedeu ? "bg-red-500" : "bg-purple-500"}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {texto && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Frequencia de Palavras</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              texto
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 2)
                .reduce(
                  (acc, word) => {
                    const clean = word.replace(/[^a-zA-ZÀ-ÿ]/g, "");
                    if (clean) acc[clean] = (acc[clean] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 20)
              .map(([word, count]) => (
                <span
                  key={word}
                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {word} ({count})
                </span>
              ))}
          </div>
        </div>
      )}

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Contador de Caracteres</h2>
          <p className="mb-3">
            Nossa ferramenta de contagem de caracteres e palavras e projetada para ser simples e instantanea. Veja como aproveitar todos os recursos:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Digite ou cole seu texto:</strong> Insira o conteudo na area de texto principal. A contagem e atualizada automaticamente em tempo real, sem necessidade de clicar em nenhum botao.</li>
            <li><strong>Acompanhe as metricas:</strong> Seis metricas sao exibidas simultaneamente — caracteres totais, caracteres sem espacos, palavras, frases, paragrafos e tempo estimado de leitura. Cada metrica e util para um contexto diferente.</li>
            <li><strong>Verifique os limites de plataformas:</strong> A secao de limites mostra barras de progresso para Twitter/X (280), Instagram Bio (150), Meta Description (160), Title Tag (60), LinkedIn Post (3.000) e YouTube Titulo (100). Se voce ultrapassar o limite, a barra fica vermelha.</li>
            <li><strong>Analise a frequencia de palavras:</strong> Quando voce digita um texto, a ferramenta exibe automaticamente as 20 palavras mais usadas (com 3 ou mais letras), ajudando a identificar repeticoes excessivas e oportunidades de melhorar a variedade lexica.</li>
            <li><strong>Use para SEO:</strong> Antes de publicar qualquer conteudo, verifique se seu title tag e meta description estao dentro dos limites recomendados. Textos que excedem esses limites sao cortados nos resultados do Google.</li>
          </ol>
          <p className="mt-3">
            Dica: voce pode usar o atalho Ctrl+A (ou Cmd+A no Mac) para selecionar todo o texto e substitui-lo rapidamente quando precisar verificar um novo conteudo.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Contagem</h2>
          <p className="mb-3">
            A contagem de caracteres inclui absolutamente tudo o que voce digita: letras, numeros, espacos, pontuacao e caracteres especiais. Cada tecla pressionada ou caractere colado conta como uma unidade. A contagem &quot;sem espacos&quot; remove todos os espacos em branco, incluindo tabulacoes e quebras de linha, sendo util para plataformas que nao contam espacos.
          </p>
          <p className="mb-3">
            A contagem de palavras funciona separando o texto por espacos em branco. Qualquer sequencia de caracteres separada por espacos e considerada uma palavra. Isso inclui numeros isolados, siglas e abreviacoes. A contagem de frases identifica pontos finais, pontos de exclamacao e pontos de interrogacao como delimitadores de sentencas.
          </p>
          <p className="mb-3">
            O calculo de paragrafos considera blocos de texto separados por linhas em branco (duas quebras de linha consecutivas). Essa metrica e especialmente util para redatores e escritores que precisam manter uma estrutura consistente nos seus textos.
          </p>
          <p className="mb-3">
            O tempo de leitura estimado e baseado na velocidade media de leitura de 200 palavras por minuto, que e o padrao usado pela maioria das plataformas de conteudo, incluindo Medium e blogs profissionais. Textos tecnicos ou complexos podem exigir mais tempo na pratica.
          </p>
          <p className="mb-3">
            <strong>Emojis e caracteres especiais:</strong> A contagem utiliza o metodo nativo do JavaScript (<code className="bg-gray-100 px-1 rounded text-sm">String.length</code>), que conta unidades de codigo UTF-16. Letras acentuadas (a, e, c) contam como 1 caractere. Emojis basicos (como &#x1F600;) contam como 2, pois ocupam um par surrogate em UTF-16. Emojis compostos (familias, bandeiras, tons de pele) podem contar como 4 a 11 unidades. Esse comportamento e identico ao do Twitter/X e da maioria das plataformas web.
          </p>
          <p>
            <strong>Exemplo verificavel:</strong> Digite &quot;Ola mundo&quot; e voce vera 9 caracteres (incluindo o espaco), 8 sem espacos, 2 palavras e 1 frase. Todo o processamento acontece no seu navegador — nenhum texto digitado e enviado para servidores externos.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual o limite de caracteres do Twitter/X?</summary>
              <p className="px-4 pb-4 text-gray-600">O Twitter/X permite ate 280 caracteres por tweet para contas padrao. Assinantes do X Premium (antigo Twitter Blue) podem publicar tweets com ate 25.000 caracteres. Emojis contam como 2 caracteres na maioria dos casos, e URLs sao automaticamente encurtadas para 23 caracteres independente do tamanho original.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Quantos caracteres deve ter uma meta description?</summary>
              <p className="px-4 pb-4 text-gray-600">A meta description ideal tem entre 150 e 160 caracteres. O Google exibe ate aproximadamente 155 caracteres em dispositivos desktop e 120 em dispositivos moveis. Uma meta description bem escrita e dentro do limite aumenta a taxa de cliques (CTR) nos resultados de busca, pois o usuario ve a descricao completa sem cortes.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Caracteres com acento contam como mais de um?</summary>
              <p className="px-4 pb-4 text-gray-600">Na maioria das plataformas, letras acentuadas (a, e, i, o, u, c) contam como um unico caractere, assim como no nosso contador. Porem, em sistemas que usam codificacao UTF-8 para contagem de bytes (e nao de caracteres), letras acentuadas podem ocupar 2 bytes. Para redes sociais e SEO, considere sempre a contagem por caractere, nao por byte.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Quantas palavras deve ter um artigo de blog?</summary>
              <p className="px-4 pb-4 text-gray-600">Estudos de SEO indicam que artigos com 1.500 a 2.500 palavras tendem a ranquear melhor no Google para pesquisas informacionais. Porem, o mais importante e a qualidade e a relevancia do conteudo, nao o tamanho em si. Artigos curtos e objetivos (300-800 palavras) funcionam bem para noticias, FAQs e tutoriais simples.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Emojis contam como quantos caracteres?</summary>
              <p className="px-4 pb-4 text-gray-600">A maioria dos emojis basicos conta como 2 caracteres em plataformas como o Twitter. Emojis com modificadores de tom de pele ou emojis compostos (como familias) podem contar como 4 a 7 caracteres. No nosso contador, emojis sao contados pela quantidade de unidades de codigo JavaScript, que pode variar de 1 a 7 dependendo do emoji.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre caracteres e bytes?</summary>
              <p className="px-4 pb-4 text-gray-600">Um caractere e uma unidade de texto visivel (uma letra, numero ou simbolo). Um byte e uma unidade de armazenamento de dados. Em ASCII, cada caractere ocupa 1 byte. Em UTF-8 (o padrao da web), caracteres acentuados ocupam 2 bytes e emojis podem ocupar ate 4 bytes. Para redes sociais, a contagem relevante e sempre por caracteres.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Espacos contam como caracteres no Instagram?</summary>
              <p className="px-4 pb-4 text-gray-600">Sim. No Instagram, espacos, quebras de linha e qualquer tipo de espaco em branco contam como caracteres tanto na bio (limite de 150) quanto nas legendas (limite de 2.200). Por isso, e importante otimizar o texto removendo espacos desnecessarios quando voce esta proximo do limite.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Redacao e SEO</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Title Tag otimizado:</strong> Mantenha entre 50 e 60 caracteres. Inclua a palavra-chave principal no inicio e torne o titulo atrativo para gerar cliques. Titulos cortados pelo Google prejudicam a taxa de cliques.</li>
            <li><strong>Meta description persuasiva:</strong> Use entre 150 e 155 caracteres. Inclua um resumo claro do conteudo, a palavra-chave e um convite a acao (ex: &quot;Saiba como...&quot; ou &quot;Descubra agora...&quot;).</li>
            <li><strong>Posts no Twitter/X:</strong> Tweets com 70 a 100 caracteres tendem a gerar mais engajamento do que tweets muito longos. Deixe espaco para retweets com comentario adicionando uma margem de 20 caracteres.</li>
            <li><strong>Evite repeticao de palavras:</strong> Use a ferramenta de frequencia de palavras para identificar termos que aparecem muitas vezes. Substitua por sinonimos para melhorar a leitura e evitar penalizacoes de SEO por keyword stuffing.</li>
            <li><strong>Formatacao de texto:</strong> Se alem de contar, voce precisa converter o texto para maiusculas, minusculas, Title Case ou slug, use o <a href="/conversor-texto" className="text-indigo-600 hover:underline">Conversor de Texto</a>.</li>
            <li><strong>Bio do Instagram:</strong> Com apenas 150 caracteres, cada palavra conta. Use emojis para economizar espaco, inclua uma proposta de valor clara e adicione um CTA (chamada para acao) direcionando ao link da bio.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
