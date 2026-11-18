import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { baseDeDados } from "../../data/baseDeDados";

export default function BarraBusca({
  onSelecionarPonto,
  onAbrirMenu,
  modoNoturno,
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);

  const fuseRef = useRef(null);
  const inputRef = useRef(null);
  const listaRef = useRef(null);

  useEffect(() => {
    const opcoes = {
      keys: ["quadra", "bairro", "cep", { name: "obs", weight: 0.2 }],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 1,
      includeScore: true,
      useExtendedSearch: true,
    };
    fuseRef.current = new Fuse(baseDeDados, opcoes);
  }, []);

  useEffect(() => {
    if (!termoBusca.trim() || !fuseRef.current) {
      setSugestoes([]);
      setMostrarLista(false);
      return;
    }

    const termoOriginal = termoBusca.trim();
    let queryFuse = termoOriginal;

    if (termoOriginal.includes(",")) {
      const partes = termoOriginal.split(",");
      const qd = partes[0].replace(/quadra|qd|q\./gi, "").trim();
      const br = partes[1] ? partes[1].trim() : "";

      if (br !== "") {
        queryFuse = {
          $or: [
            { $and: [{ quadra: qd }, { bairro: br }] },
            {
              $path: ["quadra", "bairro", "obs"],
              $val: termoOriginal.replace(",", " "),
            },
          ],
        };
      } else {
        queryFuse = qd;
      }
    } else {
      queryFuse = termoOriginal.replace(/quadra|qd|q\./gi, "").trim();
    }

    try {
      const resultados = fuseRef.current.search(queryFuse);
      setSugestoes(resultados.slice(0, 8));
      setMostrarLista(true);
    } catch (e) {
      const backup = fuseRef.current.search(termoOriginal);
      setSugestoes(backup.slice(0, 8));
      setMostrarLista(true);
    }
  }, [termoBusca]);

  useEffect(() => {
    const listaEl = listaRef.current;
    if (!listaEl) return;

    const handleTouchMove = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = listaEl;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    };

    listaEl.addEventListener("wheel", handleTouchMove, { passive: false });
    return () => {
      if (listaEl) listaEl.removeEventListener("wheel", handleTouchMove);
    };
  }, [mostrarLista]);

  const lidarComSelecao = (item) => {
    onSelecionarPonto(item);
    setTermoBusca("");
    setSugestoes([]);
    setMostrarLista(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const lidarComSubmit = (e) => {
    e.preventDefault();
    if (sugestoes.length > 0) {
      lidarComSelecao(sugestoes[0].item);
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const temaClass = modoNoturno ? "dark" : "light";

  return (
    <div className="barra-busca-wrapper">
      <form
        onSubmit={lidarComSubmit}
        className={`barra-busca-form ${temaClass}`}
      >
        <button
          type="button"
          onClick={onAbrirMenu}
          className="barra-busca-menu-btn"
          title="Menu"
        >
          <svg className="barra-busca-svg-menu" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Quadra X, Bairro Y ou CEP"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className={`barra-busca-input ${temaClass}`}
        />

        {termoBusca ? (
          <button
            type="button"
            onClick={() => setTermoBusca("")}
            className="barra-busca-clear-btn"
          >
            ✕
          </button>
        ) : (
          <svg className="barra-busca-svg-lupa" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        )}
      </form>

      {mostrarLista && sugestoes.length > 0 && (
        <ul ref={listaRef} className={`barra-busca-lista ${temaClass}`}>
          {sugestoes.map(({ item }, index) => {
            const ref = item.obs ? ` • ${item.obs}` : "";
            return (
              <li
                key={index}
                onClick={() => lidarComSelecao(item)}
                className={`barra-busca-item ${temaClass} ${
                  index === sugestoes.length - 1 ? "ultimo" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
              >
                <strong>QD {item.quadra}</strong>, {item.bairro}{" "}
                <span className={`barra-busca-cep ${temaClass}`}>
                  ({item.cep || "---"})
                </span>
                {ref && <small className="barra-busca-obs">{ref}</small>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
