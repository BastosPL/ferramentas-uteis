"use client";

import { useState, useEffect, useRef } from "react";
import ToolPage from "../components/ToolPage";

export default function GeradorQRCode() {
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("url");
  const [url, setUrl] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ssid, setSsid] = useState("");
  const [senhaWifi, setSenhaWifi] = useState("");
  const [tamanho, setTamanho] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState("");
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

  useEffect(() => {
    if (!conteudo) {
      setQrDataUrl("");
      return;
    }
    let cancelled = false;
    (async () => {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(conteudo, { width: tamanho, margin: 2 });
      if (!cancelled) setQrDataUrl(dataUrl);
    })();
    return () => { cancelled = true; };
  }, [conteudo, tamanho]);

  const baixar = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
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
    <ToolPage title="Gerador de QR Code" description="Crie QR Codes gratuitamente para links, textos, WhatsApp, Wi-Fi e mais. Baixe em PNG para usar onde quiser." accent="cyan" icon="📱" slug="gerador-qr-code">

      <div className="grid md:grid-cols-[1fr_auto] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {tipos.map((t) => (
              <button
                key={t.id}
                onClick={() => setTipo(t.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tipo === t.id ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tipo === "url" && (
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://exemplo.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          )}
          {tipo === "texto" && (
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Digite seu texto aqui..." rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y" />
          )}
          {tipo === "whatsapp" && (
            <div className="space-y-3">
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="5581999999999 (com DDD e codigo do pais)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <input type="text" value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Mensagem (opcional)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          )}
          {tipo === "wifi" && (
            <div className="space-y-3">
              <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Nome da rede (SSID)" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <input type="text" value={senhaWifi} onChange={(e) => setSenhaWifi(e.target.value)} placeholder="Senha do Wi-Fi" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          )}
          {tipo === "email" && (
            <input type="email" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="email@exemplo.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          )}
          {tipo === "telefone" && (
            <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(81) 99999-9999" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1 text-gray-800">Tamanho: {tamanho}px</label>
            <input type="range" min={128} max={512} step={64} value={tamanho} onChange={(e) => setTamanho(parseInt(e.target.value))} className="w-full accent-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-w-[280px]">
          {qrDataUrl ? (
            <>
              <img ref={imgRef} src={qrDataUrl} alt="QR Code gerado" width={tamanho} height={tamanho} className="rounded-lg mb-4" />
              <button onClick={baixar} className="bg-cyan-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-cyan-700 transition-colors cursor-pointer">
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

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador de QR Code</h2>
          <p className="mb-3">
            Criar um QR Code com nossa ferramenta e rapido e gratuito. Siga o passo a passo:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Passo 1 — Escolha o tipo:</strong> Selecione o tipo de conteudo que deseja codificar. As opcoes disponiveis sao: URL/Link, Texto livre, WhatsApp, Wi-Fi, Email e Telefone. Cada tipo possui campos especificos.</li>
            <li><strong>Passo 2 — Preencha os dados:</strong> Insira as informacoes no campo correspondente. Para URLs, digite o endereco completo (com https://). Para WhatsApp, informe o numero com codigo do pais e DDD (exemplo: 5581999999999). Para Wi-Fi, preencha o nome da rede e a senha.</li>
            <li><strong>Passo 3 — Ajuste o tamanho:</strong> Use o controle deslizante para definir o tamanho da imagem do QR Code, de 128px ate 512px. Tamanhos maiores sao ideais para impressao; menores funcionam bem para telas.</li>
            <li><strong>Passo 4 — Visualize e baixe:</strong> O QR Code e gerado automaticamente na area de visualizacao a direita. Quando estiver satisfeito, clique em &quot;Baixar PNG&quot; para salvar a imagem no seu dispositivo.</li>
          </ul>
          <p className="mt-3">
            O QR Code gerado pode ser usado em materiais impressos, sites, redes sociais, cartoes de visita, cardapios digitais e qualquer outro lugar onde voce deseje compartilhar informacoes de forma pratica.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona um QR Code</h2>
          <p className="mb-3">
            QR Code significa &quot;Quick Response Code&quot; (Codigo de Resposta Rapida). Foi inventado em 1994 pela empresa japonesa Denso Wave, originalmente para rastrear pecas automotivas. Diferente dos codigos de barras tradicionais que armazenam dados em uma unica dimensao (horizontal), o QR Code armazena informacoes em duas dimensoes (horizontal e vertical), o que permite guardar muito mais dados em um espaco menor.
          </p>
          <p className="mb-3">
            A estrutura de um QR Code inclui varios elementos tecnicos: os tres quadrados grandes nos cantos servem como pontos de alinhamento, permitindo que a camera identifique a orientacao e o tamanho do codigo. Os padroes menores dentro do codigo representam os dados codificados em formato binario, alem de informacoes de correcao de erros.
          </p>
          <p className="mb-3">
            O QR Code utiliza o algoritmo Reed-Solomon para correcao de erros, o que significa que mesmo se parte do codigo estiver danificada ou obstruida (ate 30% dependendo do nivel de correcao), ele ainda pode ser lido corretamente. Existem quatro niveis de correcao: L (7%), M (15%), Q (25%) e H (30%).
          </p>
          <p>
            Nossa ferramenta gera os QR Codes inteiramente no seu navegador, sem enviar nenhum dado para servidores externos. A imagem e criada no formato PNG, compativel com praticamente todos os dispositivos e softwares de edicao. Seus dados (incluindo senhas de Wi-Fi) permanecem 100% no seu dispositivo.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O QR Code gerado expira?</summary>
              <p className="px-4 pb-3 text-sm">Nao. QR Codes estaticos (como os gerados aqui) nunca expiram. Eles simplesmente codificam uma informacao fixa na imagem. Desde que a informacao original continue valida (o link ainda funcione, o numero de WhatsApp esteja ativo, etc.), o QR Code funcionara para sempre.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual a diferenca entre QR Code estatico e dinamico?</summary>
              <p className="px-4 pb-3 text-sm">O QR Code estatico (gerado aqui) contem a informacao diretamente no padrao visual. Uma vez criado, nao pode ser alterado. O QR Code dinamico contem um link intermediario que redireciona para o destino final, permitindo alterar o destino sem mudar a imagem. QR Codes dinamicos geralmente sao pagos.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso usar o QR Code para fins comerciais?</summary>
              <p className="px-4 pb-3 text-sm">Sim, absolutamente. Os QR Codes gerados sao livres para uso pessoal e comercial. Voce pode imprimi-los em embalagens, cardapios, cartoes de visita, panfletos, banners e qualquer material de marketing sem nenhuma restricao.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual tamanho devo escolher para impressao?</summary>
              <p className="px-4 pb-3 text-sm">Para impressao em papel, recomendamos o tamanho maximo de 512px. O tamanho minimo impresso do QR Code deve ser de pelo menos 2cm x 2cm para garantir a leitura por cameras de celular. Para cartazes e banners grandes, o QR Code deve ter pelo menos 5cm x 5cm. Sempre teste a leitura antes de imprimir em grande quantidade.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Como funciona o QR Code de Wi-Fi?</summary>
              <p className="px-4 pb-3 text-sm">O QR Code de Wi-Fi codifica o nome da rede (SSID) e a senha em um formato padrao. Quando alguem escaneia o codigo com a camera do celular, o dispositivo oferece automaticamente a opcao de conectar a rede sem precisar digitar a senha manualmente. Funciona em Android e iOS.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O QR Code de WhatsApp funciona em qualquer celular?</summary>
              <p className="px-4 pb-3 text-sm">Sim, desde que o celular tenha o WhatsApp instalado. O QR Code gera um link wa.me que abre automaticamente uma conversa com o numero informado. Voce pode incluir uma mensagem predefinida que ja aparecera no campo de texto, facilitando o contato para clientes.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Preciso de internet para ler um QR Code?</summary>
              <p className="px-4 pb-3 text-sm">Para ler (decodificar) o QR Code, nao. A camera do celular faz isso offline. Porem, se o conteudo do QR Code for um link de internet, voce precisara de conexao para acessar o site. QR Codes de texto, contato ou Wi-Fi funcionam completamente sem internet.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas e Usos Criativos</h2>
          <p className="mb-3">
            O QR Code e uma das ferramentas mais versateis do marketing digital e do dia a dia. Veja algumas ideias de uso:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cardapio digital:</strong> Restaurantes podem criar um QR Code com o link do cardapio online, eliminando a necessidade de cardapios fisicos e facilitando atualizacoes.</li>
            <li><strong>Cartao de visita:</strong> Adicione um QR Code no seu cartao que direcione para o seu LinkedIn, portfolio ou site profissional.</li>
            <li><strong>Wi-Fi para visitantes:</strong> Cole um QR Code de Wi-Fi na recepcao do escritorio ou na sala de estar. Visitantes conectam sem precisar perguntar a senha.</li>
            <li><strong>Pagamentos e Pix:</strong> Muitas lojas usam QR Codes para receber pagamentos via Pix. O QR Code do Pix segue o padrao EMV do Banco Central — para gerar um com sua chave PIX e valor definido, use o <a href="/gerador-pix" className="text-emerald-600 hover:underline">Gerador de QR Code PIX</a>.</li>
            <li><strong>Eventos e convites:</strong> Inclua um QR Code no convite que direcione para o mapa do local, confirmacao de presenca ou informacoes do evento.</li>
          </ul>
          <p className="mt-3">
            <strong>Erro comum:</strong> Gerar QR Codes muito pequenos para impressao. Se o QR Code for menor que 2cm impresso, muitas cameras terao dificuldade em le-lo, especialmente em condicoes de baixa iluminacao. Sempre teste antes de enviar para grafica.
          </p>
        </div>
      </section>
    </ToolPage>
  );
}
