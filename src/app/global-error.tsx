"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "40px", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "80px auto" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "16px", color: "#1e40af" }}>
            🔧 FerramentaUtil
          </h1>
          <p style={{ fontSize: "16px", color: "#374151", marginBottom: "24px" }}>
            Ocorreu um erro inesperado. Clique abaixo para tentar novamente.
          </p>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Tentar novamente
          </button>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
            Se o problema persistir, tente limpar o cache do navegador (Ctrl+Shift+R).
          </p>
        </div>
      </body>
    </html>
  );
}
