import Link from "next/link";

export default function Privacidade() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politica de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Ultima atualizacao: 08 de junho de 2026</p>

        <div className="prose prose-gray max-w-none">
          <p>
            O <strong>FerramentaUtil</strong> (ferramentautil.com.br) tem o compromisso de proteger
            a privacidade dos seus usuarios. Esta Politica de Privacidade descreve como coletamos,
            usamos e protegemos suas informacoes.
          </p>

          <h2>Controlador de Dados</h2>
          <p>
            O controlador dos dados pessoais coletados por este site é o
            <strong> FerramentaUtil</strong>, com sede em Recife/PE — Brasil.
            Para exercer seus direitos de titular, entre em contato pelo e-mail{" "}
            <strong>contato@ferramentautil.com.br</strong>.
          </p>

          <h2>1. Dados que Coletamos</h2>

          <h3>1.1. Dados de Navegacao (automaticos)</h3>
          <p>
            Utilizamos o <strong>Google Analytics</strong> para coletar dados anonimos de navegacao,
            como paginas visitadas, tempo de permanencia, tipo de dispositivo e localizacao
            aproximada. Esses dados nos ajudam a melhorar o site e entender quais ferramentas sao
            mais utilizadas.
          </p>

          <h3>1.2. Dados Processados pelas Ferramentas</h3>
          <p>
            A grande maioria das ferramentas do site funciona <strong>inteiramente no seu navegador</strong> (client-side),
            sem enviar dados para servidores. Isso inclui todas as calculadoras, geradores de senha, compressor de imagem,
            conversores de PDF, contador de caracteres e gerador de QR Code.
          </p>
          <p>
            <strong>Excecoes — ferramentas que consultam APIs externas:</strong>
          </p>
          <ul>
            <li><strong>Consulta CEP:</strong> envia o CEP digitado para a API do ViaCEP (viacep.com.br) para obter o endereco correspondente.</li>
            <li><strong>Consulta CNPJ:</strong> envia o CNPJ digitado para a BrasilAPI (brasilapi.com.br), que consulta dados publicos da Receita Federal.</li>
            <li><strong>Conversor de Moedas:</strong> busca cotacoes atualizadas da <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ExchangeRate-API</a> (open.er-api.com). Nenhum valor digitado no conversor e enviado ao fornecedor. Para obter as taxas, o navegador realiza uma conexao direta com a ExchangeRate-API, que pode receber dados tecnicos da requisicao, como endereco IP e informacoes do dispositivo ou navegador.</li>
          </ul>
          <p>
            Para as ferramentas de Consulta CEP e Consulta CNPJ, apenas o dado digitado (CEP ou CNPJ) e enviado a API correspondente.
            No caso do Conversor de Moedas, nenhum dado inserido pelo usuario e transmitido — apenas dados tecnicos de conexao.
            <strong> Nao armazenamos nenhum dado inserido nas ferramentas em nossos servidores.</strong>
          </p>

          <h2>2. Cookies</h2>

          <h3>2.1. Cookies Essenciais</h3>
          <p>
            Podemos utilizar cookies estritamente necessarios para o funcionamento do site,
            como preferencias de navegacao.
          </p>

          <h3>2.2. Cookies de Terceiros</h3>
          <p>Os seguintes servicos de terceiros podem definir cookies no seu navegador:</p>
          <ul>
            <li><strong>Google Analytics</strong> — para analise de trafego anonima</li>
            <li><strong>Google AdSense</strong> — para exibicao de anuncios relevantes. O Google pode usar cookies para personalizar anuncios com base no seu historico de navegacao</li>
          </ul>
          <p>
            Voce pode gerenciar ou desativar cookies nas configuracoes do seu navegador a qualquer momento.
            Para saber mais sobre como o Google utiliza dados de publicidade, acesse{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Politica de Privacidade do Google
            </a>.
          </p>

          <h2>3. Google AdSense</h2>
          <p>
            Este site utiliza o <strong>Google AdSense</strong> para exibir anuncios. O Google AdSense
            pode utilizar cookies e web beacons para coletar informacoes (incluindo seu endereco IP)
            com o objetivo de exibir anuncios baseados em interesses. Voce pode desativar a
            publicidade personalizada acessando as{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Configuracoes de Anuncios do Google
            </a>.
          </p>

          <h2>4. Compartilhamento de Dados</h2>
          <p>
            Nao vendemos, alugamos ou compartilhamos suas informacoes pessoais com terceiros,
            exceto conforme descrito nesta politica (Google Analytics e Google AdSense).
          </p>

          <h2>5. Seguranca</h2>
          <p>
            Nosso site utiliza conexao segura (HTTPS) para proteger a transmissao de dados.
            Como nao coletamos dados pessoais atraves das ferramentas, o risco de exposicao
            de informacoes e minimizado.
          </p>

          <h2>6. Links Externos</h2>
          <p>
            Nosso site pode conter links para sites externos. Nao nos responsabilizamos pelas
            praticas de privacidade de outros sites. Recomendamos que voce leia a politica de
            privacidade de cada site que visitar.
          </p>

          <h2>7. Direitos do Usuario (LGPD)</h2>
          <p>
            Em conformidade com a Lei Geral de Protecao de Dados (LGPD - Lei 13.709/2018),
            voce tem direito a:
          </p>
          <ul>
            <li>Solicitar acesso aos dados pessoais que possuimos sobre voce</li>
            <li>Solicitar a correcao de dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusao dos seus dados pessoais</li>
            <li>Revogar o consentimento para o uso de cookies nao essenciais</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo email{" "}
            <strong>contato@ferramentautil.com.br</strong>.
          </p>

          <h2>8. Alteracoes nesta Politica</h2>
          <p>
            Podemos atualizar esta Politica de Privacidade periodicamente. Quaisquer alteracoes
            serao publicadas nesta pagina com a data de atualizacao revisada.
          </p>

          <h2>9. Contato</h2>
          <p>
            Se voce tiver duvidas sobre esta Politica de Privacidade, entre em contato conosco:
          </p>
          <ul>
            <li>Email: <strong>contato@ferramentautil.com.br</strong></li>
            <li>Pagina: <Link href="/contato" className="text-blue-600 hover:underline">Fale Conosco</Link></li>
          </ul>
        </div>
      </div>
  );
}
