import React, { useState, useEffect } from "react";
import { listaAnuncios } from "../../data/anunciosData";

let jaProcessouNestaSessao = false;

export default function BannerAnuncios({ ocultar }) {
  const [anuncioAtual, setAnuncioAtual] = useState(null);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (
      !listaAnuncios ||
      !Array.isArray(listaAnuncios) ||
      listaAnuncios.length === 0
    )
      return;

    const CHAVE_ID = "sade_ultimo_anuncio_id_num";
    let proximoIndice = 0;

    if (jaProcessouNestaSessao) {
      const ultimoIdSalvo = localStorage.getItem(CHAVE_ID);
      const indiceEncontrado = listaAnuncios.findIndex(
        (item) => item.id === parseInt(ultimoIdSalvo, 10),
      );
      proximoIndice = indiceEncontrado !== -1 ? indiceEncontrado : 0;
    } else {
      jaProcessouNestaSessao = true;
      const ultimoIdSalvo = localStorage.getItem(CHAVE_ID);

      if (ultimoIdSalvo !== null) {
        const idNumerico = parseInt(ultimoIdSalvo, 10);
        const indiceAnterior = listaAnuncios.findIndex(
          (item) => item.id === idNumerico,
        );

        if (indiceAnterior !== -1) {
          proximoIndice = (indiceAnterior + 1) % listaAnuncios.length;
        } else {
          proximoIndice = 0;
        }
      }
    }

    const anuncioEscolhido = listaAnuncios[proximoIndice];
    localStorage.setItem(CHAVE_ID, anuncioEscolhido.id);
    setAnuncioAtual(anuncioEscolhido);
  }, []);

  const fecharAnuncio = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisivel(false);
  };

  if (!anuncioAtual || !visivel || ocultar) return null;

  return (
    <div className="banner-anuncio-container">
      <a
        href={anuncioAtual.link}
        target="_blank"
        rel="noopener noreferrer"
        className="banner-anuncio-link"
      >
        <img
          src={anuncioAtual.imagem}
          alt="Anúncio Patrocinado"
          className="banner-anuncio-img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </a>

      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={fecharAnuncio}
        className="banner-anuncio-fechar"
        title="Fechar anúncio"
      >
        ✕
      </button>
    </div>
  );
}
