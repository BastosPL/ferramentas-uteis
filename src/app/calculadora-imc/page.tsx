"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

const faixas = [
  { min: 0, max: 16, label: "Magreza grave", cor: "bg-red-600", descricao: "Procure orientacao medica urgente." },
  { min: 16, max: 17, label: "Magreza moderada", cor: "bg-orange-500", descricao: "Risco nutricional. Consulte um profissional." },
  { min: 17, max: 18.5, label: "Magreza leve", cor: "bg-yellow-500", descricao: "Abaixo do peso ideal. Atencao a alimentacao." },
  { min: 18.5, max: 25, label: "Peso normal", cor: "bg-green-500", descricao: "Parabens! Voce esta no peso ideal." },
  { min: 25, max: 30, label: "Sobrepeso", cor: "bg-yellow-500", descricao: "Atencao! Considere ajustar habitos alimentares e exercicios." },
  { min: 30, max: 35, label: "Obesidade grau I", cor: "bg-orange-500", descricao: "Risco aumentado para saude. Consulte um medico." },
  { min: 35, max: 40, label: "Obesidade grau II", cor: "bg-red-500", descricao: "Risco alto. Acompanhamento medico e importante." },
  { min: 40, max: 100, label: "Obesidade grau III", cor: "bg-red-700", descricao: "Risco muito alto. Procure ajuda medica." },
];

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState<{
    imc: number;
    faixa: (typeof faixas)[0];
    pesoIdealMin: number;
    pesoIdealMax: number;
  } | null>(null);

  function calcular() {
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100;
    if (!p || !a || a <= 0) return;

    const imc = p / (a * a);
    const faixa = faixas.find((f) => imc >= f.min && imc < f.max) || faixas[faixas.length - 1];
    const pesoIdealMin = 18.5 * a * a;
    const pesoIdealMax = 24.9 * a * a;

    setResultado({ imc, faixa, pesoIdealMin, pesoIdealMax });
  }

  return (
    <ToolPage title="Calculadora de IMC" description="Calcule seu Indice de Massa Corporal (IMC) e descubra se voce esta no peso ideal. O IMC e uma medida internacional usada para avaliar o nivel de gordura corporal." accent="orange" icon="⚖️" slug="calculadora-imc">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ex: 70"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">Altura (cm)</label>
            <input
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder="Ex: 175"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <button
          onClick={calcular}
          className="w-full bg-orange-500 text-white rounded-lg py-3 font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Calcular IMC
        </button>
      </div>

      {resultado && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className={`rounded-xl p-5 text-center text-white ${resultado.faixa.cor}`}>
              <p className="text-sm opacity-90 mb-1">Seu IMC</p>
              <p className="text-4xl font-bold">{resultado.imc.toFixed(1)}</p>
              <p className="text-sm font-medium mt-1">{resultado.faixa.label}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-700 mb-1">Peso Ideal Minimo</p>
              <p className="text-2xl font-bold text-blue-800">
                {resultado.pesoIdealMin.toFixed(1)} kg
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-700 mb-1">Peso Ideal Maximo</p>
              <p className="text-2xl font-bold text-blue-800">
                {resultado.pesoIdealMax.toFixed(1)} kg
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <p className="text-gray-700">{resultado.faixa.descricao}</p>
          </div>
        </>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Tabela de Classificacao do IMC</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">IMC</th>
                <th className="px-4 py-2 text-left">Classificacao</th>
              </tr>
            </thead>
            <tbody>
              {faixas.map((f) => (
                <tr
                  key={f.label}
                  className={`border-t border-gray-100 ${
                    resultado && resultado.faixa.label === f.label ? "bg-blue-50 font-medium" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    {f.min} - {f.max}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${f.cor}`} />
                    {f.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de IMC</h2>
          <p className="mb-3">
            Usar nossa calculadora de IMC e simples e rapido. Siga os passos abaixo para descobrir seu Indice de Massa Corporal em poucos segundos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Informe seu peso:</strong> No campo &quot;Peso (kg)&quot;, digite seu peso atual em quilogramas. Voce pode usar casas decimais para maior precisao (exemplo: 72,5 kg). Use uma balanca confiavel, preferencialmente pela manha em jejum, para obter o valor mais preciso.</li>
            <li><strong>Informe sua altura:</strong> No campo &quot;Altura (cm)&quot;, digite sua altura em centimetros. Por exemplo, se voce mede 1 metro e 75 centimetros, digite 175. Fique descalco e ereto ao se medir para garantir a precisao.</li>
            <li><strong>Clique em Calcular IMC:</strong> Apos preencher ambos os campos, clique no botao &quot;Calcular IMC&quot;. O resultado aparecera imediatamente, mostrando seu IMC numerico, a classificacao correspondente (peso normal, sobrepeso, etc.) e a faixa de peso ideal para sua altura.</li>
            <li><strong>Interprete os resultados:</strong> Alem do valor numerico do IMC, a ferramenta exibe tres cartoes: seu IMC atual com a classificacao, o peso ideal minimo e o peso ideal maximo para sua altura. A tabela abaixo mostra todas as faixas de classificacao, com destaque para a sua.</li>
          </ul>
          <p className="mt-3">
            O calculo e realizado inteiramente no seu navegador, sem enviar nenhum dado pessoal para servidores externos. Voce pode usar a ferramenta quantas vezes quiser com total privacidade.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o Calculo do IMC</h2>
          <p className="mb-3">
            O Indice de Massa Corporal (IMC) foi desenvolvido pelo matematico e estatistico belga Adolphe Quetelet em 1832 e e a medida mais utilizada mundialmente para classificar o peso corporal de adultos. A Organizacao Mundial da Saude (OMS) adota o IMC como padrao internacional desde a decada de 1990.
          </p>
          <p className="mb-3">
            A formula e simples: <strong>IMC = peso (kg) / altura (m) ao quadrado</strong>. Por exemplo, uma pessoa com 70 kg e 1,75 m de altura tem IMC = 70 / (1,75 x 1,75) = 70 / 3,0625 = 22,9. Esse valor se enquadra na faixa de &quot;Peso normal&quot; (18,5 a 24,9).
          </p>
          <p className="mb-3">
            A classificacao segue os parametros definidos pela OMS: abaixo de 16 indica magreza grave, entre 16 e 17 magreza moderada, entre 17 e 18,5 magreza leve, entre 18,5 e 25 peso normal, entre 25 e 30 sobrepeso, entre 30 e 35 obesidade grau I, entre 35 e 40 obesidade grau II, e acima de 40 obesidade grau III (morbida).
          </p>
          <p className="mb-3">
            E importante entender que o IMC possui limitacoes. Ele nao diferencia entre massa muscular e gordura corporal, nao considera a distribuicao de gordura no corpo (gordura abdominal e mais perigosa que gordura periferica) e nao e adequado para criancas, gestantes, idosos ou atletas de alta performance. Para essas populacoes, existem medidas complementares como a circunferencia abdominal, o percentual de gordura corporal e a relacao cintura-quadril.
          </p>
          <p className="mb-3">
            Nossa calculadora tambem mostra a faixa de peso ideal para sua altura, calculada usando os limites de IMC normal (18,5 a 24,9). Esse intervalo oferece uma referencia util, mas o peso ideal individual depende de fatores como composicao corporal, idade, sexo e condicoes de saude.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O IMC e confiavel para todas as pessoas?</summary>
              <p className="px-4 pb-3 text-sm">O IMC e uma ferramenta de triagem util para a populacao geral adulta, mas possui limitacoes. Atletas e pessoas com muita massa muscular podem ter IMC elevado sem excesso de gordura. Idosos tendem a perder massa muscular, o que pode mascarar excesso de gordura com um IMC aparentemente normal. Gestantes, criancas e adolescentes devem usar tabelas especificas. Consulte sempre um profissional de saude para uma avaliacao completa.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual e o IMC ideal?</summary>
              <p className="px-4 pb-3 text-sm">Segundo a OMS, o IMC ideal esta entre 18,5 e 24,9, classificado como &quot;Peso normal&quot;. Dentro dessa faixa, estudos mostram menor risco de doencas cronicas como diabetes tipo 2, hipertensao e doencas cardiovasculares. Porem, o valor ideal exato varia de pessoa para pessoa dependendo da composicao corporal, idade e historico de saude.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Meu IMC deu acima de 25. Devo me preocupar?</summary>
              <p className="px-4 pb-3 text-sm">Um IMC acima de 25 indica sobrepeso segundo os parametros da OMS. Isso nao significa necessariamente que voce esta doente, mas e um sinal de atencao. Fatores como alimentacao, nivel de atividade fisica, circunferencia abdominal e historico familiar tambem devem ser considerados. O ideal e procurar um medico ou nutricionista para uma avaliacao individualizada e, se necessario, elaborar um plano de mudanca de habitos.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre IMC e percentual de gordura?</summary>
              <p className="px-4 pb-3 text-sm">O IMC e calculado apenas com peso e altura, sem considerar a composicao corporal. Ja o percentual de gordura mede especificamente quanto do peso total e composto por tecido adiposo. Duas pessoas com o mesmo IMC podem ter composicoes corporais muito diferentes: uma pode ter mais musculo e outra mais gordura. Metodos como bioimpedancia, dobras cutaneas e DEXA medem o percentual de gordura com maior precisao.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como o IMC e calculado para criancas?</summary>
              <p className="px-4 pb-3 text-sm">Para criancas e adolescentes (2 a 19 anos), o IMC e calculado da mesma forma (peso/altura ao quadrado), mas a interpretacao e diferente. O resultado e comparado com curvas de crescimento especificas por idade e sexo, usando percentis. O Ministerio da Saude e a OMS disponibilizam tabelas de referencia para essas faixas etarias. Nossa calculadora e destinada exclusivamente para adultos (maiores de 20 anos).</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O IMC muda com a idade?</summary>
              <p className="px-4 pb-3 text-sm">O IMC em si e um calculo fixo, mas a composicao corporal muda com a idade. Com o envelhecimento, a tendencia e perder massa muscular e acumular gordura, especialmente na regiao abdominal. Por isso, um idoso com IMC &quot;normal&quot; pode ter um percentual de gordura prelevado. Alguns especialistas sugerem que a faixa ideal de IMC para idosos deveria ser ligeiramente mais alta (entre 23 e 28).</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso confiar apenas no IMC para avaliar minha saude?</summary>
              <p className="px-4 pb-3 text-sm">Nao. O IMC e apenas um indicador inicial. Para uma avaliacao completa da saude, e necessario considerar outros fatores como circunferencia abdominal (risco cardiovascular aumenta acima de 80 cm para mulheres e 94 cm para homens), exames de sangue (colesterol, glicemia, triglicerides), pressao arterial, historico familiar e nivel de atividade fisica. Use o IMC como ponto de partida e consulte um profissional de saude.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Manter o Peso Ideal</h2>
          <p className="mb-3">
            Manter o IMC dentro da faixa saudavel exige atencao a alimentacao e ao estilo de vida. Veja algumas dicas praticas baseadas em recomendacoes do Ministerio da Saude e da OMS:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Monitore-se regularmente:</strong> Pese-se uma vez por semana, sempre no mesmo horario e nas mesmas condicoes (pela manha, em jejum, sem roupas pesadas). Use esta calculadora para acompanhar a evolucao do seu IMC ao longo do tempo.</li>
            <li><strong>Alimentacao equilibrada:</strong> Priorize alimentos in natura e minimamente processados como frutas, verduras, legumes, graos integrais e proteinas magras. Evite ultraprocessados ricos em acucar, sodio e gorduras trans. Para estimar quantas calorias voce precisa por dia, use a <a href="/calculadora-calorias" className="text-teal-600 hover:underline">Calculadora de Calorias</a>.</li>
            <li><strong>Atividade fisica regular:</strong> A OMS recomenda pelo menos 150 minutos de atividade fisica moderada por semana (cerca de 30 minutos, 5 dias por semana). Caminhada, natacao, ciclismo e musculacao sao excelentes opcoes.</li>
            <li><strong>Hidratacao adequada:</strong> Beba pelo menos 2 litros de agua por dia. A desidratacao pode ser confundida com fome, levando ao consumo excessivo de calorias.</li>
            <li><strong>Sono de qualidade:</strong> Dormir de 7 a 9 horas por noite regula hormonios que controlam a fome (grelina e leptina). A privacao de sono esta associada ao ganho de peso.</li>
            <li><strong>Consulte um profissional:</strong> Se seu IMC esta fora da faixa normal, procure um nutricionista ou endocrinologista. Dietas restritivas sem orientacao profissional podem causar carencias nutricionais e efeito sanfona.</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 border-t border-gray-200 pt-6 max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
          O IMC e um indicador simplificado que nao considera composicao corporal, idade ou condicoes individuais. Consulte um profissional de saude.
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">FU</div>
          <div>
            <p className="font-medium text-gray-800">Equipe Editorial FerramentaUtil</p>
            <p className="text-xs text-gray-500 mt-0.5">Conteudo produzido e revisado pela equipe responsavel pelo FerramentaUtil, com consulta as fontes indicadas abaixo.</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p className="font-medium text-gray-600 mb-1">Fontes e metodologia</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>OMS (Organizacao Mundial da Saude) — tabela de classificacao do IMC para adultos</li>
            <li>Ministerio da Saude do Brasil — diretrizes de avaliacao nutricional e faixas de peso saudavel</li>
          </ul>
          <p className="mt-2 text-gray-400">Ultima revisao: 12 de julho de 2026</p>
        </div>
      </section>
    </ToolPage>
  );
}
