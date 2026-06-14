"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

interface Registro {
  id: number;
  entrada: string;
  saida: string;
}

function parseMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHoras(minutos: number): string {
  const negativo = minutos < 0;
  const abs = Math.abs(minutos);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${negativo ? "-" : ""}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function CalculadoraHoras() {
  const [registros, setRegistros] = useState<Registro[]>([
    { id: 1, entrada: "08:00", saida: "12:00" },
    { id: 2, entrada: "13:00", saida: "17:00" },
  ]);
  const [horaExtra, setHoraExtra] = useState("08:00");
  const [nextId, setNextId] = useState(3);

  const adicionarRegistro = () => {
    setRegistros([...registros, { id: nextId, entrada: "", saida: "" }]);
    setNextId(nextId + 1);
  };

  const removerRegistro = (id: number) => {
    setRegistros(registros.filter((r) => r.id !== id));
  };

  const atualizarRegistro = (id: number, campo: "entrada" | "saida", valor: string) => {
    setRegistros(registros.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  };

  const calculos = registros.map((r) => {
    if (!r.entrada || !r.saida) return { ...r, minutos: 0 };
    let diff = parseMinutos(r.saida) - parseMinutos(r.entrada);
    if (diff < 0) diff += 1440; // virada de dia
    return { ...r, minutos: diff };
  });

  const totalMinutos = calculos.reduce((acc, r) => acc + r.minutos, 0);
  const jornadaMinutos = parseMinutos(horaExtra);
  const saldoMinutos = totalMinutos - jornadaMinutos;

  return (
    <ToolPage
      title="Calculadora de Horas"
      description="Some horas trabalhadas, calcule banco de horas e diferenca entre horarios. Ideal para controle de ponto."
      accent="amber"
      icon="🕐"
      slug="calculadora-horas"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Registros de Horario</h2>

        <div className="space-y-3 mb-4">
          {registros.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-500 w-20">Periodo {i + 1}</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={r.entrada}
                  onChange={(e) => atualizarRegistro(r.id, "entrada", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-gray-400">ate</span>
                <input
                  type="time"
                  value={r.saida}
                  onChange={(e) => atualizarRegistro(r.id, "saida", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <span className="text-sm font-mono font-medium text-gray-700 w-16 text-right">
                {formatHoras(calculos.find((c) => c.id === r.id)?.minutos || 0)}
              </span>
              {registros.length > 1 && (
                <button onClick={() => removerRegistro(r.id)} className="text-red-400 hover:text-red-600 cursor-pointer">✕</button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={adicionarRegistro}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-500 hover:border-amber-400 hover:text-amber-600 cursor-pointer"
        >
          + Adicionar periodo
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-600 mb-1">Total Trabalhado</p>
          <p className="text-2xl font-bold text-amber-800">{formatHoras(totalMinutos)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Jornada Diaria</p>
          <input
            type="time"
            value={horaExtra}
            onChange={(e) => setHoraExtra(e.target.value)}
            className="text-xl font-bold text-center text-gray-900 border-0 focus:outline-none w-full bg-transparent"
          />
        </div>
        <div className={`rounded-xl p-4 text-center border ${saldoMinutos >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-xs mb-1 ${saldoMinutos >= 0 ? "text-green-600" : "text-red-600"}`}>
            {saldoMinutos >= 0 ? "Horas Extras" : "Horas Devendo"}
          </p>
          <p className={`text-2xl font-bold ${saldoMinutos >= 0 ? "text-green-800" : "text-red-800"}`}>
            {formatHoras(saldoMinutos)}
          </p>
        </div>
      </div>

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Horas</h2>
          <p className="mb-3">
            A calculadora de horas foi projetada para ser intuitiva e rapida. Siga os passos abaixo para calcular suas horas trabalhadas com precisao:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Preencha os horarios de entrada e saida</strong> de cada periodo de trabalho. Por padrao, a ferramenta ja vem com dois periodos preenchidos (manha e tarde), simulando uma jornada tipica de 8 horas.</li>
            <li><strong>Adicione mais periodos</strong> clicando em &quot;+ Adicionar periodo&quot;. Isso e util para quem faz hora extra, trabalha em turnos quebrados ou precisa registrar pausas adicionais.</li>
            <li><strong>Remova periodos desnecessarios</strong> clicando no botao X ao lado de cada registro. A ferramenta exige pelo menos um periodo ativo.</li>
            <li><strong>Ajuste a jornada diaria</strong> no campo &quot;Jornada Diaria&quot;. O padrao e 08:00, mas voce pode alterar para 06:00, 07:20, 08:48 ou qualquer duracao que corresponda ao seu contrato de trabalho.</li>
            <li><strong>Confira o resultado</strong> nos cards de resumo: Total Trabalhado mostra a soma de todos os periodos, e o card de Horas Extras ou Horas Devendo mostra o saldo comparado com a jornada definida.</li>
          </ol>
          <p className="mt-3">
            A calculadora detecta automaticamente viradas de dia. Se voce registrar entrada as 22:00 e saida as 06:00, ela calcula corretamente 8 horas de trabalho noturno.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo</h2>
          <p className="mb-3">
            O calculo de horas trabalhadas segue uma logica matematica simples, mas que pode gerar confusao quando feito manualmente. Veja como a ferramenta processa cada etapa:
          </p>
          <p className="mb-3">
            <strong>Conversao para minutos:</strong> Cada horario e convertido em minutos totais desde a meia-noite. Por exemplo, 08:30 equivale a 510 minutos (8 x 60 + 30). Isso simplifica as operacoes de subtracao e soma.
          </p>
          <p className="mb-3">
            <strong>Calculo da diferenca:</strong> Para cada periodo, a ferramenta subtrai o horario de entrada do horario de saida. Se a entrada e 08:00 (480 min) e a saida e 12:00 (720 min), o resultado e 240 minutos, ou seja, 4 horas.
          </p>
          <p className="mb-3">
            <strong>Tratamento de virada de dia:</strong> Quando o horario de saida e menor que o de entrada (por exemplo, entrada 22:00 e saida 06:00), a ferramenta adiciona 1440 minutos (24 horas) ao calculo. Isso garante que turnos noturnos sejam calculados corretamente.
          </p>
          <p className="mb-3">
            <strong>Soma total:</strong> Todos os periodos sao somados em minutos e depois convertidos de volta para o formato HH:MM. O saldo e calculado subtraindo a jornada diaria configurada do total trabalhado.
          </p>
          <p>
            <strong>Formula resumida:</strong> Total = Soma(Saida - Entrada) para cada periodo. Saldo = Total - Jornada. Resultado positivo indica horas extras; negativo indica horas a compensar.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Como calcular banco de horas com esta ferramenta?</summary>
              <p className="mt-2">Preencha seus horarios reais de entrada e saida de cada periodo do dia. A ferramenta compara automaticamente o total trabalhado com a jornada diaria definida. Se voce trabalhou 09:15 em um dia de jornada de 08:00, o saldo mostrara +01:15 de horas extras. Para controle mensal, anote o saldo de cada dia e some os resultados.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">A calculadora funciona para turnos noturnos?</summary>
              <p className="mt-2">Sim. A ferramenta detecta automaticamente quando o horario de saida e anterior ao de entrada, indicando virada de dia. Por exemplo, se voce entrou as 22:00 e saiu as 06:00, o calculo retornara corretamente 08:00 horas trabalhadas. Isso funciona para qualquer combinacao de horarios.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Como incluir o horario de almoco no calculo?</summary>
              <p className="mt-2">Basta criar dois periodos separados: um para a manha (ex: 08:00 a 12:00) e outro para a tarde (ex: 13:00 a 17:00). O intervalo de almoco entre 12:00 e 13:00 nao sera contabilizado. Voce tambem pode adicionar mais periodos se tiver pausas adicionais durante o dia.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Qual jornada diaria devo configurar?</summary>
              <p className="mt-2">A jornada depende do seu contrato de trabalho. No Brasil, a CLT estabelece o maximo de 44 horas semanais. As configuracoes mais comuns sao: 08:00 para quem trabalha de segunda a sexta; 07:20 para quem trabalha de segunda a sabado; 06:00 para jornadas reduzidas ou escalas 12x36. Consulte seu contrato ou RH para confirmar.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Posso usar para calcular horas de freelancer?</summary>
              <p className="mt-2">Com certeza. Freelancers podem usar a ferramenta para registrar o tempo dedicado a cada projeto durante o dia. Basta configurar a jornada diaria como 00:00 para que o card de resumo mostre apenas o total de horas trabalhadas, sem comparar com uma jornada fixa. Anote os totais diarios para calcular o valor a cobrar do cliente.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-gray-900">Os dados ficam salvos?</summary>
              <p className="mt-2">Nao. A calculadora funciona inteiramente no seu navegador e nao salva nenhum dado. Ao fechar ou recarregar a pagina, os registros voltam ao padrao. Para manter um historico, recomendamos anotar os resultados em uma planilha ou caderno de ponto.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Controle de Ponto</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Registre seus horarios diariamente.</strong> Nao confie na memoria ao final da semana. Preencha a calculadora no final de cada dia de trabalho para garantir a precisao dos registros.</li>
            <li><strong>Considere o tempo de deslocamento interno.</strong> Se voce precisa passar por um controle de acesso e caminhar ate sua estacao de trabalho, o ponto deve ser registrado na entrada do estabelecimento, conforme a CLT.</li>
            <li><strong>Atencao com minutos quebrados.</strong> Muitas empresas arredondam os minutos em blocos de 5 ou 10. A calculadora mostra o valor exato — verifique qual regra sua empresa aplica.</li>
            <li><strong>Horas extras acima de 2 horas diarias precisam de acordo.</strong> A CLT limita as horas extras a 2 horas por dia, exceto em casos especiais previstos em acordo coletivo. Use o saldo da calculadora para monitorar se voce esta dentro do limite.</li>
            <li><strong>Guarde seus registros por pelo menos 5 anos.</strong> Em caso de disputas trabalhistas, os registros de ponto sao documentos importantes. Exporte seus dados para uma planilha e mantenha um backup seguro.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
