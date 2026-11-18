import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { baseDeDados } from "../../data/baseDeDados";
import { useGps } from "../../hooks/useGps";
import { useRota } from "../../hooks/useRota";
import BarraBusca from "./BarraBusca";
import MenuLateral from "./MenuLateral";
import PainelRota from "./PainelRota";

export default function Mapa({ onMudancaSelecao }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const marcadorAtualRef = useRef(null);

  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [tipoCamada, setTipoCamada] = useState("rua");
  const [menuAberto, setMenuAberto] = useState(false);
  const [modoNoturno, setModoNoturno] = useState(false);
  const [modoSugestao, setModoSugestao] = useState(false);

  const modoSugestaoRef = useRef(modoSugestao);
  modoSugestaoRef.current = modoSugestao;

  const [touchStartY, setTouchStartY] = useState(null);
  const [deslocamentoY, setDeslocamentoY] = useState(0);

  const { coordsUsuario, minhaLocalizacao, calcularDistancia } = useGps(
    mapInstanceRef.current,
  );
  const {
    pontosDaRota,
    adicionarARota,
    removerDaRota,
    limparRota,
    gerarLinkGoogleMaps,
  } = useRota(coordsUsuario);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      const layerRua = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}inspect/{x}/{y}.png",
        { maxZoom: 19, crossOrigin: true },
      );

      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19, crossOrigin: true },
      );

      const map = L.map(mapRef.current, {
        layers: [tileLayer],
        zoomControl: false,
      }).setView([-15.943, -48.265], 13);

      mapInstanceRef.current = map;

      map.on("click", (e) => {
        if (modoSugestaoRef.current) {
          const lat = e.latlng.lat.toFixed(6);
          const lng = e.latlng.lng.toFixed(6);
          const coords = `${lat},${lng}`;

          setModoSugestao(false);

          const urlForms = `https://docs.google.com/forms/d/e/1FAIpQLSc5BV7pRFTZzJW-XfCjkWTLYu16VFZ47qolVYP7eWW4RbxzAg/viewform?entry.1414645035=${coords}`;
          window.open(urlForms, "_blank");
          return;
        }

        let pProx = null;
        let mDistSq = 0.0000002;

        baseDeDados.forEach((p) => {
          const dSq =
            Math.pow(parseFloat(p.lat) - e.latlng.lat, 2) +
            Math.pow(parseFloat(p.lng) - e.latlng.lng, 2);
          if (dSq < mDistSq) {
            mDistSq = dSq;
            pProx = p;
          }
        });

        if (pProx) {
          exibirPontoNoMapa(pProx);
        }
      });
    }
  }, []);

  const reportarErro = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSeY6iMNQ4fUqIBU2QOgqm5InyaXd1x2z0-J9Fn3gLqSJ01HLw/viewform",
      "_blank",
    );
  };

  const exibirPontoNoMapa = (local) => {
    setLocalSelecionado(local);
    if (onMudancaSelecao) onMudancaSelecao(local);
    setDeslocamentoY(0);
    const lat = parseFloat(local.lat);
    const lng = parseFloat(local.lng);

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      map.flyTo([lat, lng], 16, { animate: true });

      setTimeout(() => {
        map.panBy([0, 120], { animate: true });
      }, 300);

      if (marcadorAtualRef.current) {
        map.removeLayer(marcadorAtualRef.current);
      }

      marcadorAtualRef.current = L.marker([lat, lng]).addTo(map);
    }
  };

  const fecharCard = () => {
    setLocalSelecionado(null);
    setDeslocamentoY(0);
    if (onMudancaSelecao) onMudancaSelecao(null);
    if (marcadorAtualRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(marcadorAtualRef.current);
      marcadorAtualRef.current = null;
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    if (diff > 0) {
      setDeslocamentoY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (deslocamentoY > 100) {
      fecharCard();
    } else {
      setDeslocamentoY(0);
    }
    setTouchStartY(null);
  };

  const alternarSatelite = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    if (tipoCamada === "rua") {
      L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        crossOrigin: true,
      }).addTo(map);
      setTipoCamada("satelite");
    } else {
      L.tileLayer("https://{s}.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);
      setTipoCamada("rua");
    }
  };

  const corFundoBotoes = modoNoturno ? "#18181b" : "white";
  const corIconeBotoes = modoNoturno ? "#f8fafc" : "#333";
  const bordaBotoes = modoNoturno ? "1px solid #27272a" : "none";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        backgroundColor: modoNoturno ? "#000000" : "#ffffff",
      }}
    >
      <BarraBusca
        onSelecionarPonto={exibirPontoNoMapa}
        onAbrirMenu={() => setMenuAberto(true)}
        modoNoturno={modoNoturno}
      />

      <MenuLateral
        aberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        modoNoturno={modoNoturno}
        onAlternarModoNoturno={() => setModoNoturno(!modoNoturno)}
        onAtivarModoSugestao={() => setModoSugestao(true)}
        onReportarErro={reportarErro}
        onLimparRota={limparRota}
      />

      <PainelRota
        pontosDaRota={pontosDaRota}
        onRemoverDaRota={removerDaRota}
        onAbrirGoogleMaps={gerarLinkGoogleMaps}
        modoNoturno={modoNoturno}
      />

      {modoSugestao && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "16px",
            right: "16px",
            zIndex: 1200,
            background: "#0f172a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            border: "1px solid #27272a",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            📍 Clique na quadra que deseja sugerir no mapa
          </span>
          <button
            onClick={() => setModoSugestao(false)}
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
            pontosDaRota && pontosDaRota.length > 0
              ? "145px"
              : modoSugestao
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
          onClick={() => mapInstanceRef.current?.zoomIn()}
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
          onClick={() => mapInstanceRef.current?.zoomOut()}
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
          onClick={alternarSatelite}
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
          onClick={() => setModoSugestao(true)}
          style={{
            ...estiloBotaoFlutuante,
            background: modoSugestao ? "#00875a" : corFundoBotoes,
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
          onClick={minhaLocalizacao}
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

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          filter: modoNoturno
            ? "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)"
            : "none",
          transition: "filter 0.3s ease",
        }}
      />

      {localSelecionado && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            background: modoNoturno ? "#121212" : "white",
            color: modoNoturno ? "#f8fafc" : "#000000",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            padding: "20px",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
            borderTop: modoNoturno ? "1px solid #27272a" : "none",
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
              background: modoNoturno ? "#3f3f46" : "#ccc",
              borderRadius: "2px",
              margin: "0 auto 15px",
              cursor: "pointer",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <span
                style={{
                  background: modoNoturno ? "#064e3b" : "#e6f4ea",
                  color: modoNoturno ? "#34d399" : "#137333",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {localSelecionado.bairro}
              </span>
              <h2
                style={{
                  margin: "8px 0 4px",
                  fontSize: "20px",
                  color: modoNoturno ? "#f8fafc" : "#0f172a",
                }}
              >
                Quadra {localSelecionado.quadra}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: modoNoturno ? "#a1a1aa" : "#666",
                  fontSize: "13px",
                }}
              >
                CEP: {localSelecionado.cep || "---"}
              </p>
            </div>
            <button
              onClick={fecharCard}
              style={{
                background: "none",
                border: "none",
                color: modoNoturno ? "#f8fafc" : "#000",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <div
              style={{
                flex: 1,
                background: modoNoturno ? "#18181b" : "#f8f9fa",
                padding: "10px",
                borderRadius: "8px",
                border: modoNoturno ? "1px solid #27272a" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: modoNoturno ? "#a1a1aa" : "#777",
                  display: "block",
                }}
              >
                QUADRA
              </span>
              <strong style={{ color: modoNoturno ? "#f8fafc" : "#111827" }}>
                {localSelecionado.quadra}
              </strong>
            </div>
            <div
              style={{
                flex: 1,
                background: modoNoturno ? "#18181b" : "#f8f9fa",
                padding: "10px",
                borderRadius: "8px",
                border: modoNoturno ? "1px solid #27272a" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: modoNoturno ? "#a1a1aa" : "#777",
                  display: "block",
                }}
              >
                SITUAÇÃO
              </span>
              <span style={{ color: "#34d399", fontWeight: "bold" }}>
                ● Mapeada
              </span>
            </div>
          </div>

          {coordsUsuario && (
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "13px",
                color: modoNoturno ? "#d4d4d8" : "#444",
              }}
            >
              📍 A{" "}
              {calcularDistancia(localSelecionado.lat, localSelecionado.lng)} de
              você
            </p>
          )}

          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${localSelecionado.lat},${localSelecionado.lng}`,
                "_blank",
              )
            }
            style={{
              width: "100%",
              backgroundColor: "#00875a",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "bold",
              marginTop: "15px",
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
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            <span>IR PARA O LOCAL</span>
          </button>

          <button
            onClick={() => adicionarARota(localSelecionado)}
            style={{
              width: "100%",
              backgroundColor: modoNoturno ? "#27272a" : "#0f172a",
              color: "white",
              border: modoNoturno ? "1px solid #3f3f46" : "none",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "bold",
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
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Adicionar à Rota ({pontosDaRota.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}

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
