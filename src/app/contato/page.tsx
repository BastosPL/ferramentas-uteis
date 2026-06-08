"use client";

import { useState } from "react";
import ClientOnly from "../components/ClientOnly";

export default function Contato() {
  const [copiado, setCopiado] = useState(false);

  function copiarEmail() {
    navigator.clipboard.writeText("contato@ferramentautil.com.br");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  return (
    <ClientOnly>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Fale Conosco</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <p className="text-blue-800 text-lg font-medium">
            Tem alguma duvida, sugestao ou encontrou um problema? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <span className="text-3xl block mb-3">📧</span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Email</h2>
            <p className="text-gray-600 text-sm mb-4">
              Envie sua mensagem por email. Respondemos em ate 48 horas uteis.
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex-1 text-gray-700">
                contato@ferramentautil.com.br
              </code>
              <button
                onClick={copiarEmail}
                className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                  copiado ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <span className="text-3xl block mb-3">💡</span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Sugestoes</h2>
            <p className="text-gray-600 text-sm mb-4">
              Quer sugerir uma nova ferramenta ou melhoria? Adoramos receber ideias
              da nossa comunidade para tornar o site ainda mais util.
            </p>
            <a
              href="mailto:contato@ferramentautil.com.br?subject=Sugestao%20de%20Ferramenta"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Enviar Sugestao
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">As ferramentas sao realmente gratuitas?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Sim! Todas as ferramentas sao 100% gratuitas, sem limite de uso e sem necessidade de cadastro.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Meus dados sao enviados para algum servidor?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Nao. Todas as ferramentas funcionam inteiramente no seu navegador. Nenhum arquivo ou dado pessoal e enviado para servidores externos.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Posso usar as ferramentas no celular?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Sim! O site e totalmente responsivo e funciona em qualquer dispositivo — computador, tablet ou celular.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Encontrei um erro. Como reportar?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Envie um email para contato@ferramentautil.com.br descrevendo o problema. Inclua qual ferramenta usou e o que aconteceu. Corrigiremos o mais rapido possivel.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>FerramentasUteis &mdash; Ferramentas online gratuitas para o dia a dia.</p>
        </div>
      </div>
    </ClientOnly>
  );
}
