import React from "react";

const estiloBotaoFlutuante = {
  width: "44px",
  height: "44px",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default function ControlesMapa({
  modoNoturno,
  modoSugestao,
  cardAberto,
  pontosDaRotaCount,
  onZoomIn,
  onZoomOut,
  onAlternarCamada,
  onToggleSugestao,
  onFecharBannerSugestao,
  onMinhaLocalizacao,
}) {
  const corFundoBotoes = modoNoturno ? "#18181b" : "white";
  const corIconeBotoes = modoNoturno ? "#f8fafc" : "#333";
  const bordaBotoes = modoNoturno ? "1px solid #27272a" : "none";

  return (
    <>
      {modoSugestao && !cardAberto && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "16px",
            right: "16px",
            zIndex: 1200,
            background: modoNoturno ? "#141417" : "#0f172a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 15px rgba(0,0,0,0.45)",
            border: "1px solid #27272a",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: "500" }}>
            Arraste o pin ou toque no mapa para posicionar a quadra
          </span>
          <button
            onClick={onFecharBannerSugestao}
            aria-label="Sair do modo sugestão"
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top:
            pontosDaRotaCount > 0
              ? "145px"
              : modoSugestao && !cardAberto
                ? "140px"
                : "90px",
          right: "16px",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          transition: "top 0.3s ease",
        }}
      >
        <button
          onClick={onZoomIn}
          style={{
            ...estiloBotaoFlutuante,
            background: corFundoBotoes,
            color: corIconeBotoes,
            border: bordaBotoes,
          }}
          title="Zoom In"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <button
          onClick={onZoomOut}
          style={{
            ...estiloBotaoFlutuante,
            background: corFundoBotoes,
            color: corIconeBotoes,
            border: bordaBotoes,
          }}
          title="Zoom Out"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <button
          onClick={onAlternarCamada}
          style={{
            ...estiloBotaoFlutuante,
            background: corFundoBotoes,
            color: corIconeBotoes,
            border: bordaBotoes,
          }}
          title="Mudar Camada"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
        </button>

        <button
          onClick={onToggleSugestao}
          style={{
            ...estiloBotaoFlutuante,
            background: modoSugestao ? "#0284c7" : corFundoBotoes,
            color: modoSugestao ? "white" : corIconeBotoes,
            border: bordaBotoes,
          }}
          title="Sugerir Nova Quadra"
        >
          <svg
            width="20"
            height="20"
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
        </button>

        <button
          onClick={onMinhaLocalizacao}
          style={{
            ...estiloBotaoFlutuante,
            background: corFundoBotoes,
            color: corIconeBotoes,
            border: bordaBotoes,
          }}
          title="Meu GPS"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </button>
      </div>
    </>
  );
}
