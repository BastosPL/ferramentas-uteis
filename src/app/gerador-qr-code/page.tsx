"use client";

import { useState, useEffect, useRef } from "react";

export default function GeradorQRCode() {
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("url");
  const [url, setUrl] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ssid, setSsid] = useState("");
  const [senhaWifi, setSenhaWifi] = useState("");
  const [tamanho, setTamanho] = useState(256);
  const imgRef = useRef<HTMLImageElement>(null);

  const gerarConteudo = () => {
    switch (tipo) {
      case "url": return url || "";
      case "texto": return texto || "";
      case "whatsapp": return `https://wa.me/${telefone.replace(/\D/g, "")}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ""}`;
      case "wifi": return `WIFI:T:WPA;S:${ssid};P:${senhaWifi};;`;
      case "email": return `mailto:${texto}`;
      case "telefone": return `tel:${telefone}`;
      default: return texto;
    }
  };

  const conteudo = gerarConteudo();
  const qrUrl = conteudo
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}&data=${encodeURIComponent(conteudo)}`
    : "";

  const baixar = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const tipos = [
    { id: "url", label: "URL / Link" },
    { id: "texto", label: "Texto" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "wifi", label: "Wi-Fi" },
    { id: "email", label: "Email" },
    { id: "telefone", label: "Telefone" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Gerador de QR Code</h1>
      <p className="text-gray-600 mb-8">
        Crie QR Codes gratuitamente para links, textos, WhatsApp, Wi-Fi e mais.
        Baixe em PNG para usar onde quiser.
      </p>

      <div className="grid md:grid-cols-[1fr_auto] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {tipos.map((t) => (
              <button
                key={t.id}
                onClick={() => setTipo(t.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tipo === t.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tipo === "url" && (
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://exemplo.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )}
          {tipo === "texto" && (
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Digite seu texto aqui..." rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
          )}
          {tipo === "whatsapp" && (
            <div className="space-y-3">
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="5581999999999 (com DDD e codigo do pais)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Mensagem (opcional)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          {tipo === "wifi" && (
            <div className="space-y-3">
              <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Nome da rede (SSID)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={senhaWifi} onChange={(e) => setSenhaWifi(e.target.value)} placeholder="Senha do Wi-Fi" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          {tipo === "email" && (
            <input type="email" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="email@exemplo.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )}
          {tipo === "telefone" && (
            <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(81) 99999-9999" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Tamanho: {tamanho}px</label>
            <input type="range" min={128} max={512} step={64} value={tamanho} onChange={(e) => setTamanho(parseInt(e.target.value))} className="w-full accent-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-w-[280px]">
          {qrUrl ? (
            <>
              <img ref={imgRef} src={qrUrl} alt="QR Code gerado" width={tamanho} height={tamanho} className="rounded-lg mb-4" />
              <button onClick={baixar} className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                Baixar PNG
              </button>
            </>
          ) : (
            <div className="text-gray-400 text-center py-12">
              <p className="text-5xl mb-3">📱</p>
              <p>Preencha os campos para gerar o QR Code</p>
            </div>
          )}
        </div>
      </div>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que e um QR Code?</h2>
        <p>
          QR Code (Quick Response Code) e um codigo de barras bidimensional que pode ser
          lido por cameras de smartphones. Ele pode armazenar URLs, textos, dados de Wi-Fi,
          contatos e muito mais. Basta apontar a camera do celular para o codigo.
        </p>
      </section>
    </div>
  );
}
