import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { baseDeDados } from "../../data/baseDeDados";

const VERSAO_ATUAL = __APP_VERSION__;
const CFG_STORAGE_KEY = "gestao_config_v1";
const THEME_SYNC_EVENT = "sade-theme-sync";

function lerModoNoturnoCompartilhado(fallback = false) {
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG_STORAGE_KEY) || "{}");
    if (typeof cfg.theme === "string") {
      return cfg.theme === "dark" || cfg.theme === "oled";
    }
  } catch {}
  return Boolean(fallback);
}

function salvarModoNoturnoCompartilhado(isDark) {
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG_STORAGE_KEY) || "{}");
    const nextTheme = isDark ? "dark" : "light";
    const updated = { ...cfg, theme: nextTheme };
    localStorage.setItem(CFG_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(THEME_SYNC_EVENT, {
        detail: { theme: nextTheme, isDark },
      }),
    );
  } catch {}
}

export default function MenuLateral({
  aberto,
  onFechar,
  modoNoturno,
  onAlternarModoNoturno,
  onAtivarModoSugestao,
  onLimparRota,
}) {
  const [modalGuiaAberto, setModalGuiaAberto] = useState(false);
  const [darkAtivo, setDarkAtivo] = useState(() =>
    lerModoNoturnoCompartilhado(modoNoturno),
  );

  useEffect(() => {
    setDarkAtivo(lerModoNoturnoCompartilhado(modoNoturno));
  }, [modoNoturno, aberto]);

  useEffect(() => {
    const handleSync = (event) => {
      if (typeof event.detail?.isDark === "boolean") {
        setDarkAtivo(event.detail.isDark);
      } else {
        setDarkAtivo(lerModoNoturnoCompartilhado(modoNoturno));
      }
    };

    const handleStorage = (e) => {
      if (e.key === CFG_STORAGE_KEY) {
        setDarkAtivo(lerModoNoturnoCompartilhado(modoNoturno));
      }
    };

    window.addEventListener(THEME_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(THEME_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [modoNoturno]);

  const handleToggleDark = () => {
    const nextDark = !darkAtivo;
    setDarkAtivo(nextDark);
    salvarModoNoturnoCompartilhado(nextDark);
    if (onAlternarModoNoturno) {
      onAlternarModoNoturno(nextDark);
    }
  };

  const verificarAtualizacoes = () => {
    const savedCfg = localStorage.getItem(CFG_STORAGE_KEY);
    localStorage.clear();
    if (savedCfg) {
      localStorage.setItem(CFG_STORAGE_KEY, savedCfg);
    }
    window.location.reload(true);
  };

  return (
    <>
      {aberto && (
        <div className="menu-overlay" onClick={onFechar}>
          <div
            className={`menu-content ${darkAtivo ? "dark" : "light"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="menu-header">
                <div className="menu-brand-wrapper">
                  <div className="menu-logo-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="100%"
                      height="100%"
                      aria-label="Logo SADE"
                    >
                      <defs>
                        <linearGradient
                          id="pinGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#ff5252" />
                          <stop offset="100%" stopColor="#d32f2f" />
                        </linearGradient>

                        <filter
                          id="shadow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="6"
                            stdDeviation="8"
                            floodColor="#000000"
                            floodOpacity="0.35"
                          />
                        </filter>
                      </defs>

                      <g filter="url(#shadow)">
                        <polygon
                          points="80,220 256,170 256,460 80,390"
                          fill="#4caf50"
                        />
                        <polygon
                          points="256,170 432,220 432,390 256,460"
                          fill="#29b6f6"
                        />
                        <polygon
                          points="130,235 256,195 256,415 130,360"
                          fill="#ffca28"
                        />
                        <polygon
                          points="256,195 382,235 382,360 256,415"
                          fill="#ffa726"
                        />
                        <polygon
                          points="80,220 170,255 170,380 80,390"
                          fill="#26a69a"
                        />
                        <polygon
                          points="342,255 432,220 432,390 342,355"
                          fill="#ab47bc"
                        />
                      </g>

                      <g filter="url(#shadow)">
                        <path
                          d="M256,40 C172,40 104,108 104,192 C104,288 256,432 256,432 C256,432 408,288 408,192 C408,108 340,40 256,40 Z"
                          fill="url(#pinGrad)"
                        />
                        <circle
                          cx="256"
                          cy="192"
                          r="56"
                          fill="#ffffff"
                          opacity="0.95"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="menu-title-wrapper">
                    <h2 className="menu-title">SADE</h2>
                    <span className="menu-subtitle">
                      Localizador de Quadras
                    </span>
                  </div>
                </div>

                <button
                  onClick={onFechar}
                  className="menu-close-btn"
                  title="Fechar menu"
                >
                  ✕
                </button>
              </div>

              <div className="menu-section-divider">
                <div onClick={handleToggleDark} className="menu-item-row">
                  <div className="menu-item-left">
                    <span className="menu-icon-yellow">
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
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                      </svg>
                    </span>
                    <span className="menu-item-label">Modo Noturno</span>
                  </div>
                  <SwitchVisual ativo={darkAtivo} />
                </div>
              </div>

              <div className="menu-section-divider">
                <div className="menu-items-list" style={{ marginTop: 0 }}>
                  <Link
                    to="/gastos"
                    onClick={onFechar}
                    style={{ textDecoration: "none" }}
                  >
                    <ItemMenu
                      icone={
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="5"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                      }
                      texto="Gestor de Gastos"
                    />
                  </Link>
                </div>
              </div>

              <div className="menu-items-list">
                <ItemMenu
                  icone={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  }
                  texto="Limpar Rota Atual"
                  onClick={() => {
                    if (onLimparRota) onLimparRota();
                    onFechar();
                  }}
                />

                <ItemMenu
                  icone={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  }
                  texto="Sugerir Nova Quadra"
                  onClick={() => {
                    onFechar();
                    if (onAtivarModoSugestao) onAtivarModoSugestao();
                  }}
                />

                <ItemMenu
                  icone={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  }
                  texto="Reportar Erro no Mapa"
                  onClick={() => {
                    window.open(
                      "https://forms.gle/e2cBxK6Q86CTtRcj9",
                      "_blank",
                    );
                    onFechar();
                  }}
                />

                <ItemMenu
                  icone={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  }
                  texto="Guia de Uso"
                  onClick={() => {
                    onFechar();
                    setModalGuiaAberto(true);
                  }}
                />

                <ItemMenu
                  icone={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00875a"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                  }
                  texto="Verificar Atualizações"
                  onClick={verificarAtualizacoes}
                />
              </div>
            </div>

            <div className="menu-footer">
              <img
                src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Flucasdosantu.github.io%2Fquadras-sade%2F&label=Visitas&icon=pin-map&color=%23198754&message=&style=for-the-badge&tz=UTC"
                alt="Contador de Visitas"
                className="menu-counter-img"
              />
              <p className="menu-version-text">
                Versão {VERSAO_ATUAL} • © 2026 SADE
              </p>
            </div>
          </div>
        </div>
      )}

      {modalGuiaAberto && (
        <div
          className="modal-overlay"
          onClick={() => setModalGuiaAberto(false)}
        >
          <div
            className={`modal-content ${darkAtivo ? "dark" : "light"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-box">
              <h3 className="modal-title-text">📖 Guia de Uso do SADE</h3>
              <button
                onClick={() => setModalGuiaAberto(false)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-body-text">
              <p className="modal-p">
                <strong>1. Pesquisa:</strong> Busque por Quadra, Bairro ou CEP
                na barra superior.
              </p>
              <p className="modal-p">
                <strong>2. Detalhes:</strong> Toque em qualquer quadra no mapa
                para visualizar informações e rotas.
              </p>
              <p className="modal-p">
                <strong>3. Modo Noturno:</strong> Ative no menu para usar o mapa
                com fundo escuro (Amoled).
              </p>
            </div>
            <button
              onClick={() => setModalGuiaAberto(false)}
              className="modal-action-btn"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SwitchVisual({ ativo }) {
  return (
    <div className={`switch-track ${ativo ? "ativo" : ""}`}>
      <div className={`switch-thumb ${ativo ? "ativo" : ""}`} />
    </div>
  );
}

function ItemMenu({ icone, texto, onClick }) {
  return (
    <button onClick={onClick} className="menu-item-button">
      <span className="menu-item-icon-wrapper">{icone}</span>
      <span>{texto}</span>
    </button>
  );
}
