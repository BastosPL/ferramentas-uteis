export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  relatedTools: { name: string; href: string }[];
  content: string;
}

export const allArticles: Article[] = [
  {
    slug: "como-calcular-juros-compostos",
    title: "Como Calcular Juros Compostos: Guia Completo para Iniciantes",
    excerpt: "Entenda o que sao juros compostos, como funcionam e aprenda a calcular seus rendimentos de forma simples e pratica.",
    category: "Financas",
    date: "2026-06-20",
    readTime: "8 min",
    relatedTools: [{ name: "Calculadora de Juros Compostos", href: "/calculadora-juros-compostos" }],
    content: `
<h2>O que sao juros compostos?</h2>
<p>Juros compostos sao o mecanismo financeiro em que os juros de cada periodo sao calculados sobre o valor principal mais os juros acumulados dos periodos anteriores. Em outras palavras, voce ganha juros sobre juros. Esse efeito, conhecido como "bola de neve", e o que faz o dinheiro crescer de forma exponencial ao longo do tempo.</p>
<p>Albert Einstein teria chamado os juros compostos de "a oitava maravilha do mundo". Independentemente da autoria, o conceito e poderoso: quanto mais tempo seu dinheiro fica investido, mais rapido ele cresce. Essa e a base da construcao de riqueza a longo prazo.</p>

<h2>Juros simples vs. juros compostos: qual a diferenca?</h2>
<p>Nos juros simples, o calculo e feito apenas sobre o valor inicial (o capital). Nos juros compostos, o calculo inclui o capital mais os juros que ja foram gerados. Veja um exemplo pratico:</p>
<ul>
<li><strong>Juros simples:</strong> R$ 1.000 a 10% ao ano durante 3 anos = R$ 1.300 (ganho de R$ 300)</li>
<li><strong>Juros compostos:</strong> R$ 1.000 a 10% ao ano durante 3 anos = R$ 1.331 (ganho de R$ 331)</li>
</ul>
<p>A diferenca parece pequena em 3 anos, mas em 20 ou 30 anos o resultado e drasticamente diferente. Com juros compostos, R$ 1.000 a 10% ao ano se transformam em R$ 6.727 em 20 anos, enquanto com juros simples seriam apenas R$ 3.000.</p>

<h2>A formula dos juros compostos</h2>
<p>A formula matematica para calcular juros compostos e:</p>
<p><strong>M = C x (1 + i)^n</strong></p>
<ul>
<li><strong>M</strong> = Montante final (valor que voce tera no futuro)</li>
<li><strong>C</strong> = Capital inicial (valor que voce investe)</li>
<li><strong>i</strong> = Taxa de juros por periodo (em decimal)</li>
<li><strong>n</strong> = Numero de periodos</li>
</ul>
<p>Por exemplo: se voce investe R$ 5.000 a uma taxa de 1% ao mes durante 12 meses:</p>
<p>M = 5.000 x (1 + 0,01)^12 = 5.000 x 1,1268 = R$ 5.634,13</p>
<p>Isso significa que em 12 meses voce teria R$ 634,13 de rendimento, sem fazer nenhum aporte adicional.</p>

<h2>Como os juros compostos funcionam com aportes mensais</h2>
<p>Na pratica, a maioria das pessoas nao faz apenas um unico investimento. Elas fazem aportes mensais. Quando voce combina juros compostos com aportes regulares, o efeito multiplicador fica ainda mais impressionante.</p>
<p>Imagine que voce investe R$ 500 por mes com rendimento de 1% ao mes. Apos 10 anos (120 meses), voce tera investido R$ 60.000, mas o montante final sera de aproximadamente R$ 115.019 — quase o dobro do que voce colocou!</p>
<p>Esse e o poder dos juros compostos: o tempo e seu maior aliado. Comecar cedo, mesmo com valores pequenos, faz uma diferenca enorme no resultado final.</p>

<h2>Onde os juros compostos sao aplicados no Brasil?</h2>
<p>Os juros compostos estao presentes em diversas situacoes do dia a dia:</p>
<ul>
<li><strong>Investimentos:</strong> CDB, Tesouro Direto, LCI, LCA, fundos de investimento e poupanca usam juros compostos para calcular rendimentos.</li>
<li><strong>Financiamentos:</strong> Quando voce financia um imovel ou carro, os juros sao compostos — por isso o valor total pago e muito maior que o bem.</li>
<li><strong>Cartao de credito:</strong> O rotativo do cartao cobra juros compostos, que podem ultrapassar 400% ao ano. Esse e o lado perigoso dos juros compostos.</li>
<li><strong>Emprestimos pessoais:</strong> Bancos e financeiras aplicam juros compostos em emprestimos.</li>
</ul>

<h2>Dicas para aproveitar os juros compostos a seu favor</h2>
<ul>
<li><strong>Comece o mais cedo possivel:</strong> Mesmo R$ 100 por mes fazem diferenca se voce comecar aos 20 anos.</li>
<li><strong>Seja consistente:</strong> Aportes regulares potencializam o efeito dos juros compostos.</li>
<li><strong>Reinvista os rendimentos:</strong> Nunca retire os juros antes do prazo planejado.</li>
<li><strong>Evite dividas com juros compostos:</strong> Cartao de credito e cheque especial usam juros compostos contra voce.</li>
<li><strong>Compare taxas:</strong> Pequenas diferencas na taxa de juros geram grandes diferencas no longo prazo.</li>
</ul>

<h2>Exemplo pratico: R$ 200 por mes durante 30 anos</h2>
<p>Vamos ver o que acontece se voce investir R$ 200 por mes durante 30 anos com uma taxa media de 0,8% ao mes (aproximadamente 10% ao ano):</p>
<ul>
<li><strong>Total investido:</strong> R$ 72.000 (R$ 200 x 360 meses)</li>
<li><strong>Montante final:</strong> Aproximadamente R$ 298.000</li>
<li><strong>Rendimento:</strong> R$ 226.000 — mais de 3 vezes o que voce investiu!</li>
</ul>
<p>Esse exemplo mostra por que especialistas em financas sempre recomendam comecar a investir o quanto antes. O tempo e o ingrediente principal dos juros compostos.</p>

<h2>Use nossa calculadora gratuita</h2>
<p>Para facilitar seus calculos e simulacoes, criamos uma calculadora de juros compostos completa e gratuita. Voce pode simular diferentes cenarios com capital inicial, aportes mensais, taxa de juros e prazo. Experimente agora e descubra quanto seu dinheiro pode render!</p>
    `,
  },
  {
    slug: "senhas-seguras-como-criar-gerenciar",
    title: "Senhas Seguras: Como Criar e Gerenciar suas Senhas em 2026",
    excerpt: "Aprenda a criar senhas fortes, conheca as melhores praticas de seguranca digital e proteja suas contas online.",
    category: "Seguranca",
    date: "2026-06-18",
    readTime: "7 min",
    relatedTools: [{ name: "Gerador de Senha Segura", href: "/gerador-de-senha" }],
    content: `
<h2>Por que senhas fortes sao essenciais?</h2>
<p>Em 2026, a seguranca digital nunca foi tao importante. Com o aumento de ataques ciberneticos, vazamentos de dados e golpes online, ter senhas fortes e a primeira linha de defesa para proteger suas contas, dados pessoais e financeiros.</p>
<p>Segundo relatorios de seguranca, mais de 80% dos vazamentos de dados estao relacionados a senhas fracas ou reutilizadas. Muitas pessoas ainda usam senhas como "123456", "senha123" ou datas de nascimento — combinacoes que um hacker pode descobrir em segundos.</p>

<h2>O que torna uma senha forte?</h2>
<p>Uma senha forte tem as seguintes caracteristicas:</p>
<ul>
<li><strong>Comprimento:</strong> No minimo 12 caracteres. Quanto mais longa, mais segura.</li>
<li><strong>Variedade:</strong> Combine letras maiusculas, minusculas, numeros e simbolos especiais.</li>
<li><strong>Aleatoriedade:</strong> Evite palavras do dicionario, nomes proprios ou sequencias logicas.</li>
<li><strong>Unicidade:</strong> Nunca reutilize a mesma senha em sites diferentes.</li>
</ul>
<p>Um exemplo de senha forte: <strong>K9#mP2$vL7@xR4</strong>. Essa senha tem 14 caracteres, mistura todos os tipos de caracteres e nao contem palavras reconheciveis.</p>

<h2>Erros comuns ao criar senhas</h2>
<p>Evite estes erros que comprometem sua seguranca:</p>
<ul>
<li><strong>Usar informacoes pessoais:</strong> Nome, data de nascimento, nome do pet ou time de futebol sao facilmente descobertos nas redes sociais.</li>
<li><strong>Substituicoes obvias:</strong> Trocar "a" por "@" ou "e" por "3" (como "s3nh@123") nao engana ferramentas de ataque modernas.</li>
<li><strong>Reutilizar senhas:</strong> Se um site for hackeado e voce usa a mesma senha em outros, todas as suas contas ficam vulneraveis.</li>
<li><strong>Senhas curtas:</strong> Senhas com menos de 8 caracteres podem ser quebradas em minutos por forca bruta.</li>
<li><strong>Anotar em papel ou notas do celular:</strong> Qualquer pessoa com acesso fisico pode ver suas senhas.</li>
</ul>

<h2>Como criar senhas memoraveis e seguras</h2>
<p>Existe uma tecnica chamada "passphrase" (frase-senha) que combina seguranca e facilidade de memorizacao. Em vez de uma palavra, use uma frase:</p>
<ul>
<li>Escolha 4-5 palavras aleatorias: <strong>cavalo bateria grampo correto</strong></li>
<li>Adicione numeros e simbolos: <strong>Cavalo7!Bateria$Grampo2Correto</strong></li>
<li>Resultado: uma senha de 30 caracteres, extremamente segura e relativamente facil de lembrar.</li>
</ul>
<p>Outra tecnica e usar a primeira letra de cada palavra de uma frase que faca sentido para voce. Por exemplo: "Meu filho nasceu em 15 de marco de 2020 no Hospital Albert Einstein" vira <strong>Mfne15dmd2020nHAE!</strong></p>

<h2>Gerenciadores de senha: a melhor solucao</h2>
<p>Com dezenas de contas online, e humanamente impossivel lembrar de senhas unicas e fortes para cada uma. A solucao sao os gerenciadores de senha, que:</p>
<ul>
<li>Armazenam todas as suas senhas de forma criptografada</li>
<li>Geram senhas aleatorias e fortes automaticamente</li>
<li>Preenchem formularios de login automaticamente</li>
<li>Sincronizam entre dispositivos (celular, computador, tablet)</li>
<li>Alertam sobre senhas fracas ou vazadas</li>
</ul>
<p>Voce so precisa lembrar de uma unica senha mestra forte. Algumas opcoes populares incluem Bitwarden (gratuito e open source), 1Password e o gerenciador integrado do Google Chrome.</p>

<h2>Autenticacao em dois fatores (2FA)</h2>
<p>Alem de senhas fortes, ative a autenticacao em dois fatores sempre que possivel. Com o 2FA, mesmo que alguem descubra sua senha, precisara de um segundo fator (geralmente um codigo no celular) para acessar sua conta.</p>
<p>Os tipos mais comuns de 2FA sao:</p>
<ul>
<li><strong>Aplicativo autenticador:</strong> Google Authenticator, Authy ou Microsoft Authenticator geram codigos temporarios.</li>
<li><strong>SMS:</strong> Um codigo e enviado por mensagem de texto (menos seguro, mas melhor que nada).</li>
<li><strong>Chave fisica:</strong> Dispositivos como YubiKey oferecem o nivel mais alto de seguranca.</li>
</ul>

<h2>O que fazer se sua senha for vazada</h2>
<p>Se voce descobrir que uma senha foi comprometida em um vazamento:</p>
<ul>
<li>Troque a senha imediatamente no site afetado</li>
<li>Se voce usava a mesma senha em outros sites, troque em todos eles</li>
<li>Ative o 2FA nas contas mais importantes (email, banco, redes sociais)</li>
<li>Verifique se ha atividade suspeita nas suas contas</li>
<li>Considere usar um gerenciador de senhas para nao repetir o erro</li>
</ul>

<h2>Gere senhas fortes instantaneamente</h2>
<p>Criar senhas verdadeiramente aleatorias na cabeca e dificil. Use nosso gerador de senhas gratuito para criar senhas fortes em segundos. Voce pode personalizar o comprimento, incluir ou excluir tipos de caracteres e gerar quantas senhas precisar.</p>
    `,
  },
  {
    slug: "guia-completo-pix",
    title: "Guia Completo do PIX: Tudo que Voce Precisa Saber",
    excerpt: "Descubra como funciona o PIX, como cadastrar chaves, limites, seguranca e como gerar QR Codes para receber pagamentos.",
    category: "Financas",
    date: "2026-06-15",
    readTime: "9 min",
    relatedTools: [{ name: "Gerador de QR Code PIX", href: "/gerador-pix" }],
    content: `
<h2>O que e o PIX?</h2>
<p>O PIX e o sistema de pagamentos instantaneos criado pelo Banco Central do Brasil, lancado em novembro de 2020. Ele permite transferencias e pagamentos em tempo real, 24 horas por dia, 7 dias por semana, incluindo feriados. Em poucos segundos, o dinheiro sai de uma conta e chega em outra.</p>
<p>Desde seu lancamento, o PIX se tornou o meio de pagamento mais utilizado no Brasil, superando cartoes de debito, credito e ate o dinheiro em especie. Em 2026, mais de 160 milhoes de brasileiros ja fizeram pelo menos uma transacao via PIX.</p>

<h2>Como funciona o PIX?</h2>
<p>O PIX funciona de forma simples: voce precisa de uma conta em um banco ou instituicao de pagamento e pelo menos uma chave PIX cadastrada. Para enviar ou receber dinheiro, basta informar a chave PIX do destinatario ou escanear um QR Code.</p>
<p>As transferencias sao processadas pelo Banco Central em tempo real, sem intermediarios. Isso torna o PIX mais rapido que TED e DOC, e sem custo para pessoas fisicas na maioria dos bancos.</p>

<h2>Tipos de chave PIX</h2>
<p>Voce pode cadastrar ate 5 chaves PIX por conta (pessoa fisica). Os tipos disponiveis sao:</p>
<ul>
<li><strong>CPF:</strong> Seu numero de CPF. Cada CPF so pode ser chave em uma unica conta.</li>
<li><strong>Email:</strong> Qualquer endereco de email que voce tenha acesso.</li>
<li><strong>Telefone:</strong> Seu numero de celular com DDD (+55).</li>
<li><strong>Chave aleatoria:</strong> Um codigo gerado automaticamente pelo banco (UUID). Ideal para quem nao quer compartilhar dados pessoais.</li>
</ul>
<p>Para empresas (pessoa juridica), e possivel cadastrar ate 20 chaves por conta, incluindo o CNPJ.</p>

<h2>Como cadastrar uma chave PIX</h2>
<p>O cadastro e feito diretamente no aplicativo do seu banco ou instituicao de pagamento. O passo a passo geral e:</p>
<ul>
<li>Abra o app do seu banco e procure a secao "PIX" ou "Area PIX"</li>
<li>Selecione "Cadastrar chave" ou "Minhas chaves"</li>
<li>Escolha o tipo de chave (CPF, email, telefone ou aleatoria)</li>
<li>Confirme a posse da chave (para email e telefone, um codigo de verificacao sera enviado)</li>
<li>Pronto! Sua chave esta ativa e pronta para uso</li>
</ul>

<h2>Limites do PIX</h2>
<p>Os limites do PIX sao definidos por cada instituicao financeira, mas seguem regras gerais do Banco Central:</p>
<ul>
<li><strong>Horario diurno (6h as 20h):</strong> Limite definido pelo banco, geralmente igual ao limite de transferencia da conta.</li>
<li><strong>Horario noturno (20h as 6h):</strong> Limite reduzido de R$ 1.000 por padrao, podendo ser ajustado pelo usuario.</li>
<li><strong>Ajuste de limites:</strong> Voce pode solicitar aumento ou reducao de limites pelo app. Aumentos levam entre 24h e 48h para serem efetivados (medida de seguranca).</li>
</ul>
<p>Nao ha limite minimo para transacoes PIX. Voce pode enviar ate R$ 0,01 se quiser.</p>

<h2>PIX e seguranca</h2>
<p>O PIX foi desenvolvido com diversas camadas de seguranca:</p>
<ul>
<li><strong>Criptografia:</strong> Todas as transacoes sao criptografadas de ponta a ponta.</li>
<li><strong>Autenticacao:</strong> Cada transacao exige autenticacao (senha, biometria ou reconhecimento facial).</li>
<li><strong>Mecanismo Especial de Devolucao (MED):</strong> Em caso de fraude, o banco pode bloquear e devolver valores em ate 80 dias.</li>
<li><strong>Limites noturnos:</strong> Reduzem o risco de perdas em caso de roubo de celular.</li>
</ul>
<p>Para se proteger, nunca compartilhe sua senha, nao faca PIX sob pressao e confirme sempre os dados do destinatario antes de enviar.</p>

<h2>QR Code PIX: estatico e dinamico</h2>
<p>O PIX suporta dois tipos de QR Code:</p>
<ul>
<li><strong>QR Code estatico:</strong> Pode ser reutilizado varias vezes. Ideal para receber pagamentos recorrentes. O valor pode ser definido ou deixado em aberto.</li>
<li><strong>QR Code dinamico:</strong> Gerado para uma unica transacao, com valor fixo e dados especificos. Usado em comercio e notas fiscais.</li>
</ul>
<p>O QR Code segue o padrao EMV definido pelo Banco Central, garantindo compatibilidade entre todos os bancos e instituicoes de pagamento.</p>

<h2>PIX Copia e Cola</h2>
<p>Alem do QR Code, existe o "PIX Copia e Cola", que e uma string de texto contendo todas as informacoes da transacao. E util quando voce esta no celular e nao pode escanear um QR Code — basta copiar o texto e colar no app do banco.</p>

<h2>Como usar o PIX para receber pagamentos</h2>
<p>Se voce e autonomo, freelancer ou tem um pequeno negocio, o PIX e uma excelente forma de receber pagamentos sem custos. Voce pode:</p>
<ul>
<li>Compartilhar sua chave PIX diretamente</li>
<li>Gerar um QR Code com valor definido para cada venda</li>
<li>Criar um QR Code fixo para deixar no balcao ou vitrine</li>
<li>Enviar o codigo Copia e Cola por WhatsApp ou email</li>
</ul>

<h2>Gere seu QR Code PIX gratuitamente</h2>
<p>Precisa criar um QR Code PIX para receber pagamentos? Use nosso gerador gratuito! Basta informar sua chave PIX, o valor (opcional) e uma descricao. O QR Code e gerado seguindo o padrao EMV do Banco Central, compativel com todos os bancos. Crie o seu agora!</p>
    `,
  },
  {
    slug: "como-consultar-cnpj-gratuitamente",
    title: "Como Consultar CNPJ Gratuitamente: Passo a Passo",
    excerpt: "Aprenda a consultar dados de empresas pelo CNPJ na Receita Federal. Veja situacao cadastral, socios, CNAE e mais.",
    category: "Negocios",
    date: "2026-06-12",
    readTime: "7 min",
    relatedTools: [{ name: "Consulta CNPJ", href: "/consulta-cnpj" }],
    content: `
<h2>O que e o CNPJ?</h2>
<p>O CNPJ (Cadastro Nacional da Pessoa Juridica) e o registro oficial de empresas junto a Receita Federal do Brasil. Assim como o CPF identifica pessoas fisicas, o CNPJ identifica empresas, associacoes, fundacoes e demais entidades juridicas. O numero tem 14 digitos e e unico para cada empresa.</p>
<p>Consultar o CNPJ de uma empresa e um passo fundamental antes de fechar negocios, contratar servicos ou firmar parcerias. A consulta revela informacoes importantes sobre a saude e regularidade da empresa.</p>

<h2>Que informacoes a consulta CNPJ revela?</h2>
<p>Ao consultar um CNPJ, voce tem acesso a diversas informacoes publicas:</p>
<ul>
<li><strong>Razao social:</strong> O nome oficial da empresa registrado na Receita Federal.</li>
<li><strong>Nome fantasia:</strong> O nome comercial usado no dia a dia.</li>
<li><strong>Situacao cadastral:</strong> Se a empresa esta ativa, inapta, suspensa ou baixada.</li>
<li><strong>Data de abertura:</strong> Quando a empresa foi constituida.</li>
<li><strong>CNAE (atividade economica):</strong> Quais atividades a empresa exerce oficialmente.</li>
<li><strong>Endereco:</strong> A sede registrada da empresa.</li>
<li><strong>Telefone e email:</strong> Contatos informados a Receita.</li>
<li><strong>Quadro de socios:</strong> Quem sao os socios e administradores.</li>
<li><strong>Capital social:</strong> O valor declarado como capital da empresa.</li>
<li><strong>Porte e natureza juridica:</strong> Se e MEI, ME, EPP, LTDA, S/A, etc.</li>
</ul>

<h2>Por que consultar o CNPJ e importante?</h2>
<p>A consulta de CNPJ e util em diversas situacoes:</p>
<ul>
<li><strong>Antes de comprar:</strong> Verifique se a empresa existe e esta ativa antes de fazer compras online ou contratar servicos.</li>
<li><strong>Parcerias comerciais:</strong> Confirme a regularidade de fornecedores e parceiros de negocio.</li>
<li><strong>Processos juridicos:</strong> Identifique dados da empresa para acoes judiciais ou cobranfas.</li>
<li><strong>Emprego:</strong> Verifique se a empresa que te contratou existe e esta regular.</li>
<li><strong>Emissao de notas fiscais:</strong> Confirme dados para preencher notas fiscais corretamente.</li>
</ul>

<h2>Como consultar CNPJ na Receita Federal</h2>
<p>O metodo oficial e acessar o site da Receita Federal. Porem, o processo pode ser lento e a interface nao e muito amigavel. Veja o passo a passo:</p>
<ul>
<li>Acesse o site da Receita Federal (servicos.receita.fazenda.gov.br)</li>
<li>Procure por "Consulta CNPJ" ou "Comprovante de Inscricao e de Situacao Cadastral"</li>
<li>Digite o numero do CNPJ (14 digitos)</li>
<li>Resolva o captcha de seguranca</li>
<li>Visualize o comprovante com todas as informacoes</li>
</ul>
<p>O comprovante pode ser salvo em PDF para registro.</p>

<h2>Situacoes cadastrais do CNPJ</h2>
<p>Ao consultar um CNPJ, preste atencao especial na situacao cadastral:</p>
<ul>
<li><strong>Ativa:</strong> A empresa esta regular e operando normalmente.</li>
<li><strong>Inapta:</strong> A empresa nao entregou declaracoes obrigatorias. Pode indicar empresa fantasma ou abandonada.</li>
<li><strong>Suspensa:</strong> A empresa esta temporariamente impedida de operar por alguma irregularidade.</li>
<li><strong>Baixada:</strong> A empresa foi encerrada oficialmente.</li>
<li><strong>Nula:</strong> O CNPJ foi cancelado por irregularidade na inscricao.</li>
</ul>
<p>Se a empresa que voce esta consultando nao esta com situacao "Ativa", tenha cuidado redobrado antes de fazer qualquer negocio.</p>

<h2>O que e o CNAE e por que importa?</h2>
<p>O CNAE (Classificacao Nacional de Atividades Economicas) e o codigo que identifica quais atividades a empresa exerce. Isso e importante porque:</p>
<ul>
<li>Determina quais impostos a empresa deve pagar</li>
<li>Define se a empresa pode emitir determinados tipos de nota fiscal</li>
<li>Indica se a empresa atua na area que diz atuar</li>
<li>E usado para verificar se a empresa pode participar de licitacoes em determinada area</li>
</ul>

<h2>Inscricao Estadual (IE)</h2>
<p>Alem do CNPJ, empresas que vendem produtos fisicos precisam de Inscricao Estadual (IE) junto a Secretaria da Fazenda do estado. A IE e obrigatoria para empresas contribuintes do ICMS. Voce pode verificar a IE juntamente com a consulta de CNPJ.</p>

<h2>Consulte CNPJ de forma rapida e gratuita</h2>
<p>Para facilitar sua pesquisa, oferecemos uma ferramenta de consulta CNPJ gratuita e instantanea. Basta digitar o numero do CNPJ e voce tera acesso a todas as informacoes da Receita Federal em segundos, sem captcha e com uma interface limpa e facil de usar. Consulte agora!</p>
    `,
  },
  {
    slug: "imc-o-que-e-como-calcular",
    title: "IMC: O que e, Como Calcular e Tabela Completa",
    excerpt: "Entenda o Indice de Massa Corporal (IMC), aprenda a calcular e veja a tabela completa da OMS com todas as classificacoes.",
    category: "Saude",
    date: "2026-06-10",
    readTime: "8 min",
    relatedTools: [{ name: "Calculadora de IMC", href: "/calculadora-imc" }],
    content: `
<h2>O que e o IMC?</h2>
<p>O IMC (Indice de Massa Corporal) e uma medida internacional usada para avaliar se uma pessoa esta dentro de uma faixa de peso saudavel em relacao a sua altura. Criado pelo matematico belga Adolphe Quetelet no seculo XIX, o IMC continua sendo uma das ferramentas mais utilizadas na saude publica e na pratica clinica.</p>
<p>O calculo e simples e nao requer equipamentos especiais, bastando saber seu peso e sua altura. Por isso, e amplamente usado em triagens medicas, consultas de rotina e avaliacoes de saude em geral.</p>

<h2>Como calcular o IMC</h2>
<p>A formula do IMC e bastante simples:</p>
<p><strong>IMC = Peso (kg) / Altura (m)^2</strong></p>
<p>Ou seja, voce divide seu peso em quilogramas pelo quadrado da sua altura em metros. Exemplo pratico:</p>
<ul>
<li>Peso: 75 kg</li>
<li>Altura: 1,75 m</li>
<li>IMC = 75 / (1,75 x 1,75) = 75 / 3,0625 = <strong>24,49</strong></li>
</ul>
<p>Neste exemplo, o IMC de 24,49 indica que a pessoa esta dentro da faixa de peso normal.</p>

<h2>Tabela completa do IMC (OMS)</h2>
<p>A Organizacao Mundial da Saude (OMS) classifica o IMC nas seguintes faixas para adultos:</p>
<ul>
<li><strong>Abaixo de 18,5:</strong> Abaixo do peso (magreza)</li>
<li><strong>18,5 a 24,9:</strong> Peso normal (eutrofia)</li>
<li><strong>25,0 a 29,9:</strong> Sobrepeso (pre-obesidade)</li>
<li><strong>30,0 a 34,9:</strong> Obesidade grau I</li>
<li><strong>35,0 a 39,9:</strong> Obesidade grau II</li>
<li><strong>40,0 ou mais:</strong> Obesidade grau III (morbida)</li>
</ul>
<p>Cada faixa esta associada a diferentes niveis de risco para doencas como diabetes tipo 2, hipertensao arterial, doencas cardiovasculares e problemas articulares.</p>

<h2>Classificacao detalhada da magreza</h2>
<p>O baixo peso tambem e dividido em graus:</p>
<ul>
<li><strong>IMC abaixo de 16,0:</strong> Magreza grau III (grave)</li>
<li><strong>16,0 a 16,9:</strong> Magreza grau II (moderada)</li>
<li><strong>17,0 a 18,4:</strong> Magreza grau I (leve)</li>
</ul>
<p>Estar abaixo do peso pode indicar desnutricao, disturbios alimentares ou outras condicoes de saude que precisam de atencao medica.</p>

<h2>Limitacoes do IMC</h2>
<p>Apesar de util, o IMC tem limitacoes importantes que voce deve conhecer:</p>
<ul>
<li><strong>Nao diferencia massa muscular de gordura:</strong> Um atleta musculoso pode ter IMC alto sem estar acima do peso.</li>
<li><strong>Nao considera distribuicao de gordura:</strong> A gordura abdominal (visceral) e mais perigosa que a gordura em outras areas, e o IMC nao distingue isso.</li>
<li><strong>Nao considera idade:</strong> Idosos naturalmente perdem massa muscular, e o IMC pode nao refletir adequadamente sua composicao corporal.</li>
<li><strong>Nao se aplica a criancas:</strong> Para criancas e adolescentes, existem curvas de crescimento especificas por idade e sexo.</li>
<li><strong>Nao considera etnia:</strong> Diferentes populacoes podem ter riscos de saude diferentes com o mesmo IMC.</li>
</ul>

<h2>IMC e saude: o que os numeros significam</h2>
<p>Embora o IMC sozinho nao seja um diagnostico, ele oferece indicativos importantes:</p>
<ul>
<li><strong>IMC normal (18,5-24,9):</strong> Menor risco de doencas cronicas relacionadas ao peso.</li>
<li><strong>Sobrepeso (25-29,9):</strong> Risco aumentado de diabetes tipo 2, hipertensao e doencas cardiovasculares.</li>
<li><strong>Obesidade (acima de 30):</strong> Risco significativamente elevado de doencas cronicas, apneia do sono, problemas articulares e algumas formas de cancer.</li>
</ul>
<p>O ideal e combinar o IMC com outras medidas, como a circunferencia da cintura (acima de 94 cm para homens e 80 cm para mulheres indica risco aumentado).</p>

<h2>Como melhorar seu IMC</h2>
<p>Se seu IMC esta fora da faixa saudavel, algumas estrategias podem ajudar:</p>
<ul>
<li><strong>Alimentacao equilibrada:</strong> Priorize alimentos naturais, frutas, legumes, proteinas magras e graos integrais.</li>
<li><strong>Atividade fisica regular:</strong> Pelo menos 150 minutos de exercicio moderado por semana (recomendacao da OMS).</li>
<li><strong>Hidratacao:</strong> Beba pelo menos 2 litros de agua por dia.</li>
<li><strong>Sono adequado:</strong> Dormir de 7 a 9 horas por noite ajuda no controle do peso.</li>
<li><strong>Acompanhamento profissional:</strong> Consulte um medico e um nutricionista para orientacao personalizada.</li>
</ul>

<h2>Calcule seu IMC agora</h2>
<p>Use nossa calculadora de IMC gratuita para descobrir em qual faixa voce se encontra. Basta informar seu peso e altura, e o resultado aparece instantaneamente com a classificacao completa da OMS. Calcule agora e cuide da sua saude!</p>
    `,
  },
  {
    slug: "investimentos-para-iniciantes",
    title: "Investimentos para Iniciantes: CDB, LCI e Tesouro Direto",
    excerpt: "Conheca os principais investimentos de renda fixa no Brasil e aprenda a escolher o melhor para o seu perfil.",
    category: "Financas",
    date: "2026-06-08",
    readTime: "9 min",
    relatedTools: [{ name: "Calculadora de Investimentos", href: "/calculadora-investimentos" }],
    content: `
<h2>Por que investir e importante?</h2>
<p>Guardar dinheiro na poupanca e melhor do que nao guardar nada, mas nao e a forma mais inteligente de fazer seu dinheiro trabalhar por voce. Em 2026, a poupanca rende cerca de 7% ao ano, enquanto outras opcoes de renda fixa podem render entre 10% e 13% ao ano, dependendo do cenario economico.</p>
<p>Investir nao e um privilegio de quem tem muito dinheiro. Com R$ 30 voce ja pode comprar um titulo do Tesouro Direto. O importante e comecar, entender os conceitos basicos e ser consistente.</p>

<h2>O que e renda fixa?</h2>
<p>Renda fixa e a categoria de investimentos em que voce sabe (ou pode prever) quanto vai receber de volta. Voce empresta dinheiro para um banco, empresa ou governo, e recebe juros em troca. Os principais tipos sao:</p>
<ul>
<li><strong>Prefixados:</strong> A taxa de juros e definida no momento da aplicacao (ex: 12% ao ano).</li>
<li><strong>Pos-fixados:</strong> O rendimento acompanha um indicador, geralmente o CDI ou a taxa Selic.</li>
<li><strong>Hibridos:</strong> Combinam uma taxa fixa com um indicador (ex: IPCA + 6% ao ano).</li>
</ul>

<h2>CDB (Certificado de Deposito Bancario)</h2>
<p>O CDB e um dos investimentos mais acessiveis. Ao comprar um CDB, voce esta emprestando dinheiro ao banco, que em troca paga juros.</p>
<ul>
<li><strong>Rentabilidade:</strong> Geralmente expressa como % do CDI (ex: 100% do CDI, 110% do CDI).</li>
<li><strong>Seguranca:</strong> Protegido pelo FGC (Fundo Garantidor de Credito) ate R$ 250.000 por CPF por instituicao.</li>
<li><strong>Liquidez:</strong> Alguns CDBs tem liquidez diaria (voce pode resgatar quando quiser), outros so no vencimento.</li>
<li><strong>Imposto de Renda:</strong> Sim, ha cobranca de IR regressiva: 22,5% ate 180 dias, 20% ate 360, 17,5% ate 720, 15% acima de 720 dias.</li>
<li><strong>Investimento minimo:</strong> A partir de R$ 1 em algumas plataformas.</li>
</ul>

<h2>LCI e LCA (Letras de Credito)</h2>
<p>LCI (Letra de Credito Imobiliario) e LCA (Letra de Credito do Agronegocios) sao titulos emitidos por bancos para financiar os setores imobiliario e do agronegocio.</p>
<ul>
<li><strong>Principal vantagem:</strong> Isencao total de Imposto de Renda para pessoa fisica!</li>
<li><strong>Rentabilidade:</strong> Tambem expressa como % do CDI, mas como nao tem IR, a rentabilidade liquida pode ser superior a um CDB.</li>
<li><strong>Seguranca:</strong> Tambem protegida pelo FGC ate R$ 250.000.</li>
<li><strong>Liquidez:</strong> Geralmente tem carencia (90 dias ou mais) antes de poder resgatar.</li>
<li><strong>Investimento minimo:</strong> Costuma ser mais alto que CDB, a partir de R$ 1.000 em media.</li>
</ul>

<h3>Quando LCI/LCA vale mais a pena que CDB?</h3>
<p>Para comparar, voce precisa calcular a rentabilidade liquida (descontando IR). Um CDB de 100% do CDI com resgate em 1 ano paga IR de 17,5%, sobrando 82,5% do CDI liquido. Uma LCI de 85% do CDI, sem IR, rende os 85% integralmente. Neste caso, a LCI ganha!</p>

<h2>Tesouro Direto</h2>
<p>O Tesouro Direto e o programa do governo federal que permite a compra de titulos publicos por pessoas fisicas. E considerado o investimento mais seguro do pais, ja que o emissor e o proprio governo.</p>
<ul>
<li><strong>Tesouro Selic:</strong> Rende de acordo com a taxa Selic. Tem liquidez diaria e baixa volatilidade. Ideal para reserva de emergencia.</li>
<li><strong>Tesouro IPCA+:</strong> Rende a inflacao (IPCA) mais uma taxa fixa. Protege seu poder de compra a longo prazo. Ideal para aposentadoria.</li>
<li><strong>Tesouro Prefixado:</strong> Taxa fixa definida na compra. Voce sabe exatamente quanto vai receber no vencimento.</li>
</ul>
<p>O investimento minimo e de aproximadamente R$ 30, tornando-o acessivel para qualquer pessoa.</p>

<h2>Como escolher entre CDB, LCI e Tesouro Direto?</h2>
<p>A escolha depende de tres fatores principais:</p>
<ul>
<li><strong>Prazo:</strong> Para curto prazo (ate 1 ano), Tesouro Selic ou CDB com liquidez diaria. Para medio/longo prazo, LCI/LCA ou Tesouro IPCA+.</li>
<li><strong>Tributacao:</strong> Se voce quer evitar IR, LCI e LCA sao as melhores opcoes. Porem, compare sempre a rentabilidade liquida.</li>
<li><strong>Objetivo:</strong> Reserva de emergencia? Tesouro Selic. Aposentadoria? Tesouro IPCA+. Melhor rendimento no medio prazo? CDB ou LCI/LCA.</li>
</ul>

<h2>Erros comuns de iniciantes</h2>
<ul>
<li><strong>Nao ter reserva de emergencia:</strong> Antes de investir para o longo prazo, tenha de 3 a 6 meses de despesas em um investimento com liquidez diaria.</li>
<li><strong>Olhar so a rentabilidade bruta:</strong> Sempre compare a rentabilidade liquida (depois de IR e taxas).</li>
<li><strong>Investir sem objetivo:</strong> Defina para que voce esta investindo (viagem, casa, aposentadoria) e escolha o produto adequado.</li>
<li><strong>Ignorar a inflacao:</strong> Um rendimento de 8% ao ano com inflacao de 5% significa ganho real de apenas 3%.</li>
</ul>

<h2>Simule seus investimentos</h2>
<p>Use nossa calculadora de investimentos gratuita para comparar CDB, LCI/LCA e Tesouro Direto lado a lado. Calcule o rendimento liquido, veja o desconto de IR e descubra qual opcao e mais vantajosa para o seu caso. Simule agora!</p>
    `,
  },
  {
    slug: "como-comprimir-imagens-sem-perder-qualidade",
    title: "Como Comprimir Imagens sem Perder Qualidade",
    excerpt: "Aprenda tecnicas para reduzir o tamanho de imagens mantendo a qualidade visual. Ideal para sites, emails e redes sociais.",
    category: "Tecnologia",
    date: "2026-06-05",
    readTime: "7 min",
    relatedTools: [{ name: "Compressor de Imagem", href: "/compressor-imagem" }],
    content: `
<h2>Por que comprimir imagens?</h2>
<p>Imagens de alta resolucao sao bonitas, mas pesam — e muito. Uma foto tirada por um smartphone moderno pode facilmente ultrapassar 5 MB. Quando voce precisa enviar por email, publicar em um site ou compartilhar no WhatsApp, esse tamanho se torna um problema.</p>
<p>Comprimir imagens traz diversos beneficios:</p>
<ul>
<li><strong>Sites mais rapidos:</strong> Imagens pesadas sao a principal causa de lentidao em sites. O Google considera a velocidade de carregamento como fator de ranqueamento (SEO).</li>
<li><strong>Economia de espaco:</strong> Armazene mais fotos no celular, no computador ou na nuvem.</li>
<li><strong>Envio mais rapido:</strong> Emails e mensagens com imagens leves sao enviados e recebidos mais rapidamente.</li>
<li><strong>Economia de dados:</strong> Usuarios de internet movel agradecem imagens otimizadas.</li>
</ul>

<h2>Formatos de imagem e suas caracteristicas</h2>
<p>Entender os formatos e o primeiro passo para comprimir de forma inteligente:</p>
<ul>
<li><strong>JPEG/JPG:</strong> O formato mais comum para fotos. Usa compressao com perda (lossy), o que significa que descarta dados para reduzir o tamanho. Ideal para fotografias e imagens com muitas cores e gradientes.</li>
<li><strong>PNG:</strong> Formato com suporte a transparencia e compressao sem perda (lossless). Gera arquivos maiores que JPEG, mas mantem todos os detalhes. Ideal para logos, icones, capturas de tela e imagens com texto.</li>
<li><strong>WebP:</strong> Formato moderno criado pelo Google. Combina boa qualidade com tamanhos de arquivo significativamente menores (ate 30% menor que JPEG para a mesma qualidade). Suportado por todos os navegadores modernos.</li>
<li><strong>SVG:</strong> Formato vetorial para graficos, logos e icones. Escalavel sem perda de qualidade. Nao e adequado para fotos.</li>
<li><strong>AVIF:</strong> Formato ainda mais eficiente que WebP, mas com suporte mais limitado em navegadores mais antigos.</li>
</ul>

<h2>Compressao com perda vs. sem perda</h2>
<p>Existem duas abordagens principais para comprimir imagens:</p>
<ul>
<li><strong>Compressao com perda (lossy):</strong> Remove dados permanentemente para reduzir o tamanho. Com niveis moderados de compressao (70-85% de qualidade), a diferenca visual e praticamente imperceptivel ao olho humano. Formatos: JPEG, WebP (lossy).</li>
<li><strong>Compressao sem perda (lossless):</strong> Reduz o tamanho sem perder nenhum dado. A reducao e menor (tipicamente 10-30%), mas a imagem permanece identica a original. Formatos: PNG, WebP (lossless), AVIF (lossless).</li>
</ul>
<p>Para a maioria dos usos — sites, redes sociais, emails — a compressao com perda em qualidade 80% e o ponto ideal entre tamanho e qualidade.</p>

<h2>Tecnicas para reduzir o tamanho de imagens</h2>
<p>Alem da compressao pura, existem outras tecnicas eficazes:</p>
<ul>
<li><strong>Redimensionar:</strong> Se sua foto tem 4000x3000 pixels mas sera exibida em 800x600, redimensione antes de comprimir. Isso pode reduzir o tamanho em mais de 90%.</li>
<li><strong>Escolher o formato correto:</strong> Use JPEG para fotos, PNG para graficos com transparencia e WebP para web em geral.</li>
<li><strong>Remover metadados:</strong> Fotos de smartphones contem metadados EXIF (localizacao, modelo da camera, etc.) que aumentam o tamanho. Remover esses dados pode economizar dezenas de KB.</li>
<li><strong>Converter para WebP:</strong> Simplesmente converter JPEG/PNG para WebP pode reduzir o tamanho em 25-34%.</li>
</ul>

<h2>Compressao de imagens para sites e SEO</h2>
<p>Se voce tem um site, otimizar imagens e essencial para performance e SEO:</p>
<ul>
<li><strong>Meta: menos de 200 KB por imagem</strong> para fotos, menos de 50 KB para icones e logos.</li>
<li><strong>Use formato WebP:</strong> Todos os navegadores modernos suportam, e a economia de tamanho e significativa.</li>
<li><strong>Imagens responsivas:</strong> Sirva diferentes tamanhos de imagem para diferentes dispositivos (srcset).</li>
<li><strong>Lazy loading:</strong> Carregue imagens apenas quando o usuario rolar ate elas (atributo loading="lazy").</li>
<li><strong>CDN de imagens:</strong> Servicos como Cloudflare Images ou imgix otimizam e servem imagens automaticamente.</li>
</ul>

<h2>Compressao para redes sociais</h2>
<p>Cada rede social tem suas recomendacoes de tamanho:</p>
<ul>
<li><strong>Instagram:</strong> 1080x1080 (feed), 1080x1920 (stories/reels). JPEG com qualidade 80%.</li>
<li><strong>Facebook:</strong> 1200x630 (link share), 1080x1080 (post). JPEG ou PNG.</li>
<li><strong>WhatsApp:</strong> Ja comprime automaticamente, mas enviar imagens otimizadas evita perda excessiva de qualidade.</li>
<li><strong>LinkedIn:</strong> 1200x627 (post), 1128x191 (banner). JPEG com qualidade 80%.</li>
</ul>

<h2>Comprima suas imagens gratuitamente</h2>
<p>Use nosso compressor de imagem online para reduzir o tamanho de suas fotos sem perder qualidade visual. Suportamos JPG, PNG e WebP, com controle de nivel de compressao. Tudo e processado no seu navegador — nenhuma imagem e enviada para servidores. Experimente agora!</p>
    `,
  },
  {
    slug: "pdf-online-juntar-converter-comprimir",
    title: "PDF Online: Como Juntar, Converter e Comprimir Arquivos PDF",
    excerpt: "Guia completo sobre ferramentas PDF online: como juntar, converter imagens e Word para PDF e otimizar seus arquivos.",
    category: "Tecnologia",
    date: "2026-06-02",
    readTime: "8 min",
    relatedTools: [
      { name: "Juntar PDF", href: "/juntar-pdf" },
      { name: "Imagem para PDF", href: "/imagem-para-pdf" },
      { name: "Conversor Word para PDF", href: "/conversor-word-pdf" },
    ],
    content: `
<h2>O PDF continua indispensavel</h2>
<p>Criado pela Adobe em 1993, o formato PDF (Portable Document Format) continua sendo o padrao universal para documentos digitais. Em 2026, bilhoes de PDFs sao criados, compartilhados e assinados diariamente ao redor do mundo.</p>
<p>A principal vantagem do PDF e a consistencia: um arquivo PDF mantem a mesma aparencia em qualquer dispositivo, sistema operacional ou impressora. Por isso, e o formato preferido para contratos, relatorios, notas fiscais, curriculos, trabalhos academicos e documentos oficiais.</p>

<h2>Como juntar varios PDFs em um so</h2>
<p>Uma das necessidades mais comuns e combinar varios arquivos PDF em um unico documento. Situacoes tipicas incluem:</p>
<ul>
<li>Unir varias paginas digitalizadas em um unico arquivo</li>
<li>Combinar documentos para envio por email</li>
<li>Montar um relatorio a partir de varias fontes</li>
<li>Organizar documentos para impressao</li>
</ul>
<p>Para juntar PDFs, voce pode usar ferramentas online que funcionam diretamente no navegador. O processo e simples:</p>
<ul>
<li>Selecione os arquivos PDF que deseja juntar</li>
<li>Organize a ordem dos arquivos arrastando e soltando</li>
<li>Clique em "Juntar" para combinar</li>
<li>Baixe o PDF resultante</li>
</ul>
<p>O ponto mais importante ao escolher uma ferramenta e a privacidade. Muitos sites enviam seus arquivos para servidores externos, o que pode ser um problema de seguranca para documentos sensiveis. Prefira ferramentas que processam tudo localmente, no seu navegador.</p>

<h2>Converter imagens para PDF</h2>
<p>Converter imagens JPG ou PNG para PDF e util em diversas situacoes:</p>
<ul>
<li><strong>Digitalizacao de documentos:</strong> Tire fotos de documentos e converta para PDF.</li>
<li><strong>Portfolios:</strong> Combine varias imagens de trabalhos em um unico PDF profissional.</li>
<li><strong>Trabalhos escolares:</strong> Transforme fotos de cadernos ou quadros em PDF para entregar ao professor.</li>
<li><strong>Comprovantes:</strong> Converta capturas de tela de comprovantes em PDF para arquivo.</li>
</ul>
<p>Ao converter imagens para PDF, preste atencao em:</p>
<ul>
<li><strong>Orientacao:</strong> Fotos em retrato e paisagem devem ter paginas com orientacao correspondente.</li>
<li><strong>Qualidade:</strong> Use imagens com boa resolucao para que o PDF fique legivel.</li>
<li><strong>Ordem:</strong> Organize as imagens na ordem correta antes de converter.</li>
<li><strong>Tamanho da pagina:</strong> A4 e o padrao no Brasil para impressao.</li>
</ul>

<h2>Converter Word para PDF</h2>
<p>A conversao de Word (DOCX) para PDF e uma das mais realizadas no dia a dia. Motivos comuns:</p>
<ul>
<li><strong>Envio de curriculos:</strong> PDFs mantem a formatacao intacta, diferente de DOC que pode ficar desconfigurado em outro computador.</li>
<li><strong>Documentos oficiais:</strong> Muitas instituicoes exigem documentos em PDF.</li>
<li><strong>Protecao do conteudo:</strong> PDFs sao mais dificeis de editar acidentalmente que documentos Word.</li>
<li><strong>Impressao consistente:</strong> O PDF garante que a impressao sera identica ao que voce ve na tela.</li>
</ul>
<p>A maioria dos editores de texto modernos (Microsoft Word, Google Docs, LibreOffice) ja tem a opcao "Salvar como PDF" ou "Exportar para PDF". Porem, ferramentas online oferecem a conveniencia de converter sem precisar instalar nenhum software.</p>

<h2>Converter PDF para Word</h2>
<p>O caminho inverso tambem e muito procurado. Converter PDF para Word e util quando voce precisa editar o conteudo de um documento PDF. Algumas consideracoes:</p>
<ul>
<li>PDFs com texto selecionavel convertem melhor que PDFs escaneados (imagens)</li>
<li>A formatacao pode nao ser 100% preservada, especialmente tabelas complexas e layouts de multiplas colunas</li>
<li>PDFs com formularios e campos interativos podem perder funcionalidade na conversao</li>
<li>Para PDFs escaneados, e necessario OCR (reconhecimento optico de caracteres) antes da conversao</li>
</ul>

<h2>Boas praticas ao trabalhar com PDFs</h2>
<ul>
<li><strong>Nomeie seus arquivos de forma descritiva:</strong> "Contrato-Prestacao-Servico-Jan2026.pdf" e melhor que "documento.pdf".</li>
<li><strong>Use PDF/A para arquivamento:</strong> Esse subformato garante que o documento sera legivel no futuro.</li>
<li><strong>Proteja documentos sensiveis:</strong> Use senha para PDFs com informacoes confidenciais.</li>
<li><strong>Otimize o tamanho:</strong> PDFs com muitas imagens podem ficar pesados. Comprima as imagens antes de gerar o PDF.</li>
<li><strong>Verifique antes de enviar:</strong> Sempre abra e revise o PDF final antes de enviar, especialmente apos conversoes.</li>
</ul>

<h2>Privacidade: por que importa</h2>
<p>Ao usar ferramentas online para manipular PDFs, a privacidade deve ser sua prioridade. Documentos PDF frequentemente contem informacoes sensiveis: dados pessoais, informacoes financeiras, contratos confidenciais.</p>
<p>Prefira ferramentas que processam os arquivos localmente no seu navegador, sem enviar nada para servidores externos. Isso garante que seus documentos permanecem privados e seguros.</p>

<h2>Use nossas ferramentas de PDF gratuitas</h2>
<p>Oferecemos um conjunto completo de ferramentas para trabalhar com PDF, todas gratuitas e com privacidade total — nenhum arquivo sai do seu navegador. Junte PDFs, converta imagens e documentos Word para PDF, tudo de forma rapida e segura. Experimente agora!</p>
    `,
  },
];

export function getArticle(slug: string): Article | undefined {
  return allArticles.find((article) => article.slug === slug);
}
