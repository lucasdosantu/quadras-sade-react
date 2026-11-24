import React, { useState, useEffect } from "react";
import { baseDeDados } from "../../data/baseDeDados";

const VERSAO_SISTEMA = __APP_VERSION__;
const CFG_STORAGE_KEY = "gestao_config_v1";
const THEME_SYNC_EVENT = "sade-theme-sync";

function lerModoNoturnoSalvo() {
  try {
    const cfg = JSON.parse(localStorage.getItem(CFG_STORAGE_KEY) || "{}");
    if (typeof cfg.theme === "string") {
      return cfg.theme === "dark" || cfg.theme === "oled";
    }
  } catch {}
  return false;
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
          <h3 className="modal-title-text">Aviso Importante</h3>
        </div>

        <div className="modal-body-text">
          <p className="modal-p">Seja bem-vindo ao Localizador de Quadras!</p>
          <p className="modal-p">
            <strong>MODO ESCURO HABILITADO!</strong> Experimente no menu
            lateral.
          </p>
          <p className="modal-p">
            Você pode pesquisar quadras apenas digitando o número ou buscar
            diretamente pelo CEP (apenas números).
          </p>
          <p className="modal-p">
            <b>Ex:</b> <i>6, Vila Paraíso</i>
          </p>
          <p className="modal-p">
            Atualmente quase todos os bairros estão completamente mapeados com
            um total de {baseDeDados.length} pontos mapeados.
          </p>
          <p className="modal-p">
            Outras quadras estão sendo adicionadas aos poucos conforme tenho
            tempo de mapear. Por gentileza, caso veja alguma informação
            erroneamente colocada no mapa, não hesite em me informar pelo menu
            lateral.
          </p>
          <p className="modal-p">
            Se você conhece alguma quadra que ainda não está cadastrada, clique
            no <b>+</b> e clique sobre a quadra para me enviar a sugestão.
          </p>
        </div>

        <button onClick={fechar} className="modal-action-btn">
          Entendi
        </button>
      </div>
    </div>
  );
}
