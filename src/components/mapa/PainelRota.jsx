import React, { useState } from "react";

export default function PainelRota({
  pontosDaRota,
  onRemoverDaRota,
  onAbrirGoogleMaps,
  modoNoturno,
}) {
  const [minimizado, setMinimizado] = useState(false);

  if (!pontosDaRota || pontosDaRota.length === 0) return null;

  const bgFundo = modoNoturno ? "#121212" : "#ffffff";
  const corTexto = modoNoturno ? "#f8fafc" : "#0f172a";
  const corItemBg = modoNoturno ? "#18181b" : "#f8f9fa";
  const corBorda = modoNoturno ? "#27272a" : "#e2e8f0";

  return (
    <div
      className="painel-rota-container"
      style={{
        position: "absolute",
        top: "76px",
        left: "16px",
        right: "76px",
        zIndex: 800,
        backgroundColor: bgFundo,
        color: corTexto,
        borderRadius: "16px",
        boxShadow: modoNoturno
          ? "0 8px 24px rgba(0,0,0,0.6)"
          : "0 6px 20px rgba(0,0,0,0.15)",
        border: `1px solid ${corBorda}`,
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      <div
        onClick={() => setMinimizado(!minimizado)}
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderBottom: !minimizado ? `1px solid ${corBorda}` : "none",
          backgroundColor: modoNoturno ? "#18181b" : "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00875a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Minha Rota ({pontosDaRota.length})</span>
        </div>

        <span
          style={{
            fontSize: "12px",
            color: "#00875a",
            transform: minimizado ? "rotate(-90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </div>

      {!minimizado && (
        <div
          style={{
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            maxHeight: "180px",
            overflowY: "auto",
          }}
        >
          {pontosDaRota.map((ponto, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: corItemBg,
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${corBorda}`,
                fontSize: "13px",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginRight: "8px",
                }}
              >
                {ponto.quadra} - {ponto.bairro}
              </span>
              <button
                onClick={() => onRemoverDaRota(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "14px",
                  cursor: "pointer",
                  padding: "2px 4px",
                  flexShrink: 0,
                }}
                title="Remover ponto"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={onAbrirGoogleMaps}
            style={{
              width: "100%",
              backgroundColor: "#00875a",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginTop: "4px",
              boxShadow: "0 4px 12px rgba(0, 135, 90, 0.3)",
            }}
          >
            <span>ABRIR NO GOOGLE MAPS</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
