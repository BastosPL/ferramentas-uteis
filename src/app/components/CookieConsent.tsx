"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white rounded-t-xl px-4 py-4 md:px-8 md:py-5 shadow-lg"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm text-gray-200 flex-1">
          Este site utiliza cookies para melhorar sua experiência e exibir
          anúncios personalizados. Ao continuar navegando, você concorda com
          nossa{" "}
          <Link
            href="/privacidade"
            className="underline text-blue-400 hover:text-blue-300"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
