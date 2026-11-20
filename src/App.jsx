import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Mapa, ModalAviso, BannerAnuncios } from "./components/mapa";

const GestorGastos = lazy(() => import("./pages/GestorGastos"));

function PaginaMapa() {
  const [temCardAberto, setTemCardAberto] = useState(false);

  return (
    <div
      className="app-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Mapa
        onMudancaSelecao={(selecionado) =>
          setTemCardAberto(Boolean(selecionado))
        }
      />
      <ModalAviso />
      <BannerAnuncios ocultar={temCardAberto} />
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/" element={<PaginaMapa />} />
          <Route path="/gastos" element={<GestorGastos />} />
        </Routes>
      </Suspense>
    </div>
  );
}
