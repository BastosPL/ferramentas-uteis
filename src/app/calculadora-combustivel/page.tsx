"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

type Modo = "rapido" | "preciso";
type TipoKm = "mensal" | "viagem";

function formatReal(v: number): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CalculadoraCombustivel() {
  const [modo, setModo] = useState<Modo>("rapido");
  const [precoAlcool, setPrecoAlcool] = useState("");
  const [precoGasolina, setPrecoGasolina] = useState("");

  const [consumoGasolina, setConsumoGasolina] = useState("");
  const [consumoAlcool, setConsumoAlcool] = useState("");
  const [km, setKm] = useState("");
  const [tipoKm, setTipoKm] = useState<TipoKm>("mensal");

  const pa = parseFloat(precoAlcool) || 0;
  const pg = parseFloat(precoGasolina) || 0;
  const cg = parseFloat(consumoGasolina) || 0;
  const ca = parseFloat(consumoAlcool) || 0;
  const kmVal = parseFloat(km) || 0;

  const razao = pg > 0 ? pa / pg : 0;
  const temResultadoRapido = pa > 0 && pg > 0;
  const melhorAlcoolRapido = razao <= 0.7;

  const temResultadoPreciso = pa > 0 && pg > 0 && cg > 0 && ca > 0;
  const custoKmGas = temResultadoPreciso ? pg / cg : 0;
  const custoKmAlc = temResultadoPreciso ? pa / ca : 0;
  const melhorAlcoolPreciso = custoKmAlc < custoKmGas;
  const economiaPorKm = Math.abs(custoKmGas - custoKmAlc);
  const economiaPct = temResultadoPreciso
    ? (economiaPorKm / Math.max(custoKmGas, custoKmAlc)) * 100
    : 0;

  const temKm = kmVal > 0 && temResultadoPreciso;
  const custoTotalGas = temKm ? kmVal * custoKmGas : 0;
  const custoTotalAlc = temKm ? kmVal * custoKmAlc : 0;
  const economiaTotal = Math.abs(custoTotalGas - custoTotalAlc);

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg";
  const toggleClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${active ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

  return (
    <ToolPage title="Calculadora: Alcool ou Gasolina?" description="Descubra qual combustivel e mais vantajoso para o seu bolso. A calculadora usa a regra dos 70%: se o preco do alcool for ate 70% do preco da gasolina, compensa abastecer com alcool." accent="emerald" icon="⛽" slug="calculadora-combustivel">

      {/* ── Mode Toggle ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setModo("rapido")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            modo === "rapido"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
          }`}
        >
          Comparacao rapida
        </button>
        <button onClick={() => setModo("preciso")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            modo === "preciso"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
          }`}
        >
          Calculo preciso
        </button>
      </div>

      {/* ── MODO 1: Comparação Rápida ── */}
      {modo === "rapido" && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <p className="text-sm text-gray-500 mb-4">
              Regra dos 70%: se o preco do alcool for ate 70% da gasolina, compensa abastecer com alcool.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="rapido-alcool" className="block text-sm font-medium mb-1 text-gray-800">Preco do Alcool (R$/litro)</label>
                <input id="rapido-alcool" type="number" step="0.01" value={precoAlcool}
                  onChange={(e) => setPrecoAlcool(e.target.value)}
                  placeholder="Ex: 3.89" className={inputClass} />
              </div>
              <div>
                <label htmlFor="rapido-gasolina" className="block text-sm font-medium mb-1 text-gray-800">Preco da Gasolina (R$/litro)</label>
                <input id="rapido-gasolina" type="number" step="0.01" value={precoGasolina}
                  onChange={(e) => setPrecoGasolina(e.target.value)}
                  placeholder="Ex: 5.79" className={inputClass} />
              </div>
            </div>

            {temResultadoRapido && (
              <div className={`rounded-xl p-6 text-center ${melhorAlcoolRapido ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
                <p className="text-lg mb-2">
                  Razao alcool/gasolina: <span className="font-bold">{(razao * 100).toFixed(1)}%</span>
                </p>
                <p className={`text-3xl font-bold ${melhorAlcoolRapido ? "text-green-700" : "text-blue-700"}`}>
                  {melhorAlcoolRapido ? "Abasteca com ALCOOL!" : "Abasteca com GASOLINA!"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {melhorAlcoolRapido
                    ? `O alcool esta ${(razao * 100).toFixed(1)}% do preco da gasolina (abaixo de 70%), portanto e mais economico.`
                    : `O alcool esta ${(razao * 100).toFixed(1)}% do preco da gasolina (acima de 70%), portanto a gasolina compensa mais.`}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Tabela de Referencia Rapida</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Gasolina (R$)</th>
                    <th className="px-4 py-2 text-right">Alcool compensa ate (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {[4.5, 5.0, 5.5, 5.79, 6.0, 6.5, 7.0].map((g) => (
                    <tr key={g} className="border-t border-gray-100">
                      <td className="px-4 py-2">R$ {g.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-medium text-green-700">
                        R$ {(g * 0.7).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── MODO 2: Cálculo Preciso ── */}
      {modo === "preciso" && (
        <div className="bg-white rounded-xl border-2 border-emerald-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Calculo preciso com consumo real</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Informe os precos e o consumo do seu veiculo para calcular o custo exato por quilometro
            </p>
          </div>

          <div className="p-6">
            {/* Prices */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="preciso-alcool" className="block text-sm font-medium mb-1 text-gray-800">Preco do Alcool (R$/litro)</label>
                <input id="preciso-alcool" type="number" step="0.01" value={precoAlcool}
                  onChange={(e) => setPrecoAlcool(e.target.value)}
                  placeholder="Ex: 3.89" className={inputClass} />
              </div>
              <div>
                <label htmlFor="preciso-gasolina" className="block text-sm font-medium mb-1 text-gray-800">Preco da Gasolina (R$/litro)</label>
                <input id="preciso-gasolina" type="number" step="0.01" value={precoGasolina}
                  onChange={(e) => setPrecoGasolina(e.target.value)}
                  placeholder="Ex: 5.79" className={inputClass} />
              </div>
            </div>

            {/* Consumption */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="consumo-gas" className="block text-sm font-medium mb-1 text-gray-800">Consumo com Gasolina (km/l)</label>
                <input id="consumo-gas" type="number" step="0.1" value={consumoGasolina}
                  onChange={(e) => setConsumoGasolina(e.target.value)}
                  placeholder="Ex: 12.0" className={inputClass} />
              </div>
              <div>
                <label htmlFor="consumo-alc" className="block text-sm font-medium mb-1 text-gray-800">Consumo com Alcool (km/l)</label>
                <input id="consumo-alc" type="number" step="0.1" value={consumoAlcool}
                  onChange={(e) => setConsumoAlcool(e.target.value)}
                  placeholder="Ex: 8.5" className={inputClass} />
              </div>
            </div>

            {/* Kilometers */}
            <div className="mb-6">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label htmlFor="km-input" className="block text-sm font-medium mb-1 text-gray-800">
                    {tipoKm === "mensal" ? "Quilometragem mensal (km/mes)" : "Distancia da viagem (km)"}
                  </label>
                  <input id="km-input" type="number" step="1" value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder={tipoKm === "mensal" ? "Ex: 1000" : "Ex: 350"}
                    className={inputClass} />
                </div>
                <div className="flex gap-1 mb-0.5">
                  <button onClick={() => setTipoKm("mensal")} className={toggleClass(tipoKm === "mensal")}>Mensal</button>
                  <button onClick={() => setTipoKm("viagem")} className={toggleClass(tipoKm === "viagem")}>Viagem</button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Opcional. Sem quilometragem, o calculo mostra apenas o custo por km.</p>
            </div>

            {/* Results */}
            {temResultadoPreciso && (
              <div className="space-y-4">
                {/* Comparison table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase"></th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase">Gasolina</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase">Alcool</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100">
                        <td className="px-4 py-2 font-medium text-gray-700">Preco/litro</td>
                        <td className="px-4 py-2 text-right">R$ {formatReal(pg)}</td>
                        <td className="px-4 py-2 text-right">R$ {formatReal(pa)}</td>
                      </tr>
                      <tr className="border-t border-gray-100">
                        <td className="px-4 py-2 font-medium text-gray-700">Consumo</td>
                        <td className="px-4 py-2 text-right">{cg.toFixed(1)} km/l</td>
                        <td className="px-4 py-2 text-right">{ca.toFixed(1)} km/l</td>
                      </tr>
                      <tr className="border-t border-gray-100 bg-gray-50">
                        <td className="px-4 py-2 font-bold text-gray-900">Custo por km</td>
                        <td className={`px-4 py-2 text-right font-bold ${!melhorAlcoolPreciso ? "text-emerald-700" : "text-gray-700"}`}>
                          R$ {custoKmGas.toFixed(4)}
                        </td>
                        <td className={`px-4 py-2 text-right font-bold ${melhorAlcoolPreciso ? "text-emerald-700" : "text-gray-700"}`}>
                          R$ {custoKmAlc.toFixed(4)}
                        </td>
                      </tr>
                      {temKm && (
                        <>
                          <tr className="border-t border-gray-100">
                            <td className="px-4 py-2 font-medium text-gray-700">
                              Custo {tipoKm === "mensal" ? "mensal" : "da viagem"}
                            </td>
                            <td className="px-4 py-2 text-right">R$ {formatReal(custoTotalGas)}</td>
                            <td className="px-4 py-2 text-right">R$ {formatReal(custoTotalAlc)}</td>
                          </tr>
                          {tipoKm === "mensal" && (
                            <tr className="border-t border-gray-100">
                              <td className="px-4 py-2 font-medium text-gray-700">Custo anual</td>
                              <td className="px-4 py-2 text-right">R$ {formatReal(custoTotalGas * 12)}</td>
                              <td className="px-4 py-2 text-right">R$ {formatReal(custoTotalAlc * 12)}</td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Recommendation */}
                <div className={`rounded-xl p-5 ${melhorAlcoolPreciso ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
                  <p className={`text-2xl font-bold text-center ${melhorAlcoolPreciso ? "text-green-700" : "text-blue-700"}`}>
                    {melhorAlcoolPreciso ? "Alcool e mais economico" : "Gasolina e mais economica"}
                  </p>
                  <div className="mt-3 text-center space-y-1">
                    <p className="text-sm text-gray-700">
                      Economia de <strong>R$ {economiaPorKm.toFixed(4)}</strong> por km ({economiaPct.toFixed(1)}%)
                    </p>
                    {temKm && (
                      <>
                        <p className="text-sm text-gray-700">
                          Economia {tipoKm === "mensal" ? "mensal" : "na viagem"}: <strong>R$ {formatReal(economiaTotal)}</strong>
                        </p>
                        {tipoKm === "mensal" && (
                          <p className="text-sm font-semibold text-gray-800">
                            Economia anual estimada: R$ {formatReal(economiaTotal * 12)}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Calculo baseado no consumo informado. O consumo real varia conforme trajeto, manutencao e estilo de direcao.
                  </p>
                </div>
              </div>
            )}

            {!temResultadoPreciso && pa > 0 && pg > 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Informe o consumo do veiculo com gasolina e com alcool para ver o resultado.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── EDITORIAL CONTENT ── */}
      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar a Calculadora de Combustivel</h2>
          <p className="mb-3">
            A calculadora de alcool ou gasolina oferece dois modos de analise:
          </p>
          <div className="mb-4">
            <p className="font-medium text-gray-900 mb-1">Comparacao rapida (regra dos 70%)</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Passo 1:</strong> Informe o preco atual do litro do alcool (etanol) no primeiro campo. Voce encontra esse valor nos postos de combustivel ou em aplicativos como Waze e Google Maps.</li>
              <li><strong>Passo 2:</strong> Informe o preco atual do litro da gasolina no segundo campo.</li>
              <li><strong>Passo 3:</strong> O resultado aparece automaticamente logo abaixo, indicando qual combustivel e mais vantajoso para o seu bolso naquele momento.</li>
            </ul>
          </div>
          <div className="mb-3">
            <p className="font-medium text-gray-900 mb-1">Calculo preciso (com consumo real)</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Passo 1:</strong> Informe os precos do alcool e da gasolina.</li>
              <li><strong>Passo 2:</strong> Informe o consumo do seu veiculo com cada combustivel (em km/l). Voce pode encontrar essa informacao no manual do proprietario, no computador de bordo ou medindo na pratica.</li>
              <li><strong>Passo 3:</strong> Opcionalmente, informe a quilometragem mensal ou a distancia de uma viagem para ver o custo total e a economia em reais.</li>
            </ul>
          </div>
          <p>
            A calculadora exibe a razao percentual entre os dois precos e mostra de forma clara se voce deve abastecer com alcool ou gasolina. A tabela de referencia rapida permite consultar valores comuns sem precisar digitar nada.
          </p>
          <p className="mt-2">
            Dica: salve esta pagina nos favoritos do celular para consultar rapidamente enquanto estiver no posto de combustivel.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda o Calculo: A Regra dos 70%</h2>
          <p className="mb-3">
            A regra dos 70% e baseada em um principio simples da engenharia automotiva: o motor flex, quando abastecido com etanol (alcool), consome em media 30% mais combustivel por quilometro rodado em comparacao com a gasolina. Isso acontece porque o etanol tem menor poder calorifico — ou seja, gera menos energia por litro queimado.
          </p>
          <p className="mb-3">
            A formula matematica e direta: divida o preco do litro do alcool pelo preco do litro da gasolina. Se o resultado for igual ou menor que 0,70 (70%), o alcool compensa mais. Se for maior que 0,70, a gasolina e a melhor escolha.
          </p>
          <p className="mb-3">
            <strong>Formula:</strong> Razao = Preco do Alcool / Preco da Gasolina
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Se a razao for <strong>menor ou igual a 0,70</strong> → abasteca com alcool</li>
            <li>Se a razao for <strong>maior que 0,70</strong> → abasteca com gasolina</li>
          </ul>
          <p className="mb-3">
            E importante entender que 70% e uma referencia estatistica baseada na media dos veiculos flex brasileiros, nao uma constante universal. Cada veiculo tem sua propria relacao de eficiencia entre etanol e gasolina. Alguns modelos mais novos com motores otimizados para etanol podem ter um ponto de corte de 72% ou ate 75%, enquanto veiculos mais antigos podem ficar em 65-68%. O valor exato depende da calibracao do motor, da tecnologia de injecao e do estado de manutencao do veiculo.
          </p>
          <p className="mb-3">
            Para descobrir o ponto de corte real do seu carro, o metodo mais confiavel e medir o consumo na pratica: encha o tanque com etanol, zere o hodometro, rode ate precisar reabastecer, anote os km percorridos e os litros abastecidos. Repita com gasolina nas mesmas condicoes (mesmo trajeto, mesmo estilo de direcao). Divida o consumo de gasolina (km/l) pelo consumo de etanol (km/l) e voce tera a proporcao real do seu veiculo.
          </p>
          <p>
            Fatores como manutencao do veiculo, pressao dos pneus, estilo de direcao, uso de ar-condicionado, carga transportada e tipo de percurso (cidade vs. estrada) tambem influenciam o consumo real. A regra dos 70% continua sendo a referencia mais pratica para a decisao rapida no posto, mas nao substitui a medicao personalizada.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A regra dos 70% funciona para todos os carros?</summary>
              <p className="px-4 pb-3 text-sm">A regra dos 70% e uma media que funciona bem para a maioria dos veiculos flex vendidos no Brasil. Porem, carros mais novos com motores otimizados podem ter eficiencia um pouco melhor com etanol, enquanto veiculos mais antigos podem consumir proporcionalmente mais. Se voce quiser uma resposta mais precisa para o seu carro especifico, faca o teste: encha o tanque com alcool, anote a quilometragem, e repita com gasolina. Compare os km/l de cada um.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">E verdade que o alcool e melhor para o motor?</summary>
              <p className="px-4 pb-3 text-sm">O etanol queima a uma temperatura mais baixa que a gasolina, o que pode ser benefico para a longevidade de alguns componentes do motor. Alem disso, o alcool tem propriedades detergentes que ajudam a manter o sistema de injecao mais limpo. Porem, em termos de desempenho, a gasolina geralmente oferece mais potencia por litro consumido.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">E ruim misturar alcool e gasolina no tanque?</summary>
              <p className="px-4 pb-3 text-sm">Nao, em veiculos flex nao ha problema nenhum em misturar os dois combustiveis. O sistema de injecao eletronica ajusta automaticamente a mistura ar-combustivel com base no sensor lambda. Voce pode alternar entre alcool e gasolina livremente a cada abastecimento.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Por que o alcool rende menos quilometros?</summary>
              <p className="px-4 pb-3 text-sm">O etanol possui menor poder calorifico que a gasolina (aproximadamente 6.300 kcal/litro contra 8.200 kcal/litro da gasolina). Isso significa que o motor precisa queimar mais etanol para gerar a mesma quantidade de energia. Na pratica, o consumo de etanol e cerca de 25% a 30% maior que o de gasolina.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">A regra muda para carros a GNV (gas natural)?</summary>
              <p className="px-4 pb-3 text-sm">Sim, a regra dos 70% se aplica exclusivamente a comparacao entre alcool e gasolina em veiculos flex. Para veiculos equipados com GNV, a analise e diferente e depende do preco do metro cubico de gas, do rendimento do veiculo com gas e do custo de manutencao do kit GNV. Essa calculadora nao cobre GNV.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Devo considerar apenas o preco ou tambem a qualidade do combustivel?</summary>
              <p className="px-4 pb-3 text-sm">Preco e o fator principal para a decisao no posto, mas a qualidade importa para a saude do motor. Postos com bandeira (Shell, Ipiranga, BR) geralmente oferecem combustivel com aditivos. Evite postos com precos muito abaixo da media da regiao, pois podem indicar adulteracao do combustivel.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como descubro o consumo do meu veiculo?</summary>
              <p className="px-4 pb-3 text-sm">O metodo mais confiavel e medir na pratica: encha o tanque completamente, zere o hodometro parcial, rode normalmente ate precisar reabastecer e anote os km percorridos e os litros abastecidos. Divida km por litros e voce tera o consumo em km/l. Repita com cada combustivel nas mesmas condicoes de trajeto. Muitos veiculos tambem exibem o consumo medio no computador de bordo.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exemplos Praticos do Dia a Dia</h2>
          <p className="mb-3">
            Veja alguns cenarios reais para entender melhor como aplicar a regra dos 70%:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Exemplo 1:</strong> Alcool a R$ 3,89 e gasolina a R$ 5,79. Razao: 3,89 / 5,79 = 0,67 (67%). Como 67% e menor que 70%, o <strong>alcool compensa mais</strong>.</li>
            <li><strong>Exemplo 2:</strong> Alcool a R$ 4,29 e gasolina a R$ 5,49. Razao: 4,29 / 5,49 = 0,78 (78%). Como 78% e maior que 70%, a <strong>gasolina compensa mais</strong>.</li>
            <li><strong>Exemplo 3:</strong> Alcool a R$ 3,99 e gasolina a R$ 5,69. Razao: 3,99 / 5,69 = 0,70 (70%). Empate tecnico — nesse caso, a gasolina costuma ser ligeiramente melhor pela questao de autonomia e menos paradas no posto.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Muitas pessoas comparam apenas o preco por litro sem considerar o rendimento diferente. Alcool a R$ 3,99 parece muito mais barato que gasolina a R$ 5,79, mas lembre-se: voce vai precisar de mais litros de alcool para rodar a mesma distancia. A regra dos 70% ja considera essa diferenca de rendimento no calculo.
          </p>
          <p className="mt-2">
            <strong>Dica extra:</strong> Os precos de combustivel variam bastante entre postos da mesma cidade. Use aplicativos como Waze, Google Maps ou Precos de Combustiveis (ANP) para encontrar os melhores precos na sua regiao antes de abastecer.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Custo por Quilometro: a Conta Completa</h2>
          <p className="mb-3">
            A regra dos 70% compara precos por litro, mas a conta mais precisa e o <strong>custo por quilometro rodado</strong>. Essa metrica considera o consumo real do seu veiculo e mostra quanto voce gasta para cada km percorrido com cada combustivel. Voce pode fazer esse calculo diretamente no modo <strong>Calculo preciso</strong> acima.
          </p>
          <p className="mb-3">
            <strong>Formula:</strong> Custo por km = Preco do litro / Consumo (km/l)
          </p>
          <p className="mb-3">
            <strong>Exemplo completo:</strong> Suponha que seu carro faz 12 km/l com gasolina e 8,5 km/l com etanol. Com gasolina a R$ 5,79 e etanol a R$ 3,89:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Custo por km com gasolina: 5,79 / 12 = <strong>R$ 0,4825/km</strong></li>
            <li>Custo por km com etanol: 3,89 / 8,5 = <strong>R$ 0,4576/km</strong></li>
            <li>Neste caso, o etanol e mais economico em R$ 0,025 por km</li>
            <li>Em 1.000 km rodados, a economia seria de aproximadamente R$ 25</li>
          </ul>
          <p className="mb-3">
            Note que, neste exemplo, a razao preco etanol/gasolina e 67% (abaixo de 70%), o que confirma a indicacao da regra. A vantagem do custo por km e que ele mostra o valor exato da economia, nao apenas a direcao da decisao.
          </p>
          <p>
            Se voce nao sabe o consumo exato do seu veiculo, a regra dos 70% continua sendo a melhor referencia rapida. Quando a razao esta perto de 70% (entre 68% e 72%), o custo por km e a unica forma de desempatar com seguranca.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitacoes desta Calculadora</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>O modo de comparacao rapida utiliza a proporcao fixa de 70%. Para uma analise que considera o consumo real do seu veiculo, utilize o modo de calculo preciso.</li>
            <li>A regra dos 70% e uma media estatistica. Para veiculos com consumo muito diferente da media (utilitarios, esportivos, veiculos pesados), o ponto de corte pode variar.</li>
            <li>A calculadora nao cobre GNV (gas natural veicular), diesel ou combustiveis aditivados. Cada um desses requer uma analise de custo-beneficio propria.</li>
            <li>Precos de combustivel mudam diariamente. Os exemplos desta pagina usam valores ilustrativos; sempre consulte o preco real no posto antes de decidir.</li>
            <li>Qualidade do combustivel nao e considerada. Combustivel adulterado pode ter rendimento inferior ao esperado, distorcendo a comparacao.</li>
            <li>O consumo informado no modo preciso deve refletir condicoes reais de uso. Consumo na estrada e significativamente diferente do consumo na cidade.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
