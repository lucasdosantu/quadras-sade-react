import { useState } from "react";

export function useRota(coordsUsuario) {
  const [pontosDaRota, setPontosDaRota] = useState([]);

  const adicionarARota = (ponto) => {
    const jaExiste = pontosDaRota.some(
      (p) => p.lat === ponto.lat && p.lng === ponto.lng,
    );

    if (!jaExiste) {
      setPontosDaRota((prev) => [...prev, ponto]);
    } else {
      alert("Este ponto exato já foi adicionado à sua rota!");
    }
  };

  const removerDaRota = (index) => {
    setPontosDaRota((prev) => prev.filter((_, i) => i !== index));
  };

  const limparRota = () => {
    setPontosDaRota([]);
  };

  const calcularDistanciaMetros = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const gerarLinkGoogleMaps = () => {
    if (pontosDaRota.length === 0) return;

    let pontoAtual = coordsUsuario
      ? { lat: coordsUsuario.lat, lng: coordsUsuario.lng }
      : {
          lat: parseFloat(pontosDaRota[0].lat),
          lng: parseFloat(pontosDaRota[0].lng),
        };

    let naoVisitados = [
      ...pontosDaRota.map((p) => ({
        ...p,
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lng),
      })),
    ];
    let rotaOtimizada = [];

    while (naoVisitados.length > 0) {
      let maisProximoIndex = 0;
      let menorDistancia = Infinity;

      naoVisitados.forEach((ponto, index) => {
        const distancia = calcularDistanciaMetros(
          pontoAtual.lat,
          pontoAtual.lng,
          ponto.lat,
          ponto.lng,
        );
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          maisProximoIndex = index;
        }
      });

      const proximoPonto = naoVisitados.splice(maisProximoIndex, 1)[0];
      rotaOtimizada.push(proximoPonto);
      pontoAtual = { lat: proximoPonto.lat, lng: proximoPonto.lng };
    }

    const origem = coordsUsuario
      ? `${coordsUsuario.lat},${coordsUsuario.lng}`
      : `${rotaOtimizada[0].lat},${rotaOtimizada[0].lng}`;
    const pontosParaNavegar = coordsUsuario
      ? rotaOtimizada
      : rotaOtimizada.slice(1);

    if (pontosParaNavegar.length === 0) {
      const p = rotaOtimizada[0];
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,
        "_blank",
      );
      return;
    }

    const destinoFinal = `${pontosParaNavegar[pontosParaNavegar.length - 1].lat},${pontosParaNavegar[pontosParaNavegar.length - 1].lng}`;

    const waypoints = pontosParaNavegar
      .slice(0, pontosParaNavegar.length - 1)
      .map((p) => `${p.lat},${p.lng}`)
      .join("|");

    let url = `https://www.google.com/maps/dir/?api=1&destination=${destinoFinal}&travelmode=driving`;
    if (origem) url += `&origin=${origem}`;
    if (waypoints) url += `&waypoints=${waypoints}`;

    window.open(url, "_blank");
  };

  return {
    pontosDaRota,
    adicionarARota,
    removerDaRota,
    limparRota,
    gerarLinkGoogleMaps,
  };
}
