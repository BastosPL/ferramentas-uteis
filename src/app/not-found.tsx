import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-8">
          <Search className="w-10 h-10 text-slate-400" />
        </div>

        {/* Status */}
        <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
          Erro 404
        </span>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          P&aacute;gina n&atilde;o encontrada
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Essa p&aacute;gina n&atilde;o existe ou foi removida. Mas temos 24
          ferramentas gratuitas esperando por voc&ecirc;!
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para as ferramentas
        </Link>
      </div>
    </div>
  );
}
