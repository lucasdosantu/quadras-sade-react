import React, { useState, useEffect } from "react";

const VERSAO_SISTEMA = "0.0.1";

export default function ModalAviso() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const versaoLida = localStorage.getItem("versaoAvisoLido");
    if (versaoLida !== VERSAO_SISTEMA) {
      setMostrar(true);
    }
  }, []);

  const fechar = () => {
    setMostrar(false);
    localStorage.setItem("versaoAvisoLido", VERSAO_SISTEMA);
  };

  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content light">
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
            Atualmente os bairros{" "}
            <b>
              Vila Esperança, Vila Paraíso 1, 2 & 3, Gomes Rabelo,{" "}
              <i>Vila São Luiz 1 & 2 e Montes Claros 2</i>
            </b>{" "}
            estão completamente mapeados.
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
