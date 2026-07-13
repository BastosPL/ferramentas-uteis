import Link from "next/link";

export default function Termos() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Ultima atualizacao: 08 de junho de 2026</p>

        <div className="prose prose-gray max-w-none">
          <p>
            Ao acessar e utilizar o site <strong>FerramentaUtil</strong> (ferramentautil.com.br),
            voce concorda com os termos e condicoes descritos abaixo. Caso nao concorde, por favor,
            nao utilize o site.
          </p>

          <h2>1. Sobre o Servico</h2>
          <p>
            O FerramentaUtil e um portal que oferece ferramentas online gratuitas, incluindo
            calculadoras, geradores, conversores e outras utilidades. Todas as ferramentas sao
            disponibilizadas &quot;como estao&quot; (as is), sem garantias de qualquer tipo.
          </p>

          <h2>2. Uso Permitido</h2>
          <p>Ao utilizar nosso site, voce concorda em:</p>
          <ul>
            <li>Usar as ferramentas apenas para fins legais e legitimos</li>
            <li>Nao tentar acessar areas restritas do site ou sistemas do servidor</li>
            <li>Nao utilizar bots, scrapers ou ferramentas automatizadas que sobrecarreguem o site</li>
            <li>Nao reproduzir, distribuir ou modificar o conteudo do site sem autorizacao</li>
          </ul>

          <h2>3. Ferramentas de Geracao de Dados</h2>
          <p>
            Algumas ferramentas geram dados ficticios para fins de teste (como o Gerador de CPF/CNPJ).
            Esses dados sao <strong>exclusivamente para uso em testes de software e desenvolvimento</strong>.
            O uso indevido de dados gerados para fins fraudulentos e de inteira responsabilidade do usuario
            e pode constituir crime previsto em lei.
          </p>

          <h2>4. Consultas a APIs Externas</h2>
          <p>
            Algumas ferramentas (como Consulta CNPJ e Conversor de Moedas) consultam APIs publicas
            de terceiros para obter dados. Nao garantimos a disponibilidade, precisao ou atualizacao
            dessas informacoes, pois dependem de servicos externos que nao controlamos.
          </p>

          <h2>5. Isenacao de Responsabilidade</h2>
          <p>
            As ferramentas e informacoes disponibilizadas neste site tem carater <strong>informativo
            e utilitario</strong>. Nao substituem:
          </p>
          <ul>
            <li>Orientacao profissional medica (calculadoras de IMC, calorias)</li>
            <li>Consultoria financeira ou contabil (calculadoras de investimentos, juros, rescisao)</li>
            <li>Assessoria juridica (gerador de contrato)</li>
            <li>Consultoria tributaria (consulta CNPJ)</li>
          </ul>
          <p>
            Recomendamos que voce consulte profissionais qualificados para decisoes que afetem
            sua saude, financas ou situacao legal.
          </p>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            Todo o conteudo do site — incluindo textos, design, logotipo, codigo-fonte e
            organizacao — e protegido por direitos autorais. E proibida a reproducao total
            ou parcial sem autorizacao previa por escrito.
          </p>

          <h2>7. Privacidade</h2>
          <p>
            O uso deste site tambem esta sujeito a nossa{" "}
            <Link href="/privacidade" className="text-blue-600 hover:underline">Politica de Privacidade</Link>,
            que descreve como coletamos e tratamos informacoes.
          </p>

          <h2>8. Disponibilidade</h2>
          <p>
            Nos esforçamos para manter o site disponivel 24 horas por dia, 7 dias por semana.
            No entanto, nao garantimos disponibilidade ininterrupta. O site pode ficar temporariamente
            indisponivel para manutencao ou por motivos fora do nosso controle.
          </p>

          <h2>9. Alteracoes nos Termos</h2>
          <p>
            Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento.
            Alteracoes entram em vigor imediatamente apos publicacao nesta pagina. O uso
            continuado do site apos alteracoes constitui aceitacao dos novos termos.
          </p>

          <h2>10. Legislacao Aplicavel</h2>
          <p>
            Estes Termos de Uso sao regidos pela legislacao brasileira. Qualquer disputa
            sera submetida ao foro da comarca de Recife/PE.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para duvidas sobre estes Termos de Uso, entre em contato:
          </p>
          <ul>
            <li>Email: <strong>contato@ferramentautil.com.br</strong></li>
            <li>Pagina: <Link href="/contato" className="text-blue-600 hover:underline">Fale Conosco</Link></li>
          </ul>
        </div>
      </div>
  );
}
