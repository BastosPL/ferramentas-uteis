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

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que e o PIX Copia e Cola?</h2>
        <p>
          O PIX Copia e Cola e um codigo de texto que contem todas as informacoes necessarias
          para realizar um pagamento via PIX. Funciona como alternativa ao QR Code — basta
          copiar o codigo e colar no aplicativo do banco para efetuar o pagamento.
        </p>

        <h2>O QR Code gerado aqui e seguro?</h2>
        <p>
          Sim. O codigo e gerado 100% no seu navegador seguindo o padrao EMV definido pelo
          Banco Central. Nenhum dado e enviado para servidores externos. Voce pode conferir
          o codigo gerado escaneando com o app do seu banco antes de compartilhar.
        </p>
      </section>
    </ToolPage>
  );
}
