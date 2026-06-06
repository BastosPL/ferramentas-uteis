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

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Modelo de contrato de prestacao de servico</h2>
        <p>
          Este gerador cria um modelo basico de contrato de prestacao de servico com as clausulas
          essenciais. Preencha os dados das partes e do servico para gerar um contrato personalizado.
          O modelo serve como base e pode ser adaptado conforme necessidade. Para contratos de
          maior complexidade, consulte um advogado.
        </p>
      </section>
    </ToolPage>
  );
}
