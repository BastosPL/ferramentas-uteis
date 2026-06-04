import Link from "next/link";

const tools = [
  {
    title: "Calculadora de Juros Compostos",
    description: "Simule investimentos com juros compostos. Descubra quanto seu dinheiro pode render ao longo do tempo.",
    href: "/calculadora-juros-compostos",
    icon: "📈",
    keywords: "investimento, poupanca, rendimento, CDB, tesouro",
  },
  {
    title: "Gerador de Senha Segura",
    description: "Gere senhas fortes e aleatorias com letras, numeros e simbolos. Proteja suas contas online.",
    href: "/gerador-de-senha",
    icon: "🔐",
    keywords: "senha segura, password, aleatorio, seguranca",
  },
  {
    title: "Contador de Caracteres e Palavras",
    description: "Conte caracteres, palavras, frases e paragrafos. Ideal para redes sociais, SEO e redacoes.",
    href: "/contador-de-caracteres",
    icon: "📝",
    keywords: "caracteres, palavras, texto, twitter, instagram, seo",
  },
  {
    title: "Conversor de Unidades",
    description: "Converta unidades de comprimento, peso, temperatura, volume e area de forma rapida e precisa.",
    href: "/conversor-de-unidades",
    icon: "🔄",
    keywords: "metros, quilos, celsius, litros, conversao",
  },
  {
    title: "Calculadora de IMC",
    description: "Calcule seu Indice de Massa Corporal e descubra se voce esta no peso ideal.",
    href: "/calculadora-imc",
    icon: "⚖️",
    keywords: "peso ideal, saude, obesidade, magreza, massa corporal",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Ferramentas Online <span className="text-blue-600">Gratuitas</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculadoras, geradores e conversores que funcionam direto no seu navegador.
          Sem cadastro, sem instalacao, sem enviar dados para nenhum servidor.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <span className="text-4xl mb-4 block">{tool.icon}</span>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h2>
            <p className="text-gray-600 text-sm">{tool.description}</p>
          </Link>
        ))}

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl mb-4">🚀</span>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            Mais ferramentas em breve
          </h2>
          <p className="text-blue-600 text-sm">
            Novas ferramentas sao adicionadas toda semana. Salve nos favoritos!
          </p>
        </div>
      </section>

      <section className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-4">Por que usar nossas ferramentas?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-1">100% Gratis</h3>
            <p className="text-sm text-gray-600">
              Todas as ferramentas sao totalmente gratuitas, sem limites de uso e sem cadastro.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Privacidade Total</h3>
            <p className="text-sm text-gray-600">
              Tudo roda no seu navegador. Nenhum dado e enviado para servidores externos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Rapido e Simples</h3>
            <p className="text-sm text-gray-600">
              Interface limpa e direta. Sem popups, sem distracao. Resultado instantaneo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
