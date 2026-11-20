import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { baseDeDados } from "../../data/baseDeDados";
import { useGps } from "../../hooks/useGps";
import { useRota } from "../../hooks/useRota";
import BarraBusca from "./BarraBusca";
import MenuLateral from "./MenuLateral";
import PainelRota from "./PainelRota";
import ControlesMapa from "./ControlesMapa";
import CardQuadra from "./CardQuadra";
import CardSugestao from "./CardSugestao";
import { criarIconeQuadraSvg, encontrarQuadraProxima } from "./pinosMapa";

const CFG_STORAGE_KEY = "gestao_config_v1";
const THEME_SYNC_EVENT = "sade-theme-sync";
const SUGESTAO_FORMS_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLSc5BV7pRFTZzJW-XfCjkWTLYu16VFZ47qolVYP7eWW4RbxzAg/viewform?entry.1414645035=";

function lerModoNoturnoSalvo() {
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG_STORAGE_KEY) || "{}");
    if (typeof cfg.theme === "string") {
      return cfg.theme === "dark" || cfg.theme === "oled";
    }
  } catch {}
  return false;
}

function salvarModoNoturnoSalvo(isDark) {
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG_STORAGE_KEY) || "{}");
    const nextTheme = isDark ? "dark" : "light";
    localStorage.setItem(
      CFG_STORAGE_KEY,
      JSON.stringify({ ...cfg, theme: nextTheme }),
    );
    window.dispatchEvent(
      new CustomEvent(THEME_SYNC_EVENT, {
        detail: { theme: nextTheme, isDark },
      }),
    );
  } catch {}
}

export default function Mapa({ onMudancaSelecao }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const marcadorAtualRef = useRef(null);
  const marcadorSugestaoRef = useRef(null);
  const camadaRuaRef = useRef(null);
  const camadaSateliteRef = useRef(null);
  const panPendenteRef = useRef(null);

  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [pontoSugestao, setPontoSugestao] = useState(null);
  const [tipoCamada, setTipoCamada] = useState("rua");
  const [menuAberto, setMenuAberto] = useState(false);
  const [modoNoturno, setModoNoturno] = useState(() => lerModoNoturnoSalvo());
  const [modoSugestao, setModoSugestao] = useState(false);

  const modoSugestaoRef = useRef(modoSugestao);
  modoSugestaoRef.current = modoSugestao;

  const modoNoturnoRef = useRef(modoNoturno);
  modoNoturnoRef.current = modoNoturno;

  const [touchStartY, setTouchStartY] = useState(null);
  const [deslocamentoY, setDeslocamentoY] = useState(0);

  const {
    coordsUsuario,
    minhaLocalizacao,
    pararSeguimentoGps,
    calcularDistancia,
  } = useGps(mapInstanceRef.current);

  const pararSeguimentoRef = useRef(pararSeguimentoGps);
  pararSeguimentoRef.current = pararSeguimentoGps;

  const {
    pontosDaRota,
    adicionarARota,
    removerDaRota,
    limparRota,
    gerarLinkGoogleMaps,
  } = useRota(coordsUsuario);

  useEffect(() => {
    setModoNoturno(lerModoNoturnoSalvo());

    const handleSync = (event) => {
      if (typeof event.detail?.isDark === "boolean") {
        setModoNoturno(event.detail.isDark);
      } else {
        setModoNoturno(lerModoNoturnoSalvo());
      }
    };

    const handleStorage = (e) => {
      if (e.key === CFG_STORAGE_KEY) {
        setModoNoturno(lerModoNoturnoSalvo());
      }
    };

    window.addEventListener(THEME_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(THEME_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!onMudancaSelecao) return;
    const temOverlayAtivo = Boolean(
      localSelecionado || (modoSugestao && pontoSugestao) || menuAberto,
    );
    onMudancaSelecao(temOverlayAtivo);
  }, [
    localSelecionado,
    modoSugestao,
    pontoSugestao,
    menuAberto,
    onMudancaSelecao,
  ]);

  useEffect(() => {
    if (marcadorAtualRef.current) {
      marcadorAtualRef.current.setIcon(
        criarIconeQuadraSvg(modoNoturno, "cadastrada"),
      );
    }
    if (marcadorSugestaoRef.current) {
      marcadorSugestaoRef.current.setIcon(
        criarIconeQuadraSvg(modoNoturno, "sugestao"),
      );
    }
  }, [modoNoturno]);

  const alternarModoNoturno = (nextValue) => {
    const nextDark = typeof nextValue === "boolean" ? nextValue : !modoNoturno;
    setModoNoturno(nextDark);
    salvarModoNoturnoSalvo(nextDark);
  };

  const limparPanPendente = (map) => {
    if (panPendenteRef.current && map) {
      map.off("moveend", panPendenteRef.current);
      panPendenteRef.current = null;
    }
  };

  const removerMarcadorQuadra = (map) => {
    if (marcadorAtualRef.current && map) {
      map.removeLayer(marcadorAtualRef.current);
      marcadorAtualRef.current = null;
    }
  };

  const removerMarcadorSugestao = (map) => {
    if (marcadorSugestaoRef.current && map) {
      map.removeLayer(marcadorSugestaoRef.current);
      marcadorSugestaoRef.current = null;
    }
  };

  const atualizarDadosSugestao = (latNum, lngNum) => {
    const latFixed = Number(latNum);
    const lngFixed = Number(lngNum);
    const quadraExistente = encontrarQuadraProxima(
      baseDeDados,
      latFixed,
      lngFixed,
    );

    setPontoSugestao({
      lat: latFixed,
      lng: lngFixed,
      coordsTexto: `${latFixed.toFixed(6)}, ${lngFixed.toFixed(6)}`,
      quadraExistente,
    });
  };

  const posicionarPinSugestao = (latNum, lngNum) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    removerMarcadorQuadra(map);
    setLocalSelecionado(null);
    setDeslocamentoY(0);
    atualizarDadosSugestao(latNum, lngNum);

    if (marcadorSugestaoRef.current) {
      marcadorSugestaoRef.current.setLatLng([latNum, lngNum]);
      marcadorSugestaoRef.current.setIcon(
        criarIconeQuadraSvg(modoNoturnoRef.current, "sugestao"),
      );
      return;
    }

    const marker = L.marker([latNum, lngNum], {
      icon: criarIconeQuadraSvg(modoNoturnoRef.current, "sugestao"),
      draggable: true,
      zIndexOffset: 900,
    }).addTo(map);

    marker.on("dragstart", () => {
      pararSeguimentoRef.current?.();
      setDeslocamentoY(0);
    });

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      atualizarDadosSugestao(pos.lat, pos.lng);
    });

    marcadorSugestaoRef.current = marker;
  };

  const ativarModoSugestao = () => {
    pararSeguimentoRef.current?.();
    setModoSugestao(true);

    const map = mapInstanceRef.current;
    if (!map) return;

    limparPanPendente(map);
    const centroAtual = map.getCenter();
    posicionarPinSugestao(centroAtual.lat, centroAtual.lng);
  };

  const desativarModoSugestao = () => {
    setModoSugestao(false);
    setPontoSugestao(null);
    setDeslocamentoY(0);
    removerMarcadorSugestao(mapInstanceRef.current);
  };

  const enviarSugestaoQuadra = () => {
    if (!pontoSugestao) return;
    const coordsQuery = `${pontoSugestao.lat.toFixed(6)},${pontoSugestao.lng.toFixed(6)}`;
    window.open(`${SUGESTAO_FORMS_BASE}${coordsQuery}`, "_blank");
    desativarModoSugestao();
  };

  const posicionarPinSugestaoRef = useRef(posicionarPinSugestao);
  posicionarPinSugestaoRef.current = posicionarPinSugestao;

  useEffect(() => {
    if (!mapInstanceRef.current) {
      const camadaRua = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19, crossOrigin: true },
      );

      const camadaSatelite = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          crossOrigin: true,
        },
      );

      camadaRuaRef.current = camadaRua;
      camadaSateliteRef.current = camadaSatelite;

      const map = L.map(mapRef.current, {
        layers: [camadaRua],
        zoomControl: false,
      }).setView([-15.943, -48.265], 13);

      mapInstanceRef.current = map;

      map.on("click", (e) => {
        if (modoSugestaoRef.current) {
          pararSeguimentoRef.current?.();
          posicionarPinSugestaoRef.current?.(e.latlng.lat, e.latlng.lng);
          return;
        }

        const pProx = encontrarQuadraProxima(
          baseDeDados,
          e.latlng.lat,
          e.latlng.lng,
          0.0000002,
        );

        if (pProx) {
          pararSeguimentoRef.current?.();
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
    pararSeguimentoRef.current?.();
    setModoSugestao(false);
    setPontoSugestao(null);
    removerMarcadorSugestao(mapInstanceRef.current);

    setLocalSelecionado(local);
    setDeslocamentoY(0);
    const lat = parseFloat(local.lat);
    const lng = parseFloat(local.lng);

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      limparPanPendente(map);
      removerMarcadorQuadra(map);

      marcadorAtualRef.current = L.marker([lat, lng], {
        icon: criarIconeQuadraSvg(modoNoturnoRef.current, "cadastrada"),
        interactive: false,
      }).addTo(map);

      const zoomAlvo = 16;
      const deslocamentoPx = Math.round(map.getSize().y * 0.18);
      const pontoAlvo = map.project([lat, lng], zoomAlvo);
      const centroAjustado = map.unproject(
        L.point(pontoAlvo.x, pontoAlvo.y + deslocamentoPx),
        zoomAlvo,
      );

      map.stop();
      map.flyTo(centroAjustado, zoomAlvo, { animate: true });
    }
  };

  const fecharCard = () => {
    setLocalSelecionado(null);
    setDeslocamentoY(0);
    if (mapInstanceRef.current) {
      limparPanPendente(mapInstanceRef.current);
      removerMarcadorQuadra(mapInstanceRef.current);
    }
    if (modoSugestao) {
      desativarModoSugestao();
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
    if (!map || !camadaRuaRef.current || !camadaSateliteRef.current) return;

    if (tipoCamada === "rua") {
      map.removeLayer(camadaRuaRef.current);
      camadaSateliteRef.current.addTo(map);
      setTipoCamada("satelite");
    } else {
      map.removeLayer(camadaSateliteRef.current);
      camadaRuaRef.current.addTo(map);
      setTipoCamada("rua");
    }
  };

  const cardAberto = Boolean(
    localSelecionado || (modoSugestao && pontoSugestao),
  );
  const distanciaTexto = localSelecionado
    ? calcularDistancia(localSelecionado.lat, localSelecionado.lng)
    : null;

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
        onAlternarModoNoturno={alternarModoNoturno}
        onAtivarModoSugestao={ativarModoSugestao}
        onReportarErro={reportarErro}
        onLimparRota={limparRota}
      />

      <PainelRota
        pontosDaRota={pontosDaRota}
        onRemoverDaRota={removerDaRota}
        onAbrirGoogleMaps={gerarLinkGoogleMaps}
        modoNoturno={modoNoturno}
      />

      <ControlesMapa
        modoNoturno={modoNoturno}
        modoSugestao={modoSugestao}
        cardAberto={cardAberto}
        pontosDaRotaCount={pontosDaRota.length}
        onZoomIn={() => mapInstanceRef.current?.zoomIn()}
        onZoomOut={() => mapInstanceRef.current?.zoomOut()}
        onAlternarCamada={alternarSatelite}
        onToggleSugestao={() =>
          modoSugestao ? desativarModoSugestao() : ativarModoSugestao()
        }
        onFecharBannerSugestao={desativarModoSugestao}
        onMinhaLocalizacao={minhaLocalizacao}
      />

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          filter: !modoNoturno
            ? "none"
            : tipoCamada === "satelite"
              ? "brightness(0.62) contrast(1.05)"
              : "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)",
          transition: "filter 0.5s ease",
        }}
      />

      {modoSugestao && pontoSugestao ? (
        <CardSugestao
          pontoSugestao={pontoSugestao}
          modoNoturno={modoNoturno}
          deslocamentoY={deslocamentoY}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onFechar={desativarModoSugestao}
          onEnviarSugestao={enviarSugestaoQuadra}
          onAbrirQuadraExistente={exibirPontoNoMapa}
        />
      ) : (
        <CardQuadra
          local={localSelecionado}
          modoNoturno={modoNoturno}
          distanciaTexto={distanciaTexto}
          pontosDaRotaCount={pontosDaRota.length}
          deslocamentoY={deslocamentoY}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onFechar={fecharCard}
          onAdicionarRota={adicionarARota}
        />
      )}
    </div>
  );
}
