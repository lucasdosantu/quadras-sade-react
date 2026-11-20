import L from "leaflet";

export function criarIconeQuadraSvg(isDark, variante = "cadastrada") {
  const isSugestao = variante === "sugestao";
  const fillPin = isSugestao
    ? isDark
      ? "#38bdf8"
      : "#0284c7"
    : isDark
      ? "#10b981"
      : "#00875a";
  const strokePin = isDark ? "#09090b" : "#ffffff";
  const mioloFill = isDark ? "#09090b" : "#ffffff";

  return L.divIcon({
    className:
      variante === "sugestao" ? "sade-pin-sugestao" : "sade-pin-quadra",
    html: `
      <div style="
        transform: translate(-50%, -100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, ${isDark ? "0.65" : "0.28"}));
        cursor: ${isSugestao ? "grab" : "default"};
      ">
        <svg
          width="34"
          height="42"
          viewBox="0 0 34 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M17 2C9.268 2 3 8.268 3 16C3 26.5 17 40 17 40C17 40 31 26.5 31 16C31 8.268 24.732 2 17 2Z"
            fill="${fillPin}"
            stroke="${strokePin}"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <circle
            cx="17"
            cy="15.5"
            r="5.5"
            fill="${mioloFill}"
          />
          <circle
            cx="17"
            cy="15.5"
            r="2.2"
            fill="${fillPin}"
          />
        </svg>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// Raio aproximado em graus (~45m) para identificar se o ponto já cai em quadra cadastrada
const RAIO_QUADRA_GRAUS_SQ = 0.0004 * 0.0004;

export function encontrarQuadraProxima(
  baseDeDados,
  lat,
  lng,
  raioSq = RAIO_QUADRA_GRAUS_SQ,
) {
  let maisProxima = null;
  let menorDistSq = raioSq;

  for (const item of baseDeDados) {
    const pLat = parseFloat(item.lat);
    const pLng = parseFloat(item.lng);
    if (Number.isNaN(pLat) || Number.isNaN(pLng)) continue;

    const dSq = Math.pow(pLat - lat, 2) + Math.pow(pLng - lng, 2);
    if (dSq < menorDistSq) {
      menorDistSq = dSq;
      maisProxima = item;
    }
  }

  return maisProxima;
}
