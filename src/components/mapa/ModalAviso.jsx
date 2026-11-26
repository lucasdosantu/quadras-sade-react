import React, { useState, useEffect } from "react";
import { baseDeDados } from "../../data/baseDeDados";

const VERSAO_SISTEMA = __APP_VERSION__;
const CFG_STORAGE_KEY = "gestao_config_v1";
const THEME_SYNC_EVENT = "sade-theme-sync";
const IMG_BASE_PATH = "/quadras-sade-react/img";

function lerModoNoturnoSalvo() {
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG_STORAGE_KEY) || "{}");
    if (typeof cfg.theme === "string") {
      return cfg.theme === "dark" || cfg.theme === "oled";
    }
  } catch {}
  return false;
}

function PassoInstalacaoImg({ src, alt }) {
  const [ocultar, setOcultar] = useState(false);

  if (ocultar) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setOcultar(true)}
      style={{
        width: "100%",
        maxHeight: "170px",
        objectFit: "contain",
        borderRadius: "10px",
        marginTop: "6px",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        backgroundColor: "rgba(15, 23, 42, 0.04)",
      }}
    />
  );
}

export default function ModalAviso() {
  const [mostrar, setMostrar] = useState(false);
  const [modoNoturno, setModoNoturno] = useState(() => lerModoNoturnoSalvo());

  useEffect(() => {
    const versaoLida = localStorage.getItem("versaoAvisoLido");
    if (versaoLida !== VERSAO_SISTEMA) {
      setMostrar(true);
    }
  }, []);

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

  const fechar = () => {
    setMostrar(false);
    localStorage.setItem("versaoAvisoLido", VERSAO_SISTEMA);
  };

  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${modoNoturno ? "dark" : "light"}`}>
        <div className="modal-header-box">
          <span className="modal-aviso-icone">📢</span>
          <h3 className="modal-title-text">Aviso — LocaliSADE</h3>
        </div>

        <div className="modal-body-text">
          <p className="modal-p">
            Bem-vindo ao <strong>LocaliSADE</strong>! Atualmente são{" "}
            <strong>{baseDeDados.length}</strong> quadras mapeadas. Busque por
            número, quadra ou CEP (apenas números) e use o menu lateral para
            sugerir quadras, reportar erros ou abrir o Gestor de Gastos.
          </p>

          <p className="modal-p" style={{ marginTop: "6px" }}>
            <strong>Como instalar no aparelho:</strong>
          </p>

          <p className="modal-p">
            <strong>1.</strong> Abra o menu do navegador (ícone de opções / três
            linhas ou três pontos).
          </p>
          <PassoInstalacaoImg
            src={`${IMG_BASE_PATH}/instalar-passo-1-menu.png`}
            alt="Passo 1: abrir o menu do navegador"
          />

          <p className="modal-p">
            <strong>2.</strong> Toque em <strong>Instalar aplicativo</strong> ou{" "}
            <strong>Adicionar à tela inicial</strong> (ou{" "}
            <strong>Adicionar à página inicial</strong>).
          </p>
          <PassoInstalacaoImg
            src={`${IMG_BASE_PATH}/instalar-passo-2-instalar.png`}
            alt="Passo 2: tocar em Instalar aplicativo ou Adicionar à tela inicial"
          />

          <p className="modal-p">
            <strong>3.</strong> Confirme para criar o atalho do{" "}
            <strong>LocaliSADE</strong> na tela inicial do aparelho.
          </p>
          <PassoInstalacaoImg
            src={`${IMG_BASE_PATH}/instalar-passo-3-confirmar.png`}
            alt="Passo 3: confirmar instalação do LocaliSADE"
          />
        </div>

        <button onClick={fechar} className="modal-action-btn">
          Entendi
        </button>
      </div>
    </div>
  );
}
