import React from "react";

export default function CardQuadra({
  local,
  modoNoturno,
  distanciaTexto,
  pontosDaRotaCount,
  deslocamentoY,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onFechar,
  onAdicionarRota,
}) {
  if (!local) return null;

  const obsTexto = typeof local.obs === "string" ? local.obs.trim() : "";
  const metaPartes = [
    distanciaTexto ? `${distanciaTexto} de você` : null,
    local.cep ? `CEP ${local.cep}` : null,
  ].filter(Boolean);

  return (
    <div
      className="card-quadra-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        background: modoNoturno ? "#09090b" : "#ffffff",
        color: modoNoturno ? "#f4f4f5" : "#111827",
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        padding: "18px 20px 22px",
        boxShadow: "0 -6px 24px rgba(0,0,0,0.45)",
        borderTop: modoNoturno ? "1px solid #27272a" : "1px solid #e5e7eb",
        transform: `translateY(${Math.max(0, deslocamentoY)}px)`,
        transition:
          deslocamentoY === 0
            ? "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "4px",
          background: modoNoturno ? "#3f3f46" : "#d4d4d8",
          borderRadius: "2px",
          margin: "0 auto 14px",
        }}
      />

      <div style={{ position: "relative" }}>
        <button
          onClick={onFechar}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "none",
            border: "none",
            color: modoNoturno ? "#f4f4f5" : "#111827",
            fontSize: "18px",
            lineHeight: 1,
            padding: "2px 4px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              background: modoNoturno ? "#064e3b" : "#e6f4ea",
              color: modoNoturno ? "#34d399" : "#137333",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {local.bairro}
          </span>
        </div>

        <h2
          style={{
            margin: "10px 0 0",
            fontSize: "20px",
            fontWeight: "700",
            color: modoNoturno ? "#f4f4f5" : "#111827",
          }}
        >
          Quadra {local.quadra}
        </h2>

        {obsTexto && (
          <p
            style={{
              margin: "8px 0 0",
              padding: "7px 10px",
              borderRadius: "10px",
              background: modoNoturno ? "#141417" : "#f4f6f5",
              borderLeft: `3px solid ${modoNoturno ? "#34d399" : "#00875a"}`,
              fontSize: "13px",
              fontWeight: "500",
              lineHeight: 1.4,
              color: modoNoturno ? "#34d399" : "#137333",
            }}
          >
            • {obsTexto}
          </p>
        )}

        {metaPartes.length > 0 && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "13px",
              color: modoNoturno ? "#a1a1aa" : "#52525b",
            }}
          >
            {metaPartes.join(" · ")}
          </p>
        )}
      </div>

      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${local.lat},${local.lng}`,
            "_blank",
          )
        }
        style={{
          width: "100%",
          backgroundColor: modoNoturno ? "#10b981" : "#00875a",
          color: modoNoturno ? "#052e16" : "#ffffff",
          border: "none",
          padding: "13px 16px",
          borderRadius: "12px",
          fontWeight: "700",
          fontSize: "14px",
          marginTop: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
        <span>Ir para o local</span>
      </button>

      <button
        onClick={() => onAdicionarRota(local)}
        style={{
          width: "100%",
          backgroundColor: modoNoturno ? "#141417" : "#f4f6f5",
          color: modoNoturno ? "#f4f4f5" : "#111827",
          border: modoNoturno ? "1px solid #27272a" : "1px solid #d4d4d8",
          padding: "12px 16px",
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "14px",
          marginTop: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Adicionar à rota ({pontosDaRotaCount})</span>
      </button>
    </div>
  );
}
