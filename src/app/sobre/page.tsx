"use client";

import Link from "next/link";
import ClientOnly from "../components/ClientOnly";

export default function Sobre() {
  return (
    <ClientOnly>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sobre o FerramentasUteis</h1>

        <div className="prose prose-gray max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-blue-800 text-lg font-medium mb-0">
              Somos um portal brasileiro de ferramentas online 100% gratuitas, criado para facilitar
              o dia a dia de milhoes de pessoas.
            </p>
          </div>

          <h2>Nossa Missao</h2>
          <p>
            O <strong>FerramentasUteis</strong> nasceu com um objetivo simples: oferecer ferramentas
            praticas, rapidas e seguras que qualquer pessoa possa usar direto no navegador, sem
            precisar instalar nada, criar conta ou pagar qualquer valor.
          </p>
          <p>
            Acreditamos que ferramentas essenciais do dia a dia — como calculadoras financeiras,
            conversores, geradores e editores — devem ser acessiveis a todos, sem barreiras.
          </p>

          <h2>Privacidade em Primeiro Lugar</h2>
          <p>
            Todas as nossas ferramentas funcionam <strong>100% no seu navegador</strong>. Isso
            significa que seus dados nunca saem do seu dispositivo. Nao enviamos arquivos, textos
            ou informacoes pessoais para nenhum servidor externo.
          </p>
          <p>
            Quando voce usa o compressor de imagem, o gerador de PDF ou qualquer outra ferramenta,
            todo o processamento acontece localmente no seu computador ou celular.
          </p>

          <h2>O que Oferecemos</h2>
          <p>Atualmente contamos com <strong>30 ferramentas gratuitas</strong>, organizadas em categorias:</p>
          <ul>
            <li><strong>Calculadoras</strong> — Juros compostos, IMC, calorias, financiamento, rescisao trabalhista, investimentos e mais</li>
            <li><strong>Geradores</strong> — Senhas seguras, QR Code, CPF/CNPJ para testes, Lorem Ipsum, contratos, QR Code PIX</li>
            <li><strong>Conversores</strong> — Unidades, moedas, texto, Word para PDF</li>
            <li><strong>Ferramentas de PDF</strong> — Juntar PDF, imagem para PDF, compressor de imagem</li>
            <li><strong>Utilidades</strong> — Consulta CNPJ, validador de email, cronometro, tabela de medidas</li>
          </ul>

          <h2>Tecnologia</h2>
          <p>
            O site e construido com tecnologias modernas (Next.js e React) e hospedado em uma
            infraestrutura de alta performance, garantindo carregamento rapido em qualquer
            dispositivo — computador, tablet ou celular.
          </p>

          <h2>Contato</h2>
          <p>
            Tem alguma sugestao de ferramenta, encontrou um problema ou quer entrar em contato?
            Acesse nossa <Link href="/contato" className="text-blue-600 hover:underline">pagina de contato</Link>.
          </p>

          <hr />

          <p className="text-sm text-gray-500">
            FerramentasUteis &mdash; Ferramentas online gratuitas para o dia a dia.
          </p>
        </div>
      </div>
    </ClientOnly>
  );
}
