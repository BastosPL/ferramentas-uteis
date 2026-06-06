"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <span className="text-5xl block mb-4">⚠️</span>
      <h2 className="text-2xl font-bold mb-3 text-gray-900">
        Ops! Algo deu errado
      </h2>
      <p className="text-gray-600 mb-6">
        Ocorreu um erro ao carregar esta ferramenta. Tente novamente.
      </p>
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Tentar novamente
      </button>
      <p className="text-xs text-gray-400 mt-4">
        Dica: se o erro persistir, tente Ctrl+Shift+R para limpar o cache.
      </p>
    </div>
  );
}
