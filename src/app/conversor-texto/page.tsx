"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

function removerAcentos(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function toSentenceCase(str: string): string {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toAlternateCase(str: string): string {
  return str.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
}

function toSlug(str: string): string {
  return removerAcentos(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function inverter(str: string): string {
  return str.split("").reverse().join("");
}

const CONVERSOES = [
  { nome: "MAIUSCULAS", fn: (s: string) => s.toUpperCase(), desc: "ABC" },
  { nome: "minusculas", fn: (s: string) => s.toLowerCase(), desc: "abc" },
  { nome: "Titulo", fn: toTitleCase, desc: "Abc Def" },
  { nome: "Frase", fn: toSentenceCase, desc: "Abc def." },
  { nome: "aLtErNaDo", fn: toAlternateCase, desc: "aBcDeF" },
  { nome: "Sem Acentos", fn: removerAcentos, desc: "a e i o u" },
  { nome: "slug-url", fn: toSlug, desc: "texto-para-url" },
  { nome: "oditrevnI", fn: inverter, desc: "cba" },
];

export default function ConversorTexto() {
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState("");

  const copiar = async (t: string, label: string) => {
    await navigator.clipboard.writeText(t);
    setCopiado(label);
    setTimeout(() => setCopiado(""), 1500);
  };

  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const caracteres = texto.length;
  const frases = texto.trim() ? texto.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const linhas = texto.trim() ? texto.split("\n").length : 0;

  return (
    <ToolPage
      title="Conversor de Texto"
      description="Converta textos para maiusculas, minusculas, titulo, slug e mais. Remova acentos e copie com um clique."
      accent="sky"
      icon="🔤"
      slug="conversor-texto"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">Digite ou cole seu texto</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole ou digite seu texto aqui..."
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-y"
        />
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>{caracteres} caracteres</span>
          <span>{palavras} palavras</span>
          <span>{frases} frases</span>
          <span>{linhas} linhas</span>
        </div>
      </div>

      {texto.trim() && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {CONVERSOES.map((conv) => {
            const resultado = conv.fn(texto);
            return (
              <div key={conv.nome} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{conv.desc}</span>
                    <h3 className="font-medium text-sm text-gray-900">{conv.nome}</h3>
                  </div>
                  <button
                    onClick={() => copiar(resultado, conv.nome)}
                    className="text-sky-600 text-xs hover:underline cursor-pointer"
                  >
                    {copiado === conv.nome ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-800 font-mono break-all max-h-24 overflow-y-auto">
                  {resultado}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">Acoes Rapidas</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTexto(texto.toUpperCase())}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            Aplicar MAIUSCULAS
          </button>
          <button
            onClick={() => setTexto(texto.toLowerCase())}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            Aplicar minusculas
          </button>
          <button
            onClick={() => setTexto(removerAcentos(texto))}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            Remover Acentos
          </button>
          <button
            onClick={() => setTexto("")}
            className="bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm hover:bg-red-100 cursor-pointer"
          >
            Limpar
          </button>
        </div>
      </div>

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Conversor de Texto</h2>
          <p className="mb-3">
            Utilizar o conversor de texto e simples e rapido. Siga o passo a passo abaixo para transformar qualquer texto no formato desejado em segundos:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Cole ou digite seu texto</strong> no campo principal no topo da pagina. Voce pode colar textos longos, paragrafos inteiros ou ate listas completas.</li>
            <li><strong>Visualize os resultados automaticamente.</strong> Assim que voce digita, o conversor mostra instantaneamente o resultado em todos os formatos disponiveis: MAIUSCULAS, minusculas, Titulo, Frase, aLtErNaDo, Sem Acentos, slug-url e Invertido.</li>
            <li><strong>Copie o resultado desejado</strong> clicando no botao &quot;Copiar&quot; ao lado de cada formato. O texto sera copiado para sua area de transferencia, pronto para colar em qualquer lugar.</li>
            <li><strong>Use as Acoes Rapidas</strong> para aplicar uma transformacao diretamente no texto original. Por exemplo, clique em &quot;Aplicar MAIUSCULAS&quot; para converter o texto de entrada permanentemente.</li>
            <li><strong>Acompanhe as estatisticas</strong> do seu texto na barra inferior: contagem de caracteres, palavras, frases e linhas atualizada em tempo real.</li>
          </ol>
          <p className="mt-3">
            A ferramenta funciona 100% no seu navegador, sem enviar dados para nenhum servidor. Seu texto permanece privado e seguro.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona Cada Conversao</h2>
          <p className="mb-3">
            Cada tipo de conversao aplica uma regra diferente ao seu texto. Entender como cada uma funciona ajuda a escolher a opcao certa para cada situacao:
          </p>
          <ul className="space-y-3 ml-2">
            <li><strong>MAIUSCULAS (toUpperCase):</strong> Converte todas as letras para maiusculas. Ideal para titulos de destaque, siglas, ou quando voce precisa de enfase visual. O algoritmo percorre cada caractere e aplica a conversao Unicode correspondente.</li>
            <li><strong>minusculas (toLowerCase):</strong> Converte tudo para letras minusculas. Usado frequentemente para padronizar dados em bancos de dados, comparacoes de texto e normalizacao de emails.</li>
            <li><strong>Titulo (Title Case):</strong> Coloca a primeira letra de cada palavra em maiuscula e o restante em minuscula. Perfeito para nomes proprios, titulos de artigos e cabecalhos de documentos.</li>
            <li><strong>Frase (Sentence Case):</strong> Apenas a primeira letra de cada frase fica maiuscula. A ferramenta detecta pontos finais, exclamacoes e interrogacoes para identificar onde cada frase comeca.</li>
            <li><strong>aLtErNaDo:</strong> Alterna entre minusculas e maiusculas a cada caractere. Popularizado em memes e comunicacao informal na internet para expressar sarcasmo ou humor.</li>
            <li><strong>Sem Acentos:</strong> Remove todos os acentos e diacriticos utilizando normalizacao Unicode (NFD). O texto &quot;acai&quot; vira &quot;acai&quot;, &quot;voce&quot; vira &quot;voce&quot;. Essencial para sistemas que nao suportam caracteres especiais.</li>
            <li><strong>slug-url:</strong> Transforma o texto em um formato valido para URLs. Remove acentos, converte para minusculas, substitui espacos por hifens e elimina caracteres especiais. Indispensavel para desenvolvedores web criarem URLs amigaveis.</li>
            <li><strong>Invertido:</strong> Inverte a ordem de todos os caracteres do texto. O algoritmo separa o texto em um array de caracteres e os reorganiza em ordem reversa.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Como converter texto de maiusculas para minusculas?</summary>
              <p className="mt-2">Cole o texto em maiusculas no campo de entrada. O resultado em minusculas aparecera automaticamente no card &quot;minusculas&quot;. Clique em &quot;Copiar&quot; para copiar o resultado, ou use o botao &quot;Aplicar minusculas&quot; nas Acoes Rapidas para converter o texto original diretamente.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">A ferramenta funciona com textos em portugues com acentos?</summary>
              <p className="mt-2">Sim. Todas as conversoes funcionam perfeitamente com caracteres acentuados do portugues brasileiro. A opcao &quot;Sem Acentos&quot; foi criada especificamente para remover acentos de textos em portugues, convertendo caracteres como a, e, i, o, u, c para suas versoes sem acento.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">O que e um slug e para que serve?</summary>
              <p className="mt-2">Um slug e a versao amigavel de um texto para uso em URLs. Por exemplo, o titulo &quot;Receita de Bolo de Chocolate&quot; vira &quot;receita-de-bolo-de-chocolate&quot;. Slugs sao essenciais para SEO, pois URLs legiveis ajudam os mecanismos de busca a entenderem o conteudo da pagina e melhoram a experiencia do usuario.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Meus dados ficam salvos em algum lugar?</summary>
              <p className="mt-2">Nao. Todo o processamento acontece localmente no seu navegador usando JavaScript puro. Nenhum texto e enviado para servidores externos. Quando voce fecha a pagina, tudo e apagado automaticamente. A ferramenta e completamente segura para textos confidenciais.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Existe limite de tamanho para o texto?</summary>
              <p className="mt-2">Nao existe um limite fixo imposto pela ferramenta. Como o processamento e feito no seu navegador, o limite depende da memoria disponivel no seu dispositivo. Na pratica, textos de ate centenas de milhares de caracteres sao processados sem problemas na maioria dos computadores e celulares modernos.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Qual a diferenca entre Title Case e Sentence Case?</summary>
              <p className="mt-2">No Title Case (Titulo), a primeira letra de cada palavra fica maiuscula: &quot;O Gato Sentou No Tapete&quot;. No Sentence Case (Frase), apenas a primeira letra de cada frase fica maiuscula: &quot;O gato sentou no tapete.&quot; Use Title Case para titulos e cabecalhos, e Sentence Case para textos corridos e paragrafos normais.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas e Exemplos do Dia a Dia</h2>
          <p className="mb-3">Veja situacoes reais onde o conversor de texto economiza tempo e evita erros:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Desenvolvedores web:</strong> Use a conversao para slug ao criar URLs para blogs, e-commerces e landing pages. Um titulo como &quot;Promocao de Verao 2025&quot; vira instantaneamente &quot;promocao-de-verao-2025&quot;.</li>
            <li><strong>Profissionais de marketing:</strong> Padronize listas de emails removendo acentos e convertendo para minusculas antes de importar em plataformas de email marketing que nao aceitam caracteres especiais.</li>
            <li><strong>Redatores e editores:</strong> Converta rapidamente titulos para Title Case seguindo padroes editoriais. Transforme textos recebidos em MAIUSCULAS para um formato legivel sem precisar redigitar.</li>
            <li><strong>Estudantes:</strong> Use o contador de palavras e caracteres para verificar se seu texto atende aos limites de trabalhos academicos e redacoes.</li>
            <li><strong>Redes sociais:</strong> Crie textos com estilo alternado para postagens humoristicas ou use a inversao de texto para brincadeiras e desafios criativos.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum a evitar:</strong> Ao remover acentos para sistemas tecnicos, lembre-se de que a remocao de acentos pode alterar o significado de palavras em portugues. &quot;Avos&quot; e &quot;avos&quot; sao palavras diferentes, por exemplo. Use essa funcao apenas quando o destino final realmente nao suporta acentos.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
