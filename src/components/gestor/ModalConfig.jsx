import React, { useState, useEffect } from "react";

export default function ModalConfig({
  isOpen,
  onClose,
  config,
  setConfig,
  categories,
  onOpenCategories,
  onExportJSON,
  onImportJSON,
  onExportCSV,
  onClearAllAccounts,
  forcedTab = null,
}) {
  const [activeTab, setActiveTab] = useState("alertas");

  useEffect(() => {
    if (forcedTab) {
      setActiveTab(forcedTab);
    }
  }, [forcedTab]);

  if (!isOpen) return null;

  const currentTab = forcedTab || activeTab;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box modal-box-large config-modal-shell"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-flex">
          <div className="modal-title-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <h2>Configurações</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-icon"
            aria-label="Fechar configurações"
          >
            ✕
          </button>
        </div>

        <div
          className="config-tabs"
          role="tablist"
          aria-label="Seções de configuração"
        >
          <button
            type="button"
            role="tab"
            aria-selected={currentTab === "alertas"}
            className={`config-tab-btn ${currentTab === "alertas" ? "is-active" : ""}`}
            onClick={() => setActiveTab("alertas")}
          >
            Alertas &amp; Metas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={currentTab === "exibicao"}
            className={`config-tab-btn ${currentTab === "exibicao" ? "is-active" : ""}`}
            onClick={() => setActiveTab("exibicao")}
          >
            Cadastro &amp; Tela
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={currentTab === "dados"}
            className={`config-tab-btn ${currentTab === "dados" ? "is-active" : ""}`}
            onClick={() => setActiveTab("dados")}
          >
            Dados
          </button>
        </div>

        <div className="modal-body-scroll config-body">
          {currentTab === "alertas" && (
            <>
              <div className="config-group-card">
                <p className="config-section-title">Alertas de Vencimento</p>

                <div className="config-alert-row">
                  <div className="config-field-compact">
                    <label htmlFor="cfg-critical-days">
                      Dias Alerta Crítico
                    </label>
                    <input
                      id="cfg-critical-days"
                      type="number"
                      className="config-input-reset config-num-tabular"
                      value={config.criticalDays}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          criticalDays: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="config-field-color">
                    <label htmlFor="cfg-critical-color">Cor Crítico</label>
                    <input
                      id="cfg-critical-color"
                      type="color"
                      value={config.criticalColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          criticalColor: e.target.value,
                        })
                      }
                      className="input-color config-color-input"
                    />
                  </div>
                </div>

                <div className="config-alert-row">
                  <div className="config-field-compact">
                    <label htmlFor="cfg-warning-days">
                      Dias Alerta Próximo
                    </label>
                    <input
                      id="cfg-warning-days"
                      type="number"
                      className="config-input-reset config-num-tabular"
                      value={config.warningDays}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          warningDays: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="config-field-color">
                    <label htmlFor="cfg-warning-color">Cor Próximo</label>
                    <input
                      id="cfg-warning-color"
                      type="color"
                      value={config.warningColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          warningColor: e.target.value,
                        })
                      }
                      className="input-color config-color-input"
                    />
                  </div>
                </div>
              </div>

              <div className="config-group-card">
                <p className="config-section-title">Parâmetros de Metas</p>

                <div className="config-field-compact">
                  <label htmlFor="cfg-start-week">Dia Inicial da Semana</label>
                  <select
                    id="cfg-start-week"
                    className="config-input-reset"
                    value={config.startOfWeek}
                    onChange={(e) =>
                      setConfig({ ...config, startOfWeek: e.target.value })
                    }
                  >
                    <option value="Segunda-feira">Segunda-feira</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>

                <div className="config-grid-2">
                  <div className="config-field-compact">
                    <label htmlFor="cfg-work-days">Dias/Semana</label>
                    <input
                      id="cfg-work-days"
                      type="number"
                      className="config-input-reset config-num-tabular"
                      value={config.workDays}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          workDays: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="config-field-compact">
                    <label htmlFor="cfg-reserve-pct">Reserva (%)</label>
                    <input
                      id="cfg-reserve-pct"
                      type="number"
                      className="config-input-reset config-num-tabular"
                      value={config.reservePercent}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          reservePercent: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {currentTab === "exibicao" && (
            <>
              <div className="config-group-card">
                <p className="config-section-title">Cadastro e Categorias</p>

                <div className="config-switch-container">
                  <span className="config-switch-label">
                    Redefinir data para &ldquo;hoje&rdquo; ao cadastrar
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(config.resetDateToday)}
                    aria-label="Redefinir data para hoje ao cadastrar"
                    onClick={() =>
                      setConfig({
                        ...config,
                        resetDateToday: !config.resetDateToday,
                      })
                    }
                    className={`switch-track config-switch-btn ${
                      config.resetDateToday ? "ativo" : ""
                    }`}
                  >
                    <span
                      className={`switch-thumb ${
                        config.resetDateToday ? "ativo" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="config-field-compact config-spaced-top">
                  <label htmlFor="cfg-default-cat">
                    Categoria Padrão Automática
                  </label>
                  <select
                    id="cfg-default-cat"
                    className="config-input-reset"
                    value={config.defaultCategory}
                    onChange={(e) =>
                      setConfig({ ...config, defaultCategory: e.target.value })
                    }
                  >
                    <option value="">Nenhuma</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={onOpenCategories}
                  className="btn-secondary config-action-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <span>Editar Categorias</span>
                </button>
              </div>

              <div className="config-group-card">
                <p className="config-section-title">Exibição</p>

                <div className="config-switch-container">
                  <span className="config-switch-label">
                    Ocultar centavos na exibição
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(config.hideCents)}
                    aria-label="Ocultar centavos na exibição"
                    onClick={() =>
                      setConfig({ ...config, hideCents: !config.hideCents })
                    }
                    className={`switch-track config-switch-btn ${
                      config.hideCents ? "ativo" : ""
                    }`}
                  >
                    <span
                      className={`switch-thumb ${
                        config.hideCents ? "ativo" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="config-field-compact config-spaced-top">
                  <label htmlFor="cfg-default-tab">Aba Padrão ao Abrir</label>
                  <select
                    id="cfg-default-tab"
                    className="config-input-reset"
                    value={config.defaultTab}
                    onChange={(e) =>
                      setConfig({ ...config, defaultTab: e.target.value })
                    }
                  >
                    <option value="cadastro">Cadastro</option>
                    <option value="resumo">Resumo</option>
                    <option value="registros">Histórico de Contas</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {currentTab === "dados" && (
            <>
              <div className="config-group-card">
                <p className="config-section-title">Backup e Exportação</p>

                <div className="config-backup-grid">
                  <button
                    type="button"
                    onClick={onExportJSON}
                    className="btn-backup-item btn-backup-blue"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Exportar JSON</span>
                  </button>

                  <label className="btn-backup-item btn-backup-green label-file-custom">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Importar JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportJSON}
                      className="config-file-hidden"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={onExportCSV}
                  className="btn-secondary config-action-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>Exportar para Excel (.CSV)</span>
                </button>
              </div>

              {onClearAllAccounts && (
                <div className="config-danger-zone">
                  <p className="config-danger-title">Zona de Risco</p>
                  <p className="config-danger-desc">
                    Remove permanentemente todas as contas e lançamentos salvos.
                  </p>
                  <button
                    type="button"
                    onClick={onClearAllAccounts}
                    className="config-danger-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    <span>Excluir Todos os Registros</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
