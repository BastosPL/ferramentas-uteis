import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <span className="text-7xl block mb-6">🔍</span>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
        Página não encontrada
      </h1>
      <p className="text-gray-500 mb-8">
        Essa página não existe ou foi removida. Mas temos mais de 30
        ferramentas gratuitas esperando por você!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        🔧 Voltar para as ferramentas
      </Link>
    </div>
  );
}
