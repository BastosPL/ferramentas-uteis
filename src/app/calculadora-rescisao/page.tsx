"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type TipoDemissao = "sem_justa_causa" | "pedido_demissao" | "acordo_mutuo";

const tiposLabel: Record<TipoDemissao, string> = {
  sem_justa_causa: "Demissao sem justa causa",
  pedido_demissao: "Pedido de demissao",
  acordo_mutuo: "Acordo mutuo (reforma trabalhista)",
};

export default function CalculadoraRescisao() {
  const [salario, setSalario] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDemissao, setDataDemissao] = useState("");
  const [tipo, setTipo] = useState<TipoDemissao>("sem_justa_causa");
  const [diasTrabalhados, setDiasTrabalhados] = useState("");
  const [saldoFGTS, setSaldoFGTS] = useState("");
  const [feriasVencidas, setFeriasVencidas] = useState(false);
  const [resultado, setResultado] = useState<{
    saldoSalario: number;
    feriasProp: number;
    tercoFerias: number;
    feriasVenc: number;
    tercoFeriasVenc: number;
    decimoTerceiro: number;
    avisoPrevio: number;
    multaFGTS: number;
    total: number;
    detalhes: string[];
  } | null>(null);

  function calcular() {
    const sal = parseFloat(salario) || 0;
    const dias = parseInt(diasTrabalhados) || 0;
    const fgts = parseFloat(saldoFGTS) || 0;

    if (!sal || !dataAdmissao || !dataDemissao) return;

    const admissao = new Date(dataAdmissao);
    const demissao = new Date(dataDemissao);
    const diffMs = demissao.getTime() - admissao.getTime();
    const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalMeses = Math.floor(totalDias / 30);
    const anosCompletos = Math.floor(totalMeses / 12);
    const mesesNoAno = totalMeses % 12;
    const diasNoMes = dias > 0 ? dias : demissao.getDate();

    // Saldo de salario
    const saldoSalario = (sal / 30) * diasNoMes;

    // Ferias proporcionais (meses trabalhados no periodo aquisitivo)
    const mesesFerias = mesesNoAno > 0 ? mesesNoAno : 0;
    const feriasProp = (sal / 12) * mesesFerias;
    const tercoFerias = feriasProp / 3;

    // Ferias vencidas (CLT Art. 137 — pagamento em dobro)
    const feriasVenc = feriasVencidas ? sal * 2 : 0;
    const tercoFeriasVenc = feriasVenc / 3;

    // 13o proporcional (Lei 4.090/1962, art. 1o, paragrafo unico)
    // Conta avos: meses trabalhados no ano da demissao, com regra dos 15 dias
    const anoRef = demissao.getFullYear();
    const inicioAno = new Date(anoRef, 0, 1);
    const inicioContagem = admissao > inicioAno ? admissao : inicioAno;
    let avos = 0;
    for (let m = inicioContagem.getMonth(); m <= demissao.getMonth(); m++) {
      const inicioMes = new Date(anoRef, m, 1);
      const fimMes = new Date(anoRef, m + 1, 0);
      const de = inicioMes < inicioContagem ? inicioContagem : inicioMes;
      const ate = fimMes > demissao ? demissao : fimMes;
      const diasTrabMes = Math.floor((ate.getTime() - de.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diasTrabMes >= 15) avos++;
    }
    const decimoTerceiro = (sal / 12) * avos;

    // Aviso previo (3 dias por ano trabalhado, min 30 dias)
    let avisoPrevio = 0;
    if (tipo === "sem_justa_causa") {
      const diasAviso = Math.min(90, 30 + anosCompletos * 3);
      avisoPrevio = (sal / 30) * diasAviso;
    } else if (tipo === "acordo_mutuo") {
      const diasAviso = Math.min(90, 30 + anosCompletos * 3);
      avisoPrevio = ((sal / 30) * diasAviso) / 2;
    }

    // Multa FGTS
    let multaFGTS = 0;
    if (tipo === "sem_justa_causa") {
      multaFGTS = fgts * 0.4;
    } else if (tipo === "acordo_mutuo") {
      multaFGTS = fgts * 0.2;
    }

    const total = saldoSalario + feriasProp + tercoFerias + feriasVenc + tercoFeriasVenc + decimoTerceiro + avisoPrevio + multaFGTS;

    const detalhes: string[] = [];
    detalhes.push(`Tempo de trabalho: ${anosCompletos} anos e ${mesesNoAno} meses`);
    if (tipo === "sem_justa_causa") {
      detalhes.push(`Aviso previo: ${Math.min(90, 30 + anosCompletos * 3)} dias`);
      detalhes.push("Multa FGTS: 40%");
    } else if (tipo === "acordo_mutuo") {
      detalhes.push(`Aviso previo: ${Math.min(90, 30 + anosCompletos * 3)} dias (50%)`);
      detalhes.push("Multa FGTS: 20%");
    } else {
      detalhes.push("Sem direito a aviso previo indenizado");
      detalhes.push("Sem direito a multa FGTS");
    }

    setResultado({
      saldoSalario,
      feriasProp,
      tercoFerias,
      feriasVenc,
      tercoFeriasVenc,
      decimoTerceiro,
      avisoPrevio,
      multaFGTS,
      total,
      detalhes,
    });
  }

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <ToolPage title="Calculadora de Rescisao Trabalhista" description="Calcule o valor estimado da sua rescisao trabalhista. Inclui saldo de salario, ferias proporcionais, 13o proporcional, aviso previo e multa do FGTS." accent="rose" icon="📋" slug="calculadora-rescisao">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-800">Tipo de Demissao</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(tiposLabel) as TipoDemissao[]).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tipo === t ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tiposLabel[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Salario Bruto (R$)</label>
            <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 3000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Saldo FGTS (R$)</label>
            <input type="number" value={saldoFGTS} onChange={(e) => setSaldoFGTS(e.target.value)} placeholder="Ex: 5000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Data de Admissao</label>
            <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Data de Demissao</label>
            <input type="date" value={dataDemissao} onChange={(e) => setDataDemissao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Dias trabalhados no ultimo mes</label>
            <input type="number" value={diasTrabalhados} onChange={(e) => setDiasTrabalhados(e.target.value)} placeholder="Ex: 15" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" checked={feriasVencidas} onChange={(e) => setFeriasVencidas(e.target.checked)} className="w-4 h-4 accent-rose-600" />
              <span className="text-sm">Possui ferias vencidas</span>
            </label>
          </div>
        </div>

        <button onClick={calcular} className="w-full bg-rose-600 text-white rounded-lg py-3 font-semibold hover:bg-rose-700 transition-colors cursor-pointer">
          Calcular Rescisao
        </button>
      </div>

      {resultado && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-green-700 mb-1">Valor Estimado da Rescisao</p>
            <p className="text-4xl font-bold text-green-800">{fmt(resultado.total)}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Saldo de Salario", value: resultado.saldoSalario },
                  { label: "Ferias Proporcionais", value: resultado.feriasProp },
                  { label: "1/3 de Ferias", value: resultado.tercoFerias },
                  ...(resultado.feriasVenc > 0 ? [
                    { label: "Ferias Vencidas", value: resultado.feriasVenc },
                    { label: "1/3 Ferias Vencidas", value: resultado.tercoFeriasVenc },
                  ] : []),
                  { label: "13o Proporcional", value: resultado.decimoTerceiro },
                  { label: "Aviso Previo Indenizado", value: resultado.avisoPrevio },
                  { label: "Multa FGTS", value: resultado.multaFGTS },
                ].map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmt(row.value)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="px-4 py-3 font-bold">TOTAL</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">{fmt(resultado.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-sm mb-2">Detalhes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {resultado.detalhes.map((d, i) => <li key={i}>• {d}</li>)}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Aviso:</strong> Esta calculadora fornece uma estimativa simplificada. Valores reais podem variar conforme aviso previo, medias salariais, adicionais, descontos, convencoes coletivas e caracteristicas especificas do contrato. Nao utilize como calculo oficial — consulte um contador ou advogado trabalhista.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-sm mb-2 text-gray-900">Base Legal e Metodologia</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 13o Salario Proporcional — Lei 4.090/1962</li>
              <li>• Ferias — CLT Art. 129 a 145 e Art. 137 (ferias vencidas em dobro)</li>
              <li>• Aviso Previo Proporcional — Lei 12.506/2011</li>
              <li>• FGTS e Multa Rescisoria — Lei 8.036/1990</li>
              <li>• Acordo Mutuo — CLT Art. 484-A (Reforma Trabalhista)</li>
            </ul>
          </div>
        </>
      )}

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Rescisao</h2>
          <p className="mb-3">
            A calculadora de rescisao trabalhista permite estimar rapidamente o valor que voce tem a receber ao ser desligado de uma empresa. Veja o passo a passo completo para utilizar a ferramenta:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Passo 1 — Selecione o tipo de demissao:</strong> Escolha entre &quot;Demissao sem justa causa&quot; (quando a empresa demite), &quot;Pedido de demissao&quot; (quando voce pede para sair) ou &quot;Acordo mutuo&quot; (quando ambas as partes concordam com o desligamento). O tipo escolhido afeta diretamente quais verbas voce tera direito.</li>
            <li><strong>Passo 2 — Informe o salario bruto:</strong> Digite o valor do seu salario bruto mensal (antes dos descontos). Esse e o valor que aparece na sua carteira de trabalho ou no holerite como &quot;salario base&quot;.</li>
            <li><strong>Passo 3 — Informe o saldo do FGTS:</strong> Insira o saldo acumulado no seu Fundo de Garantia. Voce pode consultar esse valor no aplicativo FGTS da Caixa Economica Federal ou pelo site fgts.caixa.gov.br.</li>
            <li><strong>Passo 4 — Preencha as datas:</strong> Informe a data de admissao (quando voce comecou a trabalhar) e a data de demissao (ultimo dia de trabalho). Essas datas sao usadas para calcular o tempo de servico, ferias proporcionais e aviso previo.</li>
            <li><strong>Passo 5 — Dias trabalhados e ferias:</strong> Informe quantos dias voce trabalhou no ultimo mes. Se possui ferias vencidas (periodo aquisitivo completo sem tirar ferias), marque a opcao correspondente.</li>
            <li><strong>Passo 6 — Clique em Calcular:</strong> O resultado aparecera detalhado, com cada verba rescisoria discriminada em uma tabela clara.</li>
          </ul>
          <p className="mt-3">
            O calculo e instantaneo e funciona diretamente no navegador, sem necessidade de cadastro ou instalacao de aplicativos. Todos os dados permanecem no seu dispositivo — nenhuma informacao e enviada para servidores.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo da Rescisao Trabalhista</h2>
          <p className="mb-3">
            A rescisao trabalhista e composta por diversas verbas que variam conforme o tipo de desligamento. Entender cada componente e fundamental para saber se o valor que a empresa esta oferecendo esta correto.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Saldo de Salario</h3>
          <p className="mb-3">
            E o pagamento proporcional aos dias trabalhados no mes da demissao. A formula e simples: salario bruto dividido por 30, multiplicado pelo numero de dias efetivamente trabalhados. Por exemplo, se voce ganha R$ 3.000 e trabalhou 15 dias, o saldo sera R$ 1.500.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Ferias Proporcionais + 1/3 Constitucional</h3>
          <p className="mb-3">
            A cada 12 meses trabalhados, o funcionario adquire direito a 30 dias de ferias. Na rescisao, as ferias proporcionais sao calculadas com base nos meses trabalhados no periodo aquisitivo incompleto. O adicional de 1/3 e um direito garantido pela Constituicao Federal (Art. 7o, XVII) e incide sobre o valor das ferias.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">13o Salario Proporcional</h3>
          <p className="mb-3">
            O decimo terceiro proporcional e calculado dividindo o salario por 12 e multiplicando pelo numero de meses trabalhados no ano da demissao. Meses com 15 dias ou mais trabalhados contam como mes completo para esse calculo.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Aviso Previo Indenizado</h3>
          <p className="mb-3">
            Na demissao sem justa causa, o aviso previo e de no minimo 30 dias, acrescido de 3 dias para cada ano completo trabalhado na mesma empresa, limitado a 90 dias no total (Lei 12.506/2011). Se o empregador optar por indenizar o aviso (dispensar o funcionario do cumprimento), o valor e pago integralmente. No acordo mutuo, o aviso previo indenizado e pago pela metade.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Multa do FGTS</h3>
          <p className="mb-3">
            Na demissao sem justa causa, o empregador deve pagar uma multa de 40% sobre o saldo total do FGTS do funcionario. No acordo mutuo (criado pela Reforma Trabalhista de 2017), a multa e de 20%. No pedido de demissao, nao ha multa e o trabalhador nao pode sacar o FGTS.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre demissao sem justa causa e acordo mutuo?</summary>
              <p className="px-4 pb-3 text-sm">Na demissao sem justa causa, o empregador toma a decisao sozinho e o trabalhador tem direito a todas as verbas rescisorias: aviso previo integral, multa de 40% do FGTS, saque do FGTS e seguro-desemprego. No acordo mutuo (Art. 484-A da CLT), ambas as partes concordam com o fim do contrato, e o trabalhador recebe metade do aviso previo, multa de 20% do FGTS, pode sacar 80% do FGTS, mas nao tem direito ao seguro-desemprego.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como consultar o saldo do FGTS?</summary>
              <p className="px-4 pb-3 text-sm">Voce pode consultar o saldo do FGTS pelo aplicativo FGTS da Caixa Economica Federal (disponivel para Android e iOS), pelo site fgts.caixa.gov.br, ou enviando SMS com a palavra FGTS para o numero 29022. Tambem e possivel consultar em qualquer agencia da Caixa com documento de identidade e numero do PIS/NIS.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A calculadora considera descontos de INSS e Imposto de Renda?</summary>
              <p className="px-4 pb-3 text-sm">Nao. Esta calculadora fornece uma estimativa bruta das verbas rescisorias. Na pratica, incidem descontos de INSS sobre o saldo de salario e 13o proporcional, e pode haver retencao de Imposto de Renda dependendo do valor total. Para um calculo liquido preciso, consulte o departamento de RH ou um contador.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Tenho direito a seguro-desemprego?</summary>
              <p className="px-4 pb-3 text-sm">O seguro-desemprego e pago apenas na demissao sem justa causa. O trabalhador precisa ter trabalhado pelo menos 12 meses nos ultimos 18 meses (primeira solicitacao), 9 meses nos ultimos 12 meses (segunda solicitacao) ou 6 meses (demais solicitacoes). No pedido de demissao e no acordo mutuo, nao ha direito ao seguro-desemprego.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual o prazo para a empresa pagar a rescisao?</summary>
              <p className="px-4 pb-3 text-sm">De acordo com a CLT (Art. 477), a empresa tem ate 10 dias corridos apos o termino do contrato para efetuar o pagamento das verbas rescisorias, independentemente do tipo de demissao. O descumprimento desse prazo gera multa equivalente a um salario do trabalhador em favor do empregado.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O que sao ferias vencidas?</summary>
              <p className="px-4 pb-3 text-sm">Ferias vencidas sao aquelas cujo periodo aquisitivo (12 meses de trabalho) ja se completou, mas o empregador nao concedeu o descanso dentro do periodo concessivo (os 12 meses seguintes). Nesse caso, o trabalhador tem direito ao pagamento em dobro das ferias, incluindo o terco constitucional (Art. 137 da CLT e OJ-386/SDI-1 do TST). Na nossa calculadora, as ferias vencidas sao calculadas como o dobro do salario, acrescido de 1/3 sobre esse valor.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso negociar uma rescisao melhor com a empresa?</summary>
              <p className="px-4 pb-3 text-sm">As verbas rescisorias sao direitos garantidos por lei e nao podem ser reduzidas. Porem, na pratica, e possivel negociar beneficios adicionais como extensao do plano de saude, carta de recomendacao, manutencao temporaria de beneficios ou um valor adicional a titulo de PLR proporcional. O acordo mutuo tambem pode ser uma alternativa negociada quando ambas as partes concordam.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas e Exemplos do Dia a Dia</h2>
          <p className="mb-3">
            Entender seus direitos trabalhistas e fundamental para nao ser prejudicado no momento da rescisao. Veja algumas situacoes praticas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Exemplo — Demissao sem justa causa:</strong> Maria trabalhou por 3 anos e 4 meses com salario de R$ 3.000. Ela tem direito a aviso previo de 39 dias (30 + 3x3 anos), ferias proporcionais de 4 meses, 13o proporcional e multa de 40% sobre todo o FGTS acumulado. Com FGTS de R$ 12.000, so a multa ja soma R$ 4.800.</li>
            <li><strong>Exemplo — Acordo mutuo:</strong> Joao quer sair da empresa, mas deseja sacar parte do FGTS. Negociando um acordo mutuo, ele recebe metade do aviso previo, multa de 20% do FGTS e pode sacar ate 80% do saldo. A desvantagem e que nao tera direito ao seguro-desemprego.</li>
            <li><strong>Exemplo — Pedido de demissao:</strong> Ana pede demissao apos 8 meses. Ela recebe saldo de salario, ferias proporcionais com 1/3 e 13o proporcional, mas nao tem direito a aviso previo indenizado, multa do FGTS nem seguro-desemprego.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Muitos trabalhadores nao sabem que o aviso previo proporcional (3 dias extras por ano) so se aplica quando a empresa demite. Quando o funcionario pede demissao, o aviso previo e sempre de 30 dias, sem acrescimo.
          </p>
          <p className="mt-2">
            <strong>Dica importante:</strong> Guarde sempre seus holerites, contracheques e comprovantes de deposito do FGTS. Esses documentos sao essenciais caso haja divergencia nos valores da rescisao. Se perceber que o valor pago esta incorreto, voce pode reclamar na Justica do Trabalho em ate 2 anos apos o desligamento (prescricao bienal), cobrando direitos dos ultimos 5 anos trabalhados (prescricao quinquenal).
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
