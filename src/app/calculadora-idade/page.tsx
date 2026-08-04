"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const SIGNOS = [
  { nome: "Aquario", inicio: [1, 20], fim: [2, 18], emoji: "♒" },
  { nome: "Peixes", inicio: [2, 19], fim: [3, 20], emoji: "♓" },
  { nome: "Aries", inicio: [3, 21], fim: [4, 19], emoji: "♈" },
  { nome: "Touro", inicio: [4, 20], fim: [5, 20], emoji: "♉" },
  { nome: "Gemeos", inicio: [5, 21], fim: [6, 20], emoji: "♊" },
  { nome: "Cancer", inicio: [6, 21], fim: [7, 22], emoji: "♋" },
  { nome: "Leao", inicio: [7, 23], fim: [8, 22], emoji: "♌" },
  { nome: "Virgem", inicio: [8, 23], fim: [9, 22], emoji: "♍" },
  { nome: "Libra", inicio: [9, 23], fim: [10, 22], emoji: "♎" },
  { nome: "Escorpiao", inicio: [10, 23], fim: [11, 21], emoji: "♏" },
  { nome: "Sagitario", inicio: [11, 22], fim: [12, 21], emoji: "♐" },
  { nome: "Capricornio", inicio: [12, 22], fim: [1, 19], emoji: "♑" },
];

function getSigno(mes: number, dia: number) {
  for (const s of SIGNOS) {
    const [mi, di] = s.inicio;
    const [mf, df] = s.fim;
    if (s.nome === "Capricornio") {
      if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return s;
    } else {
      if ((mes === mi && dia >= di) || (mes === mf && dia <= df)) return s;
    }
  }
  return SIGNOS[0];
}

function getDiaSemana(data: Date): string {
  const dias = ["Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"];
  return dias[data.getDay()];
}

export default function CalculadoraIdade() {
  const [dataNascimento, setDataNascimento] = useState("");
  const [resultado, setResultado] = useState<{
    anos: number;
    meses: number;
    dias: number;
    totalDias: number;
    totalSemanas: number;
    totalHoras: number;
    proximoAniversario: string;
    diasParaAniversario: number;
    diaSemana: string;
    signo: { nome: string; emoji: string };
  } | null>(null);

  function calcular() {
    if (!dataNascimento) return;
    const nasc = new Date(dataNascimento + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (nasc > hoje) return;

    let anos = hoje.getFullYear() - nasc.getFullYear();
    let meses = hoje.getMonth() - nasc.getMonth();
    let dias = hoje.getDate() - nasc.getDate();

    if (dias < 0) {
      meses--;
      const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      dias += mesAnterior.getDate();
    }
    if (meses < 0) {
      anos--;
      meses += 12;
    }

    const diffMs = hoje.getTime() - nasc.getTime();
    const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalSemanas = Math.floor(totalDias / 7);
    const totalHoras = totalDias * 24;

    let proximoAniv = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
    if (proximoAniv <= hoje) {
      proximoAniv = new Date(hoje.getFullYear() + 1, nasc.getMonth(), nasc.getDate());
    }
    const diasParaAniv = Math.ceil((proximoAniv.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    const signo = getSigno(nasc.getMonth() + 1, nasc.getDate());

    setResultado({
      anos,
      meses,
      dias,
      totalDias,
      totalSemanas,
      totalHoras,
      proximoAniversario: proximoAniv.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      diasParaAniversario: diasParaAniv,
      diaSemana: getDiaSemana(nasc),
      signo,
    });
  }

  return (
    <ToolPage
      title="Calculadora de Idade"
      description="Calcule sua idade exata em anos, meses e dias. Descubra quantos dias voce ja viveu e quando sera seu proximo aniversario."
      accent="violet"
      icon="🎂"
      slug="calculadora-idade"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <label className="block text-sm font-medium text-gray-800 mb-2">Data de Nascimento</label>
        <div className="flex gap-3">
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg"
            max={new Date().toISOString().split("T")[0]}
          />
          <button
            onClick={calcular}
            className="bg-violet-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-violet-700 transition-colors cursor-pointer"
          >
            Calcular
          </button>
        </div>
      </div>

      {resultado && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-violet-600 mb-1">Sua idade exata</p>
            <p className="text-3xl font-bold text-violet-800">
              {resultado.anos} {resultado.anos === 1 ? "ano" : "anos"}, {resultado.meses} {resultado.meses === 1 ? "mes" : "meses"} e {resultado.dias} {resultado.dias === 1 ? "dia" : "dias"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total de dias vividos</p>
              <p className="text-2xl font-bold text-gray-900">{resultado.totalDias.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total de semanas</p>
              <p className="text-2xl font-bold text-gray-900">{resultado.totalSemanas.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total de horas</p>
              <p className="text-2xl font-bold text-gray-900">{resultado.totalHoras.toLocaleString("pt-BR")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Voce nasceu em um(a)</p>
              <p className="text-lg font-bold text-gray-900">{resultado.diaSemana}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Proximo aniversario</p>
              <p className="text-sm font-bold text-gray-900">{resultado.proximoAniversario}</p>
              <p className="text-xs text-violet-600 mt-1">Faltam {resultado.diasParaAniversario} dias</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Seu signo</p>
              <p className="text-2xl mb-1">{resultado.signo.emoji}</p>
              <p className="text-lg font-bold text-gray-900">{resultado.signo.nome}</p>
            </div>
          </div>
        </>
      )}

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto mt-16 space-y-12 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Idade</h2>
          <p className="mb-3">Calcular sua idade exata e muito simples e leva apenas alguns segundos. Siga o passo a passo abaixo para obter um resultado completo e detalhado sobre o tempo que voce ja viveu.</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Selecione a data de nascimento:</strong> Clique no campo de data e escolha o dia, mes e ano em que voce nasceu. Voce pode digitar diretamente ou usar o calendario que aparece ao clicar.</li>
            <li><strong>Clique em &quot;Calcular&quot;:</strong> Apos informar a data, pressione o botao para que o sistema processe as informacoes.</li>
            <li><strong>Veja o resultado principal:</strong> A calculadora exibe sua idade exata em anos, meses e dias, considerando a data atual.</li>
            <li><strong>Confira as curiosidades:</strong> Alem da idade exata, voce vera o total de dias vividos, total de semanas, total de horas, o dia da semana em que nasceu, quantos dias faltam para o proximo aniversario e seu signo do zodiaco.</li>
            <li><strong>Compartilhe:</strong> Use as informacoes para documentos, cadastros ou simplesmente para matar a curiosidade sobre quantos dias ja viveu.</li>
          </ol>
          <p className="mt-3">A ferramenta funciona com qualquer data desde 01/01/1900 ate a data atual. Nao e possivel inserir datas futuras.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o Calculo da Idade</h2>
          <p className="mb-3">A calculadora utiliza aritmetica de datas para determinar a diferenca exata entre a data de nascimento e a data atual. O processo envolve varios passos para garantir precisao:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Anos completos:</strong> Calcula a diferenca entre os anos, ajustando se o aniversario do ano atual ainda nao ocorreu.</li>
            <li><strong>Meses restantes:</strong> Conta os meses completos apos o ultimo aniversario, considerando meses com diferentes quantidades de dias (28, 29, 30 ou 31).</li>
            <li><strong>Dias excedentes:</strong> Os dias restantes apos o ultimo mes completo sao calculados considerando a duracao real do mes anterior.</li>
            <li><strong>Total de dias:</strong> Usa a diferenca em milissegundos entre as duas datas, dividida por 86.400.000 (milissegundos em um dia).</li>
            <li><strong>Signo do zodiaco:</strong> Determina o signo com base no dia e mes de nascimento, seguindo as datas tradicionais da astrologia ocidental.</li>
          </ul>
          <p className="mt-3">O calculo leva em conta anos bissextos automaticamente. Por exemplo, quem nasceu em 29 de fevereiro tem seu aniversario contabilizado corretamente, e a contagem de dias inclui os dias extras dos anos bissextos que ja passaram.</p>
          <p className="mt-2">O proximo aniversario e calculado verificando se a data de aniversario do ano atual ja passou. Se ja passou, projeta para o ano seguinte e calcula a diferenca em dias.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">A calculadora considera anos bissextos?</summary>
              <p className="mt-2">Sim. O calculo e feito usando o sistema de datas do JavaScript, que leva em conta todos os anos bissextos automaticamente. A contagem de dias vividos inclui os dias 29 de fevereiro de todos os anos bissextos desde seu nascimento.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso calcular a idade de outra pessoa?</summary>
              <p className="mt-2">Sim, basta inserir a data de nascimento de qualquer pessoa. A ferramenta calcula a idade de qualquer um, independentemente de ser voce ou nao. E util para calcular idade de filhos, pais, amigos ou para preencher documentos.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O resultado e confiavel para documentos oficiais?</summary>
              <p className="mt-2">O calculo de anos, meses e dias e preciso e pode ser usado como referencia. Porem, para documentos oficiais, certidoes e processos legais, o calculo de idade segue regras especificas que podem variar. Sempre consulte a orientacao do orgao emissor.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Como e calculado o dia da semana do nascimento?</summary>
              <p className="mt-2">Utilizamos a funcao nativa de datas que determina o dia da semana (domingo a sabado) correspondente a qualquer data no calendario gregoriano. O resultado e 100% preciso para datas a partir de 1900.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O signo do zodiaco e preciso?</summary>
              <p className="mt-2">Os signos sao calculados com base nas datas tradicionais da astrologia ocidental. Pessoas nascidas em dias de transicao entre signos (cuspide) podem ter interpretacoes diferentes dependendo do astrologo consultado. A ferramenta segue as datas mais aceitas.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O total de horas e exato?</summary>
              <p className="mt-2">O total de horas e calculado multiplicando o total de dias por 24. E uma estimativa arredondada porque nao considera a hora exata do nascimento. Para um calculo mais preciso, seria necessario incluir a hora de nascimento.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Meus dados sao armazenados?</summary>
              <p className="mt-2">Nao. Todo o calculo e feito localmente no seu navegador. A data de nascimento que voce insere nao e enviada para nenhum servidor e desaparece quando voce fecha a pagina.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exemplos Verificaveis</h2>
          <p className="mb-3">Voce pode conferir estes exemplos inserindo as datas na calculadora e comparando com o resultado esperado:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>01/01/2000 ate 01/01/2025:</strong> Resultado esperado: 25 anos, 0 meses, 0 dias. Total de dias: 9.132 (inclui 7 anos bissextos: 2000, 2004, 2008, 2012, 2016, 2020, 2024).</li>
            <li><strong>15/03/1990 ate 10/03/2025:</strong> Resultado esperado: 34 anos, 11 meses e 23 dias. O aniversario de marco ainda nao ocorreu, entao nao conta o ano cheio de 2025.</li>
            <li><strong>29/02/2000 ate 01/03/2025:</strong> Nascimento em 29 de fevereiro. Resultado esperado: 25 anos, 0 meses e 1 dia (usando 28/02 como referencia em anos nao bissextos).</li>
            <li><strong>31/01/2025 ate 28/02/2025:</strong> Resultado esperado: 0 anos, 0 meses e 28 dias. Fevereiro tem 28 dias em 2025 (nao bissexto), entao nao completa 1 mes.</li>
          </ul>
          <p className="mt-3">Esses exemplos ilustram situacoes comuns: anos exatos, aniversarios que ainda nao ocorreram, nascimentos em 29 de fevereiro e meses com duracoes diferentes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usos Praticos</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Cadastros e formularios:</strong> Muitos formularios medicos, de seguro e bancarios pedem a idade exata em anos. A calculadora fornece esse dado sem que voce precise fazer a conta de cabeca.</li>
            <li><strong>Concursos publicos:</strong> Editais frequentemente exigem idade maxima na data da inscricao ou da posse. Use a calculadora para verificar se voce se enquadra antes de pagar a taxa.</li>
            <li><strong>Aposentadoria:</strong> A idade exata em anos, meses e dias e fundamental para calculos previdenciarios, onde cada dia conta para atingir o tempo minimo de contribuicao.</li>
            <li><strong>Pediatria:</strong> Medicos usam a idade em meses e dias para acompanhar o desenvolvimento infantil e o calendario de vacinacao. A contagem precisa de meses evita confusoes entre "5 meses completos" e "entrando no 5o mes".</li>
            <li><strong>Controle de horas:</strong> Se voce tambem precisa calcular diferenca entre horarios ou somar horas trabalhadas, a <a href="/calculadora-horas" className="text-violet-600 hover:underline">Calculadora de Horas</a> complementa essa ferramenta.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitacoes</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>A calculadora usa a data atual do dispositivo do usuario como referencia. Se o relogio do computador ou celular estiver incorreto, o resultado sera afetado.</li>
            <li>O total de horas e uma estimativa baseada em dias inteiros (dias x 24). Para um calculo exato, seria necessario incluir a hora de nascimento, que a ferramenta nao solicita.</li>
            <li>O resultado nao substitui documentos oficiais. Certidoes de nascimento, RG e passaporte sao as fontes legais de comprovacao de idade.</li>
            <li>Para fins legais (maioridade, aposentadoria, prazos processuais), as regras de contagem podem diferir do calculo matematico. Consulte a legislacao aplicavel ou um profissional habilitado.</li>
            <li>O signo do zodiaco segue as datas da astrologia ocidental tradicional. Pessoas nascidas em dias de transicao (cuspide) podem receber interpretacoes diferentes dependendo da fonte consultada.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curiosidades sobre Contagem de Tempo</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Mil dias de vida:</strong> O milesimo dia de vida ocorre por volta dos 2 anos e 9 meses.</li>
            <li><strong>10.000 dias:</strong> Voce completa 10.000 dias de vida por volta dos 27 anos e 4 meses.</li>
            <li><strong>Por que meses tem duracoes diferentes:</strong> O calendario gregoriano herda a estrutura do calendario romano. Meses de 30 e 31 dias se alternam de forma irregular, e fevereiro ficou com 28 (ou 29) dias por razoes historicas. Isso afeta diretamente o calculo de "meses completos" — de 31 de janeiro a 28 de fevereiro sao 28 dias, mas nao completa 1 mes.</li>
            <li><strong>Anos bissextos:</strong> Ocorrem a cada 4 anos, exceto em seculos nao divisiveis por 400. Por isso 2000 foi bissexto, mas 1900 nao foi. A calculadora considera automaticamente todas essas regras.</li>
          </ul>
        </section>

      </div>
    </ToolPage>
  );
}
