import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VERSAO_ATUAL = __APP_VERSION__;
const FINANCE_STORAGE_KEY = "gestao_financeira_v1";
const CAT_STORAGE_KEY = "gestao_categorias_v1";
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
  onReportarErro,
  onLimparRota,
  onAbrirGuiaUso,
  onAbrirTermosUso,
  totalQuadras = 0,
}) {
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

  const verificarAtualizacoes = async () => {
    const preservedEntries = {};
    [FINANCE_STORAGE_KEY, CAT_STORAGE_KEY, CFG_STORAGE_KEY].forEach((key) => {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) {
          preservedEntries[key] = val;
        }
      } catch {}
    });

    try {
      localStorage.clear();
    } catch {}

    Object.entries(preservedEntries).forEach(([key, val]) => {
      try {
        localStorage.setItem(key, val);
      } catch {}
    });

    try {
      if ("caches" in window && typeof caches.keys === "function") {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((name) => caches.delete(name)));
      }
    } catch {}

    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.update()),
        );
      }
    } catch {}

    window.location.reload();
  };

  const handleReportarErro = () => {
    if (typeof onReportarErro === "function") {
      onReportarErro();
    } else {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSeY6iMNQ4fUqIBU2QOgqm5InyaXd1x2z0-J9Fn3gLqSJ01HLw/viewform",
        "_blank",
        "noopener,noreferrer",
      );
    }
    onFechar();
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
                      aria-label="Logo LocaliSADE"
                    >
                      <defs>
                        <linearGradient
                          id="pinGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                        <linearGradient
                          id="anelAzul"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>
                        <linearGradient
                          id="mapaEsmeralda"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <filter
                          id="sombraLogo"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="8"
                            stdDeviation="10"
                            floodColor="#000000"
                            floodOpacity="0.28"
                          />
                        </filter>
                      </defs>
                      <g filter="url(#sombraLogo)">
                        <polygon
                          points="84,265 256,215 256,445 84,395"
                          fill="url(#anelAzul)"
                        />
                        <polygon
                          points="256,215 428,265 428,395 256,445"
                          fill="url(#mapaEsmeralda)"
                        />
                        <line
                          x1="84"
                          y1="330"
                          x2="256"
                          y2="285"
                          stroke="#ffffff"
                          strokeWidth="8"
                          strokeOpacity="0.7"
                        />
                        <line
                          x1="256"
                          y1="285"
                          x2="428"
                          y2="330"
                          stroke="#facc15"
                          strokeWidth="8"
                          strokeOpacity="0.9"
                        />
                        <line
                          x1="170"
                          y1="240"
                          x2="170"
                          y2="420"
                          stroke="#ffffff"
                          strokeWidth="7"
                          strokeOpacity="0.55"
                        />
                        <line
                          x1="342"
                          y1="240"
                          x2="342"
                          y2="420"
                          stroke="#ffffff"
                          strokeWidth="7"
                          strokeOpacity="0.55"
                        />
                      </g>
                      <g filter="url(#sombraLogo)">
                        <path
                          d="M256,44 C182,44 122,104 122,178 C122,265 256,388 256,388 C256,388 390,265 390,178 C390,104 330,44 256,44 Z"
                          fill="url(#pinGrad)"
                        />
                        <circle cx="256" cy="176" r="50" fill="#ffffff" />
                      </g>
                    </svg>
                  </div>
                  <div className="menu-title-wrapper">
                    <h2 className="menu-title">
                      Locali<strong style={{ fontWeight: 900 }}>SADE</strong>
                    </h2>
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

              <div className="menu-section-divider">
                <div className="menu-items-list" style={{ marginTop: 0 }}>
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
                    onClick={handleReportarErro}
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
                      if (onAbrirGuiaUso) onAbrirGuiaUso();
                    }}
                  />
                </div>
              </div>

              <div className="menu-section-divider">
                <div className="menu-items-list" style={{ marginTop: 0 }}>
                  <ItemMenu
                    icone={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    }
                    texto="Termos de Uso"
                    onClick={() => {
                      onFechar();
                      if (onAbrirTermosUso) onAbrirTermosUso();
                    }}
                  />
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
                Versão {VERSAO_ATUAL} • © 2026 Locali<strong>SADE</strong>
                <br />
                {totalQuadras} quadras mapeadas
              </p>
            </div>
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
