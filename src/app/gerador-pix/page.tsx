"use client";

import { useState, useRef, useEffect } from "react";
import ToolPage from "../components/ToolPage";

type TipoChave = "cpf" | "cnpj" | "email" | "telefone" | "aleatoria";

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id: string, value: string): string {
  return id + value.length.toString().padStart(2, "0") + value;
}

function gerarPayloadPix({
  chave,
  nome,
  cidade,
  valor,
  descricao,
}: {
  chave: string;
  nome: string;
  cidade: string;
  valor: string;
  descricao: string;
}): string {
  // Payload Format Indicator
  let payload = tlv("00", "01");
  // Merchant Account Info
  const gui = tlv("00", "br.gov.bcb.pix");
  const chaveField = tlv("01", chave);
  const descField = descricao ? tlv("02", descricao) : "";
  payload += tlv("26", gui + chaveField + descField);
  // Merchant Category Code
  payload += tlv("52", "0000");
  // Transaction Currency (BRL)
  payload += tlv("53", "986");
  // Transaction Amount
  if (valor && parseFloat(valor) > 0) {
    payload += tlv("54", parseFloat(valor).toFixed(2));
  }
  // Country Code
  payload += tlv("58", "BR");
  // Merchant Name
  payload += tlv("59", nome.slice(0, 25));
  // Merchant City
  payload += tlv("60", cidade.slice(0, 15));
  // Additional Data (txid)
  payload += tlv("62", tlv("05", "***"));
  // CRC placeholder
  payload += "6304";
  // Calculate CRC16
  const checksum = crc16(payload);
  return payload + checksum;
}

export default function GeradorPix() {
  const [tipoChave, setTipoChave] = useState<TipoChave>("cpf");
  const [chave, setChave] = useState("");
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [payload, setPayload] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function validar(): boolean {
    if (!chave.trim()) { setErro("Informe a chave PIX."); return false; }
    if (!nome.trim()) { setErro("Informe o nome do recebedor."); return false; }
    if (!cidade.trim()) { setErro("Informe a cidade."); return false; }

    const num = chave.replace(/\D/g, "");
    if (tipoChave === "cpf" && num.length !== 11) { setErro("CPF deve ter 11 digitos."); return false; }
    if (tipoChave === "cnpj" && num.length !== 14) { setErro("CNPJ deve ter 14 digitos."); return false; }
    if (tipoChave === "telefone" && (num.length < 11 || num.length > 13)) { setErro("Telefone invalido. Use +55DDDNUMERO."); return false; }
    if (tipoChave === "email" && !chave.includes("@")) { setErro("Email invalido."); return false; }

    setErro("");
    return true;
  }

  function gerar() {
    if (!validar()) return;

    let chaveFormatada = chave.trim();
    if (tipoChave === "cpf" || tipoChave === "cnpj") {
      chaveFormatada = chaveFormatada.replace(/\D/g, "");
    }
    if (tipoChave === "telefone") {
      chaveFormatada = chaveFormatada.replace(/\D/g, "");
      if (!chaveFormatada.startsWith("+")) chaveFormatada = "+55" + chaveFormatada;
    }

    const p = gerarPayloadPix({
      chave: chaveFormatada,
      nome: nome.trim().toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
      cidade: cidade.trim().toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
      valor: valor || "0",
      descricao: descricao.trim().normalize("NFD").replace(/[̀-ͯ]/g, ""),
    });
    setPayload(p);
    setCopiado(false);
  }

  // Draw QR Code using canvas
  useEffect(() => {
    if (!payload || !canvasRef.current) return;

    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvasRef.current, payload, {
          width: 300,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
      } catch {
        // QR code generation failed
      }
    })();
  }, [payload]);

  function copiarPayload() {
    navigator.clipboard.writeText(payload);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  function baixarQR() {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "qr-code-pix.png";
    a.click();
  }

  const placeholders: Record<TipoChave, string> = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
    email: "seu@email.com",
    telefone: "+5581999999999",
    aleatoria: "Cole sua chave aleatoria",
  };

  return (
    <ToolPage
      title="Gerador de QR Code PIX"
      description="Gere QR Code PIX para receber pagamentos. Crie codigo PIX copia e cola instantaneamente."
      accent="teal"
      icon="💲"
      slug="gerador-pix"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do PIX</h2>

        {/* Tipo de chave */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de chave</label>
          <div className="flex flex-wrap gap-2">
            {([
              ["cpf", "CPF"],
              ["cnpj", "CNPJ"],
              ["email", "Email"],
              ["telefone", "Telefone"],
              ["aleatoria", "Chave aleatoria"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTipoChave(key); setChave(""); setPayload(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                  tipoChave === key
                    ? "bg-teal-100 text-teal-700 border border-teal-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX *</label>
            <input
              type="text"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              placeholder={placeholders[tipoChave]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00 (opcional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do recebedor *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Joao da Silva"
              maxLength={25}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Recife"
              maxLength={15}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descricao (opcional)</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pagamento servico"
            maxLength={50}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        <button
          onClick={gerar}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 cursor-pointer transition-colors"
        >
          Gerar QR Code PIX
        </button>
      </div>

      {/* Result */}
      {payload && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seu QR Code PIX</h2>

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <canvas ref={canvasRef} />
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={baixarQR}
                className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 cursor-pointer text-sm"
              >
                ⬇ Baixar QR Code
              </button>
              <button
                onClick={copiarPayload}
                className={`px-5 py-2.5 rounded-lg font-medium cursor-pointer text-sm transition-all ${
                  copiado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {copiado ? "✅ Copiado!" : "📋 Copiar Copia e Cola"}
              </button>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">PIX Copia e Cola</p>
              <p className="text-xs text-gray-700 font-mono break-all select-all">{payload}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Como funciona?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">🔑</span>
            <h3 className="font-semibold text-sm mb-1">Informe sua chave</h3>
            <p className="text-xs text-gray-600">CPF, CNPJ, email, telefone ou chave aleatoria cadastrada no seu banco.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">📱</span>
            <h3 className="font-semibold text-sm mb-1">Gere o QR Code</h3>
            <p className="text-xs text-gray-600">O codigo e gerado instantaneamente seguindo o padrao do Banco Central (EMV).</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-2xl block mb-2">💰</span>
            <h3 className="font-semibold text-sm mb-1">Receba pagamentos</h3>
            <p className="text-xs text-gray-600">Compartilhe o QR Code ou o codigo copia e cola com quem vai pagar.</p>
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto mt-16 space-y-12 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador de QR Code PIX</h2>
          <p className="mb-3">Gerar um QR Code PIX e rapido e gratuito. Siga o passo a passo para criar seu codigo de pagamento em segundos:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Escolha o tipo de chave:</strong> Selecione entre CPF, CNPJ, Email, Telefone ou Chave Aleatoria. Use a mesma chave cadastrada no seu banco.</li>
            <li><strong>Informe a chave PIX:</strong> Digite sua chave exatamente como esta cadastrada. Para CPF e CNPJ, pode digitar com ou sem pontos — o sistema formata automaticamente.</li>
            <li><strong>Preencha nome e cidade:</strong> Esses campos sao obrigatorios pelo padrao do Banco Central. O nome pode ter ate 25 caracteres e a cidade ate 15.</li>
            <li><strong>Valor (opcional):</strong> Se quiser definir um valor fixo para a cobranca, preencha o campo. Se deixar vazio ou zero, quem pagar pode escolher o valor.</li>
            <li><strong>Descricao (opcional):</strong> Adicione uma descricao curta como &quot;Pagamento servico&quot; ou &quot;Venda produto&quot; para identificar a transacao.</li>
            <li><strong>Clique em &quot;Gerar QR Code PIX&quot;:</strong> O QR Code e o codigo Copia e Cola sao gerados instantaneamente.</li>
            <li><strong>Compartilhe:</strong> Baixe a imagem do QR Code para enviar por WhatsApp ou redes sociais, ou copie o codigo Copia e Cola para enviar por texto.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona o QR Code PIX</h2>
          <p className="mb-3">O QR Code PIX segue o padrao EMV (Europay, Mastercard e Visa) definido pelo Banco Central do Brasil. O processo de geracao envolve varias etapas tecnicas:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Payload EMV:</strong> Os dados sao organizados em campos TLV (Tag-Length-Value), onde cada informacao recebe um identificador, o tamanho e o valor. Por exemplo, o campo 26 contem as informacoes do recebedor.</li>
            <li><strong>GUI do PIX:</strong> O campo de identificacao do arranjo de pagamento usa o valor &quot;br.gov.bcb.pix&quot;, que identifica o sistema PIX do Banco Central.</li>
            <li><strong>CRC16:</strong> Um codigo de verificacao (checksum) e calculado sobre todo o payload usando o algoritmo CRC-CCITT. Isso garante que o codigo nao foi alterado ou corrompido.</li>
            <li><strong>Codigo de moeda:</strong> O campo 53 contem o codigo &quot;986&quot;, que identifica o Real Brasileiro (BRL) no padrao ISO 4217.</li>
            <li><strong>Geracao do QR Code:</strong> O payload em texto e convertido em uma imagem QR Code usando o padrao ISO/IEC 18004, com nivel de correcao de erro &quot;M&quot; (recupera ate 15% de dados danificados).</li>
          </ul>
          <p className="mt-3">Todo o processamento acontece no seu navegador. Nenhuma informacao e enviada para servidores externos, garantindo total privacidade dos seus dados bancarios.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O QR Code gerado aqui e seguro?</summary>
              <p className="mt-2">Sim. O codigo e gerado 100% no seu navegador seguindo o padrao EMV oficial do Banco Central. Nenhum dado e enviado para servidores. Voce pode conferir o codigo escaneando com o app do seu banco antes de compartilhar.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O que e o PIX Copia e Cola?</summary>
              <p className="mt-2">E um codigo de texto que contem todas as informacoes do pagamento PIX. Funciona como alternativa ao QR Code — o pagador copia o codigo e cola no aplicativo do banco. E util quando nao e possivel escanear o QR Code, como em mensagens de texto ou emails.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso usar para receber pagamentos no meu negocio?</summary>
              <p className="mt-2">Sim. Muitos autonomos, MEIs e pequenos negocios usam QR Code PIX para receber pagamentos. Voce pode imprimir o QR Code e colocar no balcao, enviar por WhatsApp para clientes ou incluir em notas e orcamentos.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">O QR Code tem validade?</summary>
              <p className="mt-2">QR Codes estaticos (sem valor definido ou com valor fixo) nao expiram. Eles continuam funcionando enquanto a chave PIX estiver ativa no banco. QR Codes dinamicos (gerados pelo banco com identificador unico) podem ter prazo de validade, mas essa ferramenta gera apenas codigos estaticos.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Preciso ter conta em algum banco especifico?</summary>
              <p className="mt-2">Nao. O PIX e um sistema universal do Banco Central que funciona com qualquer banco ou instituicao de pagamento. Basta ter uma chave PIX cadastrada em qualquer conta — banco tradicional, fintech ou carteira digital.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Posso gerar QR Code com valor aberto?</summary>
              <p className="mt-2">Sim. Basta deixar o campo de valor vazio ou com zero. Nesse caso, o pagador digita o valor no momento do pagamento. Isso e util para doacoes, gorjetas ou quando o valor varia.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Qual a diferenca entre QR Code estatico e dinamico?</summary>
              <p className="mt-2">O QR Code estatico (gerado aqui) pode ser reutilizado varias vezes e nao tem identificador de transacao unico. O QR Code dinamico e gerado pelo banco com um identificador unico para cada cobranca, permite rastreamento individual e pode ter data de vencimento. Para comercios com alto volume, o QR Code dinamico e mais adequado.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas para Usar o PIX</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>QR Code para outros fins:</strong> Este gerador cria exclusivamente QR Codes no padrao PIX (EMV). Se voce precisa de QR Codes para URLs, Wi-Fi, WhatsApp ou outros dados, use o <a href="/gerador-qr-code" className="text-emerald-600 hover:underline">Gerador de QR Code</a> generico.</li>
            <li><strong>Imprima em boa qualidade:</strong> Se for colocar o QR Code em balcao ou vitrine, imprima em alta resolucao. QR Codes borrados ou pequenos demais podem nao ser lidos pelos celulares.</li>
            <li><strong>Teste antes de compartilhar:</strong> Sempre escaneie o QR Code gerado com o app do seu banco para confirmar que os dados estao corretos antes de enviar para clientes.</li>
            <li><strong>Use chave aleatoria para mais seguranca:</strong> Se nao quer expor seu CPF ou telefone, cadastre uma chave aleatoria no banco e use-a no QR Code.</li>
            <li><strong>Inclua descricao:</strong> Adicionar uma descricao ajuda a identificar a origem dos pagamentos no extrato, especialmente se voce recebe muitas transferencias.</li>
            <li><strong>PIX para MEI:</strong> Se voce e MEI, use o CNPJ como chave PIX para separar recebimentos pessoais dos profissionais. Isso facilita a contabilidade.</li>
            <li><strong>Limite de transferencia:</strong> Cada banco define limites diarios para PIX. Consulte seu banco se precisar receber valores altos. O limite noturno (20h-6h) costuma ser mais restritivo.</li>
          </ul>
        </section>

      </div>
    </ToolPage>
  );
}
