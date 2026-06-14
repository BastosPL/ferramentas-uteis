"use client";

import { useState, useRef, useCallback } from "react";
import ToolPage from "../components/ToolPage";

export default function Cronometro() {
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [voltas, setVoltas] = useState<number[]>([]);
  const [modo, setModo] = useState<"progressivo" | "regressivo">("progressivo");
  const [tempoInicial, setTempoInicial] = useState(300);
  const [tempoRegressivo, setTempoRegressivo] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatarTempo = (ms: number) => {
    const totalSeg = Math.abs(Math.floor(ms / 1000));
    const h = Math.floor(totalSeg / 3600);
    const m = Math.floor((totalSeg % 3600) / 60);
    const s = totalSeg % 60;
    const centesimos = Math.floor((Math.abs(ms) % 1000) / 10);
    if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${centesimos.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${centesimos.toString().padStart(2, "0")}`;
  };

  const iniciar = useCallback(() => {
    if (rodando) return;
    setRodando(true);
    const inicio = Date.now() - (modo === "progressivo" ? tempo : 0);
    intervalRef.current = setInterval(() => {
      if (modo === "progressivo") {
        setTempo(Date.now() - inicio);
      } else {
        setTempoRegressivo((prev) => {
          const novo = prev - 0.01;
          if (novo <= 0) {
            clearInterval(intervalRef.current!);
            setRodando(false);
            return 0;
          }
          return novo;
        });
      }
    }, 10);
  }, [rodando, modo, tempo]);

  const pausar = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRodando(false);
  };

  const resetar = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRodando(false);
    setTempo(0);
    setTempoRegressivo(tempoInicial);
    setVoltas([]);
  };

  const marcarVolta = () => {
    if (modo === "progressivo") setVoltas((prev) => [tempo, ...prev]);
  };

  const tempoExibido = modo === "progressivo" ? tempo : tempoRegressivo * 1000;

  return (
    <ToolPage title="Cronometro Online" description="Cronometro preciso com contagem progressiva e regressiva. Funcao de voltas para marcar tempos parciais." accent="amber" icon="⏱️" slug="cronometro">

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { resetar(); setModo("progressivo"); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${modo === "progressivo" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Cronometro
        </button>
        <button
          onClick={() => { resetar(); setModo("regressivo"); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${modo === "regressivo" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Timer (Regressivo)
        </button>
      </div>

      {modo === "regressivo" && !rodando && tempoRegressivo === tempoInicial && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-800">Definir tempo (segundos)</label>
          <div className="flex gap-2">
            {[60, 120, 300, 600, 900, 1800].map((s) => (
              <button
                key={s}
                onClick={() => { setTempoInicial(s); setTempoRegressivo(s); }}
                className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${tempoInicial === s ? "bg-amber-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {s >= 60 ? `${s / 60}min` : `${s}s`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
        <div className="text-7xl font-mono font-bold mb-8 tabular-nums">
          {formatarTempo(tempoExibido)}
        </div>
        <div className="flex justify-center gap-3">
          {!rodando ? (
            <button onClick={iniciar} className="bg-green-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-green-700 transition-colors cursor-pointer">
              Iniciar
            </button>
          ) : (
            <button onClick={pausar} className="bg-yellow-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-yellow-600 transition-colors cursor-pointer">
              Pausar
            </button>
          )}
          {modo === "progressivo" && rodando && (
            <button onClick={marcarVolta} className="bg-amber-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-amber-600 transition-colors cursor-pointer">
              Volta
            </button>
          )}
          <button onClick={resetar} className="bg-red-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-red-700 transition-colors cursor-pointer">
            Resetar
          </button>
        </div>
      </div>

      {voltas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Voltas</h2>
          <div className="space-y-2">
            {voltas.map((v, i) => (
              <div key={i} className="flex justify-between bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-500">Volta {voltas.length - i}</span>
                <span className="font-mono font-medium">{formatarTempo(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Cronometro Online</h2>
          <p className="mb-3">
            Usar nosso cronometro online e simples e intuitivo. Veja o passo a passo completo para aproveitar todos os recursos disponiveis:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Escolha o modo:</strong> No topo da ferramenta, selecione entre &quot;Cronometro&quot; (contagem progressiva) ou &quot;Timer (Regressivo)&quot; para contagem decrescente. Cada modo atende a necessidades diferentes.</li>
            <li><strong>No modo Cronometro:</strong> Clique em &quot;Iniciar&quot; para comecar a contagem a partir de zero. O tempo sera exibido em minutos, segundos e centesimos de segundo. Para registrar tempos parciais, clique em &quot;Volta&quot; durante a execucao — o tempo da volta sera salvo em uma lista abaixo.</li>
            <li><strong>No modo Timer:</strong> Antes de iniciar, selecione o tempo desejado entre as opcoes predefinidas (1 min, 2 min, 5 min, 10 min, 15 min ou 30 min). Depois clique em &quot;Iniciar&quot; e a contagem regressiva comecara automaticamente. Quando chegar a zero, o timer para sozinho.</li>
            <li><strong>Pausar e retomar:</strong> A qualquer momento, clique em &quot;Pausar&quot; para congelar o tempo. Clique novamente em &quot;Iniciar&quot; para continuar de onde parou.</li>
            <li><strong>Resetar:</strong> Clique em &quot;Resetar&quot; para zerar o cronometro e comecar do inicio. No modo regressivo, o timer volta ao tempo selecionado.</li>
          </ul>
          <p className="mt-3">
            O cronometro funciona diretamente no navegador, sem necessidade de instalar nenhum aplicativo. Basta manter a aba aberta para que a contagem continue.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Precisao do Cronometro</h2>
          <p className="mb-3">
            Nosso cronometro utiliza a funcao <code className="bg-gray-100 px-1 rounded text-sm">Date.now()</code> do JavaScript, que retorna o tempo em milissegundos com base no relogio do sistema operacional. Isso garante uma precisao real de centesimos de segundo, suficiente para a maioria das aplicacoes praticas.
          </p>
          <p className="mb-3">
            A atualizacao visual da tela acontece a cada 10 milissegundos (100 vezes por segundo), o que proporciona uma experiencia fluida e responsiva. O calculo do tempo decorrido e feito pela diferenca entre o momento atual e o momento em que o cronometro foi iniciado, eliminando possiveis desvios causados por atrasos no intervalo de atualizacao.
          </p>
          <p className="mb-3">
            No modo regressivo, o sistema decrementa o tempo restante a cada ciclo de atualizacao. Quando o valor atinge zero, o intervalo e automaticamente encerrado e o cronometro para, garantindo que nao haja contagem negativa.
          </p>
          <p>
            A funcao de voltas registra o tempo exato no momento em que o botao e pressionado, armazenando cada marca em uma lista ordenada da mais recente para a mais antiga. Isso permite analisar tempos parciais de forma clara e organizada.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O cronometro continua rodando se eu mudar de aba?</summary>
              <p className="px-4 pb-3 text-sm">Sim. O cronometro utiliza o relogio do sistema para calcular o tempo decorrido, entao mesmo que voce mude de aba ou minimize o navegador, ao retornar o tempo exibido estara correto. Porem, a atualizacao visual pode ser pausada pelo navegador em abas em segundo plano, mas o tempo real nao e afetado.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso usar o cronometro no celular?</summary>
              <p className="px-4 pb-3 text-sm">Sim, o cronometro e totalmente responsivo e funciona em qualquer dispositivo com navegador: smartphones, tablets e computadores. Basta acessar a pagina e usar normalmente. Nao precisa instalar nenhum aplicativo.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a precisao do cronometro?</summary>
              <p className="px-4 pb-3 text-sm">O cronometro tem precisao de centesimos de segundo (10 milissegundos). Embora nao seja adequado para competicoes oficiais que exigem precisao de milesimos, e mais que suficiente para treinos, estudos, culinaria e uso geral do dia a dia.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como funciona a marcacao de voltas?</summary>
              <p className="px-4 pb-3 text-sm">No modo Cronometro (progressivo), o botao &quot;Volta&quot; aparece durante a execucao. Cada vez que voce clica, o tempo atual e registrado em uma lista. Isso e util para marcar tempos parciais em treinos de corrida, natacao ou qualquer atividade com etapas. As voltas aparecem da mais recente para a mais antiga.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O timer emite som quando chega a zero?</summary>
              <p className="px-4 pb-3 text-sm">Na versao atual, o timer para automaticamente quando atinge zero, mas nao emite alerta sonoro. Recomendamos manter a tela visivel para acompanhar o final da contagem. Futuras atualizacoes podem incluir notificacoes sonoras.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso definir um tempo personalizado no Timer?</summary>
              <p className="px-4 pb-3 text-sm">Atualmente, o timer oferece opcoes predefinidas de 1, 2, 5, 10, 15 e 30 minutos. Essas opcoes cobrem a maioria dos usos comuns como culinaria, exercicios intervalados e tecnicas de estudo como Pomodoro.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O cronometro funciona sem internet?</summary>
              <p className="px-4 pb-3 text-sm">Depois que a pagina estiver carregada, o cronometro funciona completamente offline. Todo o processamento acontece no seu navegador, sem enviar dados para nenhum servidor. Basta nao fechar a aba.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas e Exemplos do Dia a Dia</h2>
          <p className="mb-3">
            O cronometro online e uma ferramenta versatil com diversas aplicacoes praticas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Tecnica Pomodoro:</strong> Use o timer de 25 minutos (selecione o mais proximo ou use 30 min) para sessoes de estudo focado, seguidas de pausas de 5 minutos. Essa tecnica e comprovada para aumentar a produtividade.</li>
            <li><strong>Treinos fisicos:</strong> Cronometre series de exercicios, descansos entre sets ou o tempo total de treino. A funcao de voltas e perfeita para registrar tempos de cada serie.</li>
            <li><strong>Culinaria:</strong> Use o timer regressivo para controlar o tempo de cozimento de alimentos. Selecione o tempo necessario e acompanhe sem precisar olhar o relogio.</li>
            <li><strong>Provas e simulados:</strong> Cronometre quanto tempo leva para responder questoes. Isso ajuda a melhorar o gerenciamento de tempo em vestibulares e concursos.</li>
            <li><strong>Jogos e desafios:</strong> Cronometre desafios em grupo, jogos de tabuleiro com tempo limitado ou competicoes de velocidade entre amigos.</li>
            <li><strong>Produtividade no trabalho:</strong> Mensure quanto tempo cada tarefa leva. Conhecer o tempo real das atividades ajuda a planejar melhor o dia e identificar gargalos.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Muitas pessoas fecham a aba do navegador acidentalmente durante a contagem. Lembre-se de que fechar a aba encerra o cronometro permanentemente — o tempo nao e salvo. Mantenha a aba aberta durante o uso.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
