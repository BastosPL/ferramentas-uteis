"use client";

import { useState, useCallback } from "react";
import ToolPage from "../components/ToolPage";

export default function GeradorDeSenha() {
  const [tamanho, setTamanho] = useState(16);
  const [usarMaiusculas, setUsarMaiusculas] = useState(true);
  const [usarMinusculas, setUsarMinusculas] = useState(true);
  const [usarNumeros, setUsarNumeros] = useState(true);
  const [usarSimbolos, setUsarSimbolos] = useState(true);
  const [senha, setSenha] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [historico, setHistorico] = useState<string[]>([]);

  const gerarSenha = useCallback(() => {
    let chars = "";
    if (usarMaiusculas) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (usarMinusculas) chars += "abcdefghijklmnopqrstuvwxyz";
    if (usarNumeros) chars += "0123456789";
    if (usarSimbolos) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setSenha("Selecione pelo menos uma opcao");
      return;
    }

    const array = new Uint32Array(tamanho);
    crypto.getRandomValues(array);
    const novaSenha = Array.from(array, (v) => chars[v % chars.length]).join("");
    setSenha(novaSenha);
    setCopiado(false);
    setHistorico((prev) => [novaSenha, ...prev.slice(0, 9)]);
  }, [tamanho, usarMaiusculas, usarMinusculas, usarNumeros, usarSimbolos]);

  const copiar = async () => {
    await navigator.clipboard.writeText(senha);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const calcularForca = (s: string) => {
    if (!s || s === "Selecione pelo menos uma opcao") return { label: "", cor: "", pct: 0 };
    let score = 0;
    if (s.length >= 8) score++;
    if (s.length >= 12) score++;
    if (s.length >= 16) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[a-z]/.test(s)) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;

    if (score <= 2) return { label: "Fraca", cor: "bg-red-500", pct: 25 };
    if (score <= 4) return { label: "Media", cor: "bg-yellow-500", pct: 50 };
    if (score <= 5) return { label: "Forte", cor: "bg-blue-500", pct: 75 };
    return { label: "Muito Forte", cor: "bg-green-500", pct: 100 };
  };

  const forca = calcularForca(senha);

  return (
    <ToolPage title="Gerador de Senha Segura" description="Gere senhas fortes e aleatorias usando criptografia do navegador. Nenhum dado e enviado para servidores. Sua senha e gerada 100% localmente." accent="green" icon="🔐" slug="gerador-de-senha">

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        {senha && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg break-all select-all">
                {senha}
              </div>
              <button
                onClick={copiar}
                className="bg-green-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-green-700 transition-colors shrink-0 cursor-pointer"
              >
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
            {forca.label && (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${forca.cor}`}
                    style={{ width: `${forca.pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{forca.label}</span>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Tamanho: <span className="text-green-600 font-bold">{tamanho}</span> caracteres
          </label>
          <input
            type="range"
            min={4}
            max={64}
            value={tamanho}
            onChange={(e) => setTamanho(parseInt(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Maiusculas (A-Z)", value: usarMaiusculas, set: setUsarMaiusculas },
            { label: "Minusculas (a-z)", value: usarMinusculas, set: setUsarMinusculas },
            { label: "Numeros (0-9)", value: usarNumeros, set: setUsarNumeros },
            { label: "Simbolos (!@#$)", value: usarSimbolos, set: setUsarSimbolos },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={opt.value}
                onChange={(e) => opt.set(e.target.checked)}
                className="w-4 h-4 accent-green-600"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={gerarSenha}
          className="w-full bg-green-600 text-white rounded-lg py-3 font-semibold hover:bg-green-700 transition-colors cursor-pointer"
        >
          Gerar Senha
        </button>
      </div>

      {historico.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">Historico de Senhas Geradas</h2>
          <div className="space-y-2">
            {historico.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-mono text-sm flex-1 break-all">{s}</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(s);
                  }}
                  className="text-green-600 text-xs hover:underline shrink-0 cursor-pointer"
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 max-w-4xl mx-auto space-y-10 text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar o Gerador de Senha</h2>
          <p className="mb-3">
            Gerar uma senha segura com nossa ferramenta leva apenas alguns segundos. Veja o passo a passo completo:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Escolha o tamanho:</strong> Use o controle deslizante para definir o comprimento da senha, de 4 a 64 caracteres. Recomendamos no minimo 12 caracteres para contas importantes e 16 ou mais para contas bancarias e e-mails principais.</li>
            <li><strong>Selecione os tipos de caracteres:</strong> Marque ou desmarque as opcoes de letras maiusculas (A-Z), minusculas (a-z), numeros (0-9) e simbolos (!@#$). Quanto mais tipos voce incluir, mais forte sera a senha gerada.</li>
            <li><strong>Clique em &quot;Gerar Senha&quot;:</strong> A senha sera criada instantaneamente usando criptografia do proprio navegador. Nenhum dado e enviado para servidores externos — tudo acontece localmente no seu dispositivo.</li>
            <li><strong>Copie a senha:</strong> Clique no botao &quot;Copiar&quot; para salvar a senha na area de transferencia. Use-a imediatamente no cadastro ou troca de senha do servico desejado.</li>
            <li><strong>Verifique a forca:</strong> O indicador de forca mostra se a senha e Fraca, Media, Forte ou Muito Forte. Ajuste o tamanho e os tipos de caracteres ate atingir o nivel desejado.</li>
            <li><strong>Consulte o historico:</strong> As ultimas 10 senhas geradas ficam salvas temporariamente na sessao para sua conveniencia. Ao fechar a pagina, o historico e apagado automaticamente por seguranca.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Funciona a Geracao de Senhas</h2>
          <p className="mb-3">
            Nosso gerador utiliza a <strong>API Web Crypto</strong> (crypto.getRandomValues), um recurso nativo dos navegadores modernos que fornece numeros criptograficamente seguros. Diferente de geradores que usam funcoes como Math.random() — que produzem sequencias previsiveis — a Web Crypto API utiliza fontes de entropia do sistema operacional para gerar valores verdadeiramente aleatorios.
          </p>
          <p className="mb-3">
            O processo funciona assim: primeiro, um array de numeros inteiros de 32 bits e preenchido com valores aleatorios pelo navegador. Depois, cada numero e mapeado para um caractere do conjunto selecionado (maiusculas, minusculas, numeros e simbolos). Esse metodo garante distribuicao uniforme, ou seja, cada caractere tem a mesma probabilidade de aparecer em qualquer posicao da senha.
          </p>
          <p className="mb-3">
            A forca de uma senha e medida pela sua <strong>entropia</strong>, calculada em bits. Uma senha de 16 caracteres usando todos os tipos de caracteres (maiusculas, minusculas, numeros e simbolos — totalizando cerca de 95 caracteres possiveis) tem aproximadamente 105 bits de entropia. Isso significa que um atacante precisaria testar, em media, 2^104 combinacoes para descobri-la, o que levaria bilhoes de anos mesmo com os computadores mais poderosos disponiveis hoje.
          </p>
          <p>
            Todo o processamento acontece exclusivamente no seu navegador. Nenhuma senha gerada e transmitida pela internet, armazenada em servidores ou registrada em logs. Ao fechar a aba, as senhas do historico sao descartadas permanentemente.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Qual o tamanho ideal de uma senha?</summary>
              <p className="px-4 pb-4 text-gray-600">O tamanho minimo recomendado por especialistas em seguranca e de 12 caracteres. Para contas criticas como e-mail principal, banco e redes sociais, use pelo menos 16 caracteres. Senhas com 20 ou mais caracteres sao consideradas extremamente seguras e praticamente impossiveis de quebrar com a tecnologia atual.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">As senhas geradas sao realmente seguras?</summary>
              <p className="px-4 pb-4 text-gray-600">Sim. Utilizamos a API Web Crypto do navegador, o mesmo padrao de criptografia usado por bancos e aplicativos de seguranca. Os numeros gerados sao criptograficamente aleatorios, tornando as senhas imprevisiveis. Alem disso, nenhuma senha sai do seu dispositivo — toda a geracao acontece localmente.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Devo usar a mesma senha em varios sites?</summary>
              <p className="px-4 pb-4 text-gray-600">Nunca. Se um site sofrer um vazamento de dados e voce usar a mesma senha em outros servicos, todas as suas contas ficam vulneraveis. Esse tipo de ataque e chamado de &quot;credential stuffing&quot; e e uma das formas mais comuns de invasao. Use uma senha unica para cada servico e um gerenciador de senhas para administra-las.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">O que e autenticacao em dois fatores (2FA)?</summary>
              <p className="px-4 pb-4 text-gray-600">A autenticacao em dois fatores (2FA) adiciona uma camada extra de seguranca alem da senha. Mesmo que alguem descubra sua senha, precisara de um segundo fator — como um codigo enviado por SMS, um app autenticador (Google Authenticator, Authy) ou uma chave fisica — para acessar sua conta. Ative o 2FA em todas as contas que oferecem esse recurso.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Posso usar palavras do dicionario na senha?</summary>
              <p className="px-4 pb-4 text-gray-600">Usar palavras comuns torna a senha vulneravel a ataques de dicionario, onde programas testam milhoes de palavras e combinacoes conhecidas. Se preferir senhas mais faceis de lembrar, use o metodo &quot;passphrase&quot;: combine 4 ou mais palavras aleatorias sem relacao entre si (ex: &quot;cadeira sol abacaxi nuvem&quot;). Esse metodo oferece boa seguranca e e mais facil de memorizar.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Com que frequencia devo trocar minhas senhas?</summary>
              <p className="px-4 pb-4 text-gray-600">A recomendacao atual de especialistas como o NIST (Instituto Nacional de Padroes e Tecnologia dos EUA) e de nao trocar senhas por rotina se elas forem fortes e unicas. Troque apenas se houver suspeita de comprometimento, se o servico comunicar um vazamento ou se a senha for fraca. Trocar com frequencia excessiva leva as pessoas a criar senhas mais fracas.</p>
            </details>
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">Meus dados ficam salvos em algum servidor?</summary>
              <p className="px-4 pb-4 text-gray-600">Nao. Absolutamente nenhum dado e enviado para servidores. A geracao da senha acontece inteiramente no seu navegador usando JavaScript e a API Web Crypto. O historico de senhas e mantido apenas na memoria da sessao atual e e apagado ao fechar a pagina. Nao usamos cookies, analytics ou qualquer rastreamento relacionado as senhas geradas.</p>
            </details>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas Praticas de Seguranca Digital</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Use um gerenciador de senhas:</strong> Ferramentas como Bitwarden (gratuito), 1Password ou KeePass armazenam todas as suas senhas de forma criptografada. Voce so precisa memorizar uma senha mestra forte.</li>
            <li><strong>Nunca compartilhe senhas por mensagem:</strong> Aplicativos de mensagem, e-mails e SMS nao sao canais seguros para enviar senhas. Se precisar compartilhar acesso, use recursos proprios do servico (como compartilhamento de pastas no Google Drive).</li>
            <li><strong>Cuidado com phishing:</strong> Antes de digitar sua senha em qualquer site, verifique se o endereco na barra do navegador e o correto. Sites falsos imitam paginas de bancos e redes sociais para roubar suas credenciais.</li>
            <li><strong>Verifique vazamentos:</strong> Sites como &quot;Have I Been Pwned&quot; permitem verificar se seu e-mail apareceu em vazamentos de dados conhecidos. Se aparecer, troque imediatamente as senhas dos servicos afetados.</li>
            <li><strong>Evite senhas obvias:</strong> Senhas como &quot;123456&quot;, &quot;senha123&quot;, datas de aniversario e nomes de familiares sao as primeiras tentativas de qualquer atacante. Use sempre senhas geradas aleatoriamente.</li>
          </ul>
        </div>
      </section>
    </ToolPage>
  );
}
