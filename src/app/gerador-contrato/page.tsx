"use client";

import { useState } from "react";
import ToolPage from "../components/ToolPage";

export default function GeradorContrato() {
  const [contratante, setContratante] = useState({ nome: "", cpf: "", endereco: "" });
  const [contratado, setContratado] = useState({ nome: "", cpf: "", endereco: "" });
  const [servico, setServico] = useState({ descricao: "", valor: "", prazo: "", formaPagamento: "Pix" });
  const [gerado, setGerado] = useState(false);

  const dataHoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  const textoContrato = `CONTRATO DE PRESTACAO DE SERVICO

Pelo presente instrumento particular, as partes abaixo qualificadas:

CONTRATANTE:
Nome: ${contratante.nome || "_______________"}
CPF: ${contratante.cpf || "_______________"}
Endereco: ${contratante.endereco || "_______________"}

CONTRATADO(A):
Nome: ${contratado.nome || "_______________"}
CPF: ${contratado.cpf || "_______________"}
Endereco: ${contratado.endereco || "_______________"}

Tem entre si justo e acordado o presente contrato de prestacao de servico, mediante as seguintes clausulas:

CLAUSULA 1 - DO OBJETO
O presente contrato tem como objeto a prestacao dos seguintes servicos:
${servico.descricao || "_______________"}

CLAUSULA 2 - DO VALOR
O valor total pelos servicos prestados sera de R$ ${servico.valor || "_______________"} (${servico.valor ? valorPorExtenso(parseFloat(servico.valor)) : "_______________"}).

CLAUSULA 3 - DA FORMA DE PAGAMENTO
O pagamento sera realizado via ${servico.formaPagamento}.

CLAUSULA 4 - DO PRAZO
O prazo para execucao dos servicos sera de ${servico.prazo || "_______________"} dias uteis, contados a partir da assinatura deste contrato.

CLAUSULA 5 - DAS OBRIGACOES DO CONTRATADO
O CONTRATADO se compromete a:
a) Executar os servicos descritos na Clausula 1 com qualidade e dentro do prazo;
b) Manter sigilo sobre informacoes confidenciais do CONTRATANTE;
c) Comunicar imediatamente qualquer impedimento na execucao dos servicos.

CLAUSULA 6 - DAS OBRIGACOES DO CONTRATANTE
O CONTRATANTE se compromete a:
a) Fornecer as informacoes necessarias para a execucao dos servicos;
b) Efetuar o pagamento conforme acordado na Clausula 3;
c) Comunicar alteracoes no escopo com antecedencia minima de 5 dias uteis.

CLAUSULA 7 - DA RESCISAO
O presente contrato podera ser rescindido por qualquer das partes, mediante aviso previo de 15 dias, ficando a parte que rescindir responsavel por eventuais prejuizos causados.

CLAUSULA 8 - DO FORO
As partes elegem o foro da comarca do CONTRATANTE para dirimir quaisquer duvidas decorrentes deste contrato.

E por estarem de acordo, assinam o presente em duas vias de igual teor.

Local e data: _______________, ${dataHoje}


_________________________________
${contratante.nome || "CONTRATANTE"}


_________________________________
${contratado.nome || "CONTRATADO(A)"}
`;

  function valorPorExtenso(valor: number): string {
    if (!valor || isNaN(valor)) return "_______________";
    const inteiro = Math.floor(valor);
    const centavos = Math.round((valor - inteiro) * 100);
    const unidades = ["", "um", "dois", "tres", "quatro", "cinco", "seis", "sete", "oito", "nove"];
    const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

    function porExtenso(n: number): string {
      if (n === 0) return "zero";
      if (n === 100) return "cem";
      if (n >= 1000) return `${porExtenso(Math.floor(n / 1000))} mil${n % 1000 > 0 ? ` e ${porExtenso(n % 1000)}` : ""}`;
      if (n >= 100) return `${centenas[Math.floor(n / 100)]}${n % 100 > 0 ? ` e ${porExtenso(n % 100)}` : ""}`;
      if (n >= 20) return `${dezenas[Math.floor(n / 10)]}${n % 10 > 0 ? ` e ${unidades[n % 10]}` : ""}`;
      if (n >= 10) return teens[n - 10];
      return unidades[n];
    }

    let resultado = `${porExtenso(inteiro)} reais`;
    if (centavos > 0) resultado += ` e ${porExtenso(centavos)} centavos`;
    return resultado;
  }

  const copiar = async () => {
    await navigator.clipboard.writeText(textoContrato);
    setGerado(true);
    setTimeout(() => setGerado(false), 2000);
  };

  const baixarTXT = () => {
    const blob = new Blob([textoContrato], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrato-prestacao-servico.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPage
      title="Gerador de Contrato"
      description="Gere modelos de contrato de prestacao de servico prontos para usar. Preencha os dados e baixe gratuitamente."
      accent="rose"
      icon="📝"
      slug="gerador-contrato"
    >
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <strong>Aviso importante:</strong> Este modelo e uma referencia basica e pode nao atender as particularidades da contratacao. O documento nao substitui a analise de um advogado.
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Contratante</h2>
          <div className="space-y-3">
            <input type="text" value={contratante.nome} onChange={(e) => setContratante({ ...contratante, nome: e.target.value })} placeholder="Nome completo" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
            <input type="text" value={contratante.cpf} onChange={(e) => setContratante({ ...contratante, cpf: e.target.value })} placeholder="CPF ou CNPJ" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
            <input type="text" value={contratante.endereco} onChange={(e) => setContratante({ ...contratante, endereco: e.target.value })} placeholder="Endereco completo" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Contratado(a)</h2>
          <div className="space-y-3">
            <input type="text" value={contratado.nome} onChange={(e) => setContratado({ ...contratado, nome: e.target.value })} placeholder="Nome completo" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
            <input type="text" value={contratado.cpf} onChange={(e) => setContratado({ ...contratado, cpf: e.target.value })} placeholder="CPF ou CNPJ" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
            <input type="text" value={contratado.endereco} onChange={(e) => setContratado({ ...contratado, endereco: e.target.value })} placeholder="Endereco completo" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Detalhes do Servico</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-1">Descricao do Servico</label>
            <textarea value={servico.descricao} onChange={(e) => setServico({ ...servico, descricao: e.target.value })} placeholder="Descreva o servico a ser prestado..." rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Valor (R$)</label>
            <input type="number" value={servico.valor} onChange={(e) => setServico({ ...servico, valor: e.target.value })} placeholder="Ex: 5000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Prazo (dias uteis)</label>
            <input type="number" value={servico.prazo} onChange={(e) => setServico({ ...servico, prazo: e.target.value })} placeholder="Ex: 30" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Forma de Pagamento</label>
            <select value={servico.formaPagamento} onChange={(e) => setServico({ ...servico, formaPagamento: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
              <option>Pix</option>
              <option>Transferencia bancaria</option>
              <option>Boleto bancario</option>
              <option>Cartao de credito</option>
              <option>Dinheiro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-700">
        Este modelo e uma referencia basica. O documento nao substitui a analise de um advogado para garantir adequacao ao seu caso especifico.
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Pre-visualizacao</h2>
          <div className="flex gap-2">
            <button onClick={copiar} className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
              {gerado ? "Copiado!" : "Copiar Texto"}
            </button>
            <button onClick={baixarTXT} className="bg-rose-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-rose-700 cursor-pointer">
              Baixar TXT
            </button>
          </div>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-white rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
          {textoContrato}
        </pre>
      </div>

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto mt-16 space-y-12 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador de Contrato</h2>
          <p className="mb-3">Criar um contrato de prestacao de servico nunca foi tao simples. Siga o passo a passo abaixo para gerar um documento completo em poucos minutos:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Preencha os dados do contratante:</strong> Informe o nome completo, CPF ou CNPJ e endereco de quem esta contratando o servico. Esses dados aparecerao na qualificacao das partes.</li>
            <li><strong>Preencha os dados do contratado:</strong> Da mesma forma, insira as informacoes de quem vai prestar o servico. Se for pessoa juridica, use o CNPJ.</li>
            <li><strong>Descreva o servico:</strong> No campo de descricao, detalhe exatamente o que sera feito. Quanto mais especifico, melhor para ambas as partes.</li>
            <li><strong>Defina valor, prazo e forma de pagamento:</strong> Insira o valor total em reais (o sistema converte para extenso automaticamente), o prazo em dias uteis e escolha a forma de pagamento.</li>
            <li><strong>Revise a pre-visualizacao:</strong> O contrato e gerado em tempo real. Leia todas as clausulas antes de finalizar.</li>
            <li><strong>Exporte:</strong> Copie o texto para a area de transferencia ou baixe como arquivo TXT. Voce pode colar em um editor de texto para formatar e imprimir.</li>
          </ol>
          <p className="mt-3">Os campos que nao forem preenchidos aparecem como linhas em branco no contrato, permitindo preenchimento manual apos impressao.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entenda as Clausulas do Contrato</h2>
          <p className="mb-3">O modelo de contrato gerado contem 8 clausulas essenciais, cada uma com uma funcao especifica na protecao das partes envolvidas:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Clausula 1 — Do Objeto:</strong> Define exatamente o que sera feito. E a clausula mais importante e deve ser a mais detalhada possivel para evitar ambiguidades.</li>
            <li><strong>Clausula 2 — Do Valor:</strong> Estabelece o preco total do servico, incluindo o valor por extenso para evitar fraudes. O sistema converte automaticamente numeros em texto.</li>
            <li><strong>Clausula 3 — Da Forma de Pagamento:</strong> Especifica como o pagamento sera realizado (Pix, transferencia, boleto, cartao ou dinheiro).</li>
            <li><strong>Clausula 4 — Do Prazo:</strong> Define o periodo para execucao do servico em dias uteis, contados a partir da assinatura.</li>
            <li><strong>Clausula 5 — Obrigacoes do Contratado:</strong> Lista os compromissos de quem presta o servico, incluindo qualidade, sigilo e comunicacao.</li>
            <li><strong>Clausula 6 — Obrigacoes do Contratante:</strong> Estabelece os deveres de quem contrata, como fornecer informacoes e efetuar pagamentos.</li>
            <li><strong>Clausula 7 — Da Rescisao:</strong> Define as condicoes para cancelamento do contrato por qualquer das partes, com aviso previo de 15 dias.</li>
            <li><strong>Clausula 8 — Do Foro:</strong> Determina a comarca responsavel por resolver disputas judiciais relacionadas ao contrato.</li>
          </ul>
          <p className="mt-3">O modelo segue as diretrizes gerais do Codigo Civil Brasileiro (Lei 10.406/2002) para contratos de prestacao de servico. Para situacoes mais complexas, recomendamos consultoria juridica.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Este contrato tem validade juridica?</summary>
              <p className="mt-2">Sim, contratos particulares tem validade juridica no Brasil conforme o Codigo Civil. Nao e obrigatorio reconhecer firma em cartorio para que o contrato tenha validade. Porem, o reconhecimento de firma e o registro em cartorio aumentam a seguranca juridica e facilitam a comprovacao em caso de disputa.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso modificar as clausulas?</summary>
              <p className="mt-2">Sim. O modelo gerado serve como base e pode ser livremente adaptado. Ao baixar o arquivo TXT ou copiar o texto, voce pode editar, adicionar ou remover clausulas conforme a necessidade do seu caso especifico.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Serve para qualquer tipo de servico?</summary>
              <p className="mt-2">O modelo e voltado para prestacao de servicos em geral: freelancers, consultorias, servicos domesticos, manutencao, desenvolvimento de software, design, entre outros. Para servicos regulamentados (advocacia, medicina, engenharia), pode ser necessario incluir clausulas especificas da profissao.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Preciso de testemunhas?</summary>
              <p className="mt-2">Para contratos particulares, a lei brasileira exige duas testemunhas para que o documento tenha forca de titulo executivo extrajudicial (artigo 784 do CPC). Sem testemunhas, o contrato ainda e valido, mas a cobranca judicial seria por acao de cobranca comum, que e mais demorada.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso usar para pessoa juridica (CNPJ)?</summary>
              <p className="mt-2">Sim. O campo aceita tanto CPF quanto CNPJ. Se uma das partes for empresa, insira o CNPJ e o nome da empresa no campo de nome. Recomenda-se incluir tambem o nome do representante legal.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O valor por extenso e gerado automaticamente?</summary>
              <p className="mt-2">Sim. Ao informar o valor numerico, o sistema converte automaticamente para extenso em portugues, incluindo centavos. Isso e uma pratica padrao em contratos para evitar adulteracoes no valor.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Meus dados ficam salvos?</summary>
              <p className="mt-2">Nao. Todos os dados sao processados localmente no seu navegador. Nada e enviado para servidores externos. Quando voce fecha a pagina, todas as informacoes digitadas sao apagadas automaticamente.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Contratos de Servico</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Seja especifico na descricao:</strong> Em vez de &quot;servico de pintura&quot;, escreva &quot;pintura de 3 quartos e 1 sala com tinta acrilica fosca, incluindo preparacao da parede, duas demaos e limpeza final&quot;.</li>
            <li><strong>Defina entregas parciais:</strong> Para servicos longos, inclua marcos intermediarios. Isso protege ambas as partes e facilita o acompanhamento.</li>
            <li><strong>Guarde uma copia assinada:</strong> Imprima duas vias, ambas assinadas pelas duas partes. Cada parte fica com uma via original.</li>
            <li><strong>Pagamento parcelado:</strong> Se o pagamento for em parcelas, especifique as datas e valores de cada parcela na clausula de pagamento ou em um anexo.</li>
            <li><strong>Fotos e anexos:</strong> Para servicos como reformas ou manutencao, tire fotos do estado atual e anexe ao contrato como registro do &quot;antes&quot;.</li>
            <li><strong>Contrato digital:</strong> Voce pode assinar digitalmente usando plataformas como Gov.br ou certificado digital ICP-Brasil. Assinaturas digitais tem a mesma validade juridica que assinaturas fisicas.</li>
          </ul>
        </section>

      </div>

      <section className="mt-8 border-t border-gray-200 pt-6 max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
          Este modelo e uma referencia basica e pode nao atender as particularidades da contratacao. O documento nao substitui a analise de um advogado.
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
            <li>Codigo Civil Brasileiro (Lei 10.406/2002) — diretrizes para contratos de prestacao de servico</li>
            <li>CLT (Consolidacao das Leis do Trabalho) — referencia quando aplicavel a relacoes de trabalho</li>
          </ul>
          <p className="mt-2 text-gray-400">Ultima revisao: 12 de julho de 2026</p>
        </div>
      </section>
    </ToolPage>
  );
}
