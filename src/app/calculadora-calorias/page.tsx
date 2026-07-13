"use client";

import { useState } from "react";

const niveis = [
  { id: "sedentario", label: "Sedentario", desc: "Pouco ou nenhum exercicio", fator: 1.2 },
  { id: "leve", label: "Levemente ativo", desc: "Exercicio 1-3 dias/semana", fator: 1.375 },
  { id: "moderado", label: "Moderadamente ativo", desc: "Exercicio 3-5 dias/semana", fator: 1.55 },
  { id: "ativo", label: "Muito ativo", desc: "Exercicio 6-7 dias/semana", fator: 1.725 },
  { id: "extremo", label: "Extremamente ativo", desc: "Exercicio intenso diario ou trabalho fisico", fator: 1.9 },
];

import ToolPage from "../components/ToolPage";

export default function CalculadoraCalorias() {
  const [sexo, setSexo] = useState<"masculino" | "feminino">("masculino");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [nivel, setNivel] = useState("moderado");
  const [resultado, setResultado] = useState<{
    tmb: number;
    manutencao: number;
    perda: number;
    perdaRapida: number;
    ganho: number;
  } | null>(null);

  function calcular() {
    const i = parseInt(idade) || 0;
    const p = parseFloat(peso) || 0;
    const a = parseFloat(altura) || 0;
    if (!i || !p || !a) return;

    // Harris-Benedict
    let tmb: number;
    if (sexo === "masculino") {
      tmb = 88.362 + 13.397 * p + 4.799 * a - 5.677 * i;
    } else {
      tmb = 447.593 + 9.247 * p + 3.098 * a - 4.33 * i;
    }

    const fator = niveis.find((n) => n.id === nivel)?.fator || 1.55;
    const manutencao = tmb * fator;

    setResultado({
      tmb: Math.round(tmb),
      manutencao: Math.round(manutencao),
      perda: Math.round(manutencao - 500),
      perdaRapida: 0,
      ganho: Math.round(manutencao + 500),
    });
  }

  return (
    <ToolPage
      title="Calculadora de Calorias Diarias"
      description="Descubra quantas calorias voce precisa consumir por dia para emagrecer, manter ou ganhar peso. Calculo baseado na formula de Harris-Benedict."
      accent="red"
      icon="🍎"
      slug="calculadora-calorias"
    >

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-2">Sexo</label>
          <div className="flex gap-2">
            <button onClick={() => setSexo("masculino")} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${sexo === "masculino" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Masculino
            </button>
            <button onClick={() => setSexo("feminino")} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${sexo === "feminino" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Feminino
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Idade (anos)</label>
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 30" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Peso (kg)</label>
            <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ex: 75" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Altura (cm)</label>
            <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ex: 175" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">Nivel de atividade fisica</label>
          <div className="space-y-2">
            {niveis.map((n) => (
              <label key={n.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${nivel === n.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                <input type="radio" name="nivel" value={n.id} checked={nivel === n.id} onChange={() => setNivel(n.id)} className="accent-blue-600" />
                <div>
                  <span className="font-medium text-sm text-gray-900">{n.label}</span>
                  <span className="text-xs text-gray-600 ml-2">{n.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button onClick={calcular} className="w-full bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition-colors cursor-pointer">
          Calcular Calorias
        </button>
      </div>

      {resultado && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center mb-6">
            <p className="text-sm text-blue-700 mb-1">Taxa Metabolica Basal (TMB)</p>
            <p className="text-2xl font-bold text-blue-800">{resultado.tmb.toLocaleString("pt-BR")} kcal/dia</p>
            <p className="text-xs text-blue-600 mt-1">Calorias que seu corpo gasta em repouso total</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {resultado.perda >= 1200 ? (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
                <p className="text-xs text-orange-600 mb-1">Deficit Moderado</p>
                <p className="text-2xl font-bold text-orange-700">{resultado.perda.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-orange-500">kcal/dia (~500 kcal abaixo)</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 text-center">
                <p className="text-xs text-amber-700 mb-1">Deficit Moderado</p>
                <p className="text-lg font-bold text-amber-800">Avaliacao profissional recomendada</p>
                <p className="text-xs text-amber-700 mt-2">O deficit calculado ficou abaixo da faixa de seguranca utilizada por esta ferramenta. Procure um nutricionista ou medico para uma orientacao individualizada.</p>
              </div>
            )}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-xs text-green-600 mb-1">Manutencao</p>
              <p className="text-2xl font-bold text-green-700">{resultado.manutencao.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-green-500">kcal/dia</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
              <p className="text-xs text-purple-600 mb-1">Superavit Moderado</p>
              <p className="text-2xl font-bold text-purple-700">{resultado.ganho.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-purple-500">kcal/dia (~500 kcal acima)</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-8 text-center">
            Estimativas baseadas na formula de Harris-Benedict. A perda de peso real varia conforme metabolismo individual, composicao corporal e outros fatores. Esta ferramenta nao substitui orientacao de nutricionista ou medico.
          </p>
        </>
      )}

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Calorias</h2>
          <p className="mb-3">
            A calculadora de calorias diarias estima quantas calorias voce precisa consumir por dia com base nos seus dados pessoais e nivel de atividade fisica. Veja como utilizar:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Passo 1 — Selecione o sexo:</strong> Escolha entre masculino ou feminino. A formula de calculo e diferente para cada sexo, pois homens e mulheres possuem composicoes corporais e metabolismos distintos.</li>
            <li><strong>Passo 2 — Informe idade, peso e altura:</strong> Digite sua idade em anos, peso em quilogramas e altura em centimetros. Esses dados sao usados diretamente na formula de Harris-Benedict para calcular sua Taxa Metabolica Basal (TMB).</li>
            <li><strong>Passo 3 — Escolha o nivel de atividade:</strong> Selecione a opcao que melhor descreve sua rotina de exercicios. Seja honesto nessa escolha — superestimar seu nivel de atividade resultara em um calculo de calorias acima do necessario, dificultando seus objetivos.</li>
            <li><strong>Passo 4 — Clique em Calcular:</strong> O resultado mostrara sua TMB (calorias em repouso) e tres referencias diarias: deficit moderado (~500 kcal abaixo da manutencao), manutencao do peso atual e superavit moderado (~500 kcal acima). A perda de peso real varia conforme o individuo.</li>
          </ul>
          <p className="mt-3">
            O calculo e instantaneo e totalmente privado — nenhum dado pessoal e enviado para servidores. Use os resultados como ponto de partida e ajuste conforme seus resultados praticos ao longo das semanas.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo: Formula de Harris-Benedict</h2>
          <p className="mb-3">
            A calculadora utiliza a equacao de Harris-Benedict, uma das formulas mais tradicionais e amplamente utilizadas na nutricao para estimar a Taxa Metabolica Basal (TMB). Publicada originalmente em 1919 e revisada em 1984 por Roza e Shizgal, essa formula considera quatro variaveis: sexo, peso, altura e idade.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">As Formulas</h3>
          <p className="mb-2">
            <strong>Homens:</strong> TMB = 88,362 + (13,397 x peso em kg) + (4,799 x altura em cm) - (5,677 x idade em anos)
          </p>
          <p className="mb-3">
            <strong>Mulheres:</strong> TMB = 447,593 + (9,247 x peso em kg) + (3,098 x altura em cm) - (4,33 x idade em anos)
          </p>
          <p className="mb-3">
            A TMB representa as calorias que seu corpo consome apenas para manter funcoes vitais: respiracao, circulacao sanguinea, regulacao da temperatura corporal, funcionamento do cerebro e reparacao celular. Ela corresponde a cerca de 60% a 75% do gasto energetico total diario de uma pessoa sedentaria.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Fator de Atividade Fisica</h3>
          <p className="mb-3">
            Para chegar ao gasto calorico total diario, a TMB e multiplicada por um fator de atividade que varia de 1,2 (sedentario) a 1,9 (extremamente ativo). Esse multiplicador considera nao apenas o exercicio formal, mas toda a movimentacao do dia a dia: caminhar, subir escadas, trabalho fisico, etc.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Deficit e Superavit Calorico</h3>
          <p className="mb-3">
            Um deficit de 500 kcal/dia resulta em uma perda de aproximadamente 0,5 kg por semana, ja que 1 kg de gordura corporal equivale a cerca de 7.700 kcal. Um deficit de 1.000 kcal/dia acelera a perda para cerca de 1 kg/semana, porem e considerado agressivo e nao deve ser mantido por longos periodos sem acompanhamento profissional. Para ganho de peso (massa muscular), um superavit de 300 a 500 kcal aliado a treino de forca e o mais recomendado.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A calculadora funciona para qualquer pessoa?</summary>
              <p className="px-4 pb-3 text-sm">A formula de Harris-Benedict e projetada para adultos saudaveis. Ela pode nao ser precisa para criancas, adolescentes em fase de crescimento, idosos acima de 75 anos, gestantes, lactantes ou pessoas com condicoes metabolicas especiais (como hipotireoidismo ou hipertireoidismo). Para esses grupos, e fundamental consultar um nutricionista.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre Harris-Benedict e Mifflin-St Jeor?</summary>
              <p className="px-4 pb-3 text-sm">Ambas sao formulas para estimar a TMB. A Harris-Benedict (1919, revisada em 1984) e mais tradicional. A Mifflin-St Jeor (1990) e considerada ligeiramente mais precisa por estudos recentes, especialmente para pessoas com sobrepeso. Na pratica, a diferenca entre elas e pequena (geralmente menos de 100 kcal). Usamos Harris-Benedict por ser a mais conhecida e amplamente referenciada.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso comer abaixo da TMB para emagrecer mais rapido?</summary>
              <p className="px-4 pb-3 text-sm">Nao e recomendado. A TMB e o minimo que seu corpo precisa para funcionar. Comer consistentemente abaixo desse valor pode causar perda de massa muscular, desaceleracao do metabolismo (efeito plato), deficiencias nutricionais, fadiga cronica e problemas hormonais. O ideal e manter a ingestao calorica acima da TMB, criando o deficit por meio da atividade fisica e de uma reducao moderada na alimentacao.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como saber meu nivel de atividade fisica real?</summary>
              <p className="px-4 pb-3 text-sm">Se voce trabalha sentado e nao pratica exercicios, escolha &quot;Sedentario&quot;. Se faz caminhadas leves ou exercicios 1-3 vezes por semana, escolha &quot;Levemente ativo&quot;. Para quem treina na academia 3-5 vezes por semana, &quot;Moderadamente ativo&quot; e o mais adequado. &quot;Muito ativo&quot; se aplica a quem treina intensamente quase todos os dias, e &quot;Extremamente ativo&quot; e para atletas ou pessoas com trabalho fisico pesado. Na duvida, escolha um nivel abaixo — e melhor subestimar do que superestimar.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">De quanto em quanto tempo devo recalcular?</summary>
              <p className="px-4 pb-3 text-sm">Recalcule a cada 5 kg de mudanca de peso ou a cada 2-3 meses. A medida que voce perde peso, sua TMB diminui (corpo menor gasta menos energia), entao o deficit que funcionava antes pode nao ser suficiente. O mesmo vale para ganho de peso — conforme voce ganha massa, precisa de mais calorias para manter o superavit.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A calculadora considera macronutrientes?</summary>
              <p className="px-4 pb-3 text-sm">Nao. Esta calculadora foca no total calorico diario, sem detalhar a distribuicao entre proteinas, carboidratos e gorduras. Como referencia geral para emagrecimento, uma distribuicao comum e: 30% proteinas, 40% carboidratos e 30% gorduras. Para ganho de massa muscular, recomenda-se 1,6 a 2,2 g de proteina por kg de peso corporal. Um nutricionista pode personalizar esses valores.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Por que homens podem comer mais calorias que mulheres?</summary>
              <p className="px-4 pb-3 text-sm">Em media, homens possuem maior massa muscular e menor percentual de gordura corporal que mulheres. Como o tecido muscular e metabolicamente mais ativo (consome mais energia em repouso), a TMB masculina tende a ser mais alta. Alem disso, fatores hormonais como a testosterona contribuem para um metabolismo basal mais elevado nos homens.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para o Dia a Dia</h2>
          <p className="mb-3">
            Saber suas calorias diarias e apenas o primeiro passo. Veja como aplicar esse conhecimento na pratica:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Use um aplicativo de contagem:</strong> Apps como MyFitnessPal, FatSecret ou Yazio facilitam o registro diario de alimentos. Nos primeiros dias, pese os alimentos para calibrar sua percepcao de porcoes — depois de algumas semanas, voce conseguira estimar visualmente.</li>
            <li><strong>Nao elimine grupos alimentares:</strong> Dietas muito restritivas sao dificeis de manter a longo prazo. Em vez de cortar carboidratos completamente, reduza porcoes e priorize fontes integrais (arroz integral, aveia, batata-doce).</li>
            <li><strong>Agua e aliada:</strong> Muitas vezes a sensacao de fome e na verdade sede. Beba pelo menos 35 ml de agua por kg de peso corporal por dia. Alem disso, beber agua antes das refeicoes pode ajudar a reduzir a ingestao calorica.</li>
            <li><strong>Exemplo pratico — Emagrecimento:</strong> Um homem de 30 anos, 85 kg, 175 cm e moderadamente ativo tem uma TMB de aproximadamente 1.870 kcal e um gasto total de cerca de 2.900 kcal. Para perder 0,5 kg por semana, ele deveria consumir cerca de 2.400 kcal/dia.</li>
            <li><strong>Exemplo pratico — Ganho de massa:</strong> Uma mulher de 25 anos, 60 kg, 165 cm e ativa tem uma TMB de cerca de 1.400 kcal e gasto total de aproximadamente 2.415 kcal. Para ganhar peso de forma saudavel, ela deveria consumir cerca de 2.900 kcal/dia, priorizando proteinas e treino de forca.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Muitas pessoas focam apenas no deficit calorico e ignoram a qualidade dos alimentos. Consumir 1.800 kcal de fast-food e muito diferente de 1.800 kcal de alimentos nutritivos. Alem das calorias, priorize alimentos ricos em fibras, vitaminas e minerais para manter a saude e a saciedade ao longo do dia.
          </p>
          <p className="mt-2">
            <strong>Importante:</strong> Esta calculadora oferece uma estimativa inicial. Cada organismo e unico, e fatores como genetica, qualidade do sono, estresse e microbioma intestinal influenciam o metabolismo real. Use os numeros como guia e ajuste conforme seus resultados praticos. Para objetivos especificos, consulte um nutricionista.
          </p>
        </div>
      </section>

      <section className="mt-8 border-t border-gray-200 pt-6 max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
          Esta ferramenta nao substitui orientacao de nutricionista ou medico. Resultados sao estimativas baseadas em formulas populacionais.
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
            <li>Harris-Benedict — equacao revisada por Roza &amp; Shizgal (1984) para estimativa da Taxa Metabolica Basal</li>
            <li>OMS (Organizacao Mundial da Saude) — fatores de atividade fisica para calculo do gasto energetico total</li>
          </ul>
          <p className="mt-2 text-gray-400">Ultima revisao: 12 de julho de 2026</p>
        </div>
      </section>
    </ToolPage>
  );
}
