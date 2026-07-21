"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie_consent";

type ConsentChoice = "granted" | "denied";

function updateConsent(choice: ConsentChoice) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: choice,
      analytics_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === "granted" || saved === "denied") {
      updateConsent(saved);
    } else {
      setVisible(true);
    }
  }, []);

  function handleChoice(choice: ConsentChoice) {
    localStorage.setItem(CONSENT_KEY, choice);
    updateConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] p-4 sm:p-5"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-700 flex-1">
          Utilizamos cookies para melhorar sua experiência, exibir anúncios
          relevantes e analisar o tráfego do site. Ao clicar em
          &quot;Aceitar&quot;, você concorda com o uso de cookies conforme nossa{" "}
          <Link
            href="/privacidade"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleChoice("denied")}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={() => handleChoice("granted")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
