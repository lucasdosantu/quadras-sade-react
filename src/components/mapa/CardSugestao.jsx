import React from "react";

export default function CardSugestao({
  pontoSugestao,
  modoNoturno,
  deslocamentoY,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onFechar,
  onEnviarSugestao,
  onAbrirQuadraExistente,
}) {
  if (!pontoSugestao) return null;

  const quadraExistente = pontoSugestao.quadraExistente || null;
  const jaMapeada = Boolean(quadraExistente);

  return (
    <div
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
              background: jaMapeada
                ? modoNoturno
                  ? "#78350f"
                  : "#fef3c7"
                : modoNoturno
                  ? "#0c4a6e"
                  : "#e0f2fe",
              color: jaMapeada
                ? modoNoturno
                  ? "#fbbf24"
                  : "#92400e"
                : modoNoturno
                  ? "#38bdf8"
                  : "#0369a1",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {jaMapeada ? "Já mapeada" : "Não mapeada"}
          </span>
        </div>

        <h2
          style={{
            margin: "10px 0 4px",
            fontSize: "20px",
            fontWeight: "700",
            color: modoNoturno ? "#f4f4f5" : "#111827",
          }}
        >
          {jaMapeada
            ? `Quadra ${quadraExistente.quadra} · ${quadraExistente.bairro}`
            : "Quadra fora da base"}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            lineHeight: 1.45,
            color: jaMapeada
              ? modoNoturno
                ? "#fbbf24"
                : "#b45309"
              : modoNoturno
                ? "#38bdf8"
                : "#0284c7",
          }}
        >
          {jaMapeada
            ? "• Já existe uma quadra cadastrada perto deste ponto. Confira antes de sugerir."
            : "• Arraste o pin até a quadra desejada e envie para cadastro."}
        </p>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: modoNoturno ? "#a1a1aa" : "#52525b",
          }}
        >
          Coordenadas: {pontoSugestao.coordsTexto}
        </p>
      </div>

      {jaMapeada ? (
        <>
          <button
            onClick={() => onAbrirQuadraExistente(quadraExistente)}
            style={{
              width: "100%",
              backgroundColor: modoNoturno ? "#10b981" : "#00875a",
              color: modoNoturno ? "#052e16" : "#ffffff",
              border: "none",
              padding: "13px 16px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "14px",
              marginTop: "16px",
              cursor: "pointer",
            }}
          >
            Ver quadra cadastrada
          </button>

          <button
            onClick={onEnviarSugestao}
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
            }}
          >
            Sugerir mesmo assim
          </button>
        </>
      ) : (
        <button
          onClick={onEnviarSugestao}
          style={{
            width: "100%",
            backgroundColor: modoNoturno ? "#10b981" : "#00875a",
            color: modoNoturno ? "#052e16" : "#ffffff",
            border: "none",
            padding: "13px 16px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "14px",
            marginTop: "16px",
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Sugerir esta quadra</span>
        </button>
      )}
    </div>
  );
}
