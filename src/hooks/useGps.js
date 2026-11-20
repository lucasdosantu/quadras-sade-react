import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";

const BUSSOLA_OFFSET_GRAUS = -125;
const USAR_360_MENOS_ALPHA = true; // Se ficar girando ao contrário, mude para false

export function useGps(mapInstance) {
  const [coordsUsuario, setCoordsUsuario] = useState(null);
  const [rastreandoAtivo, setRastreandoAtivo] = useState(false);
  const [bussolaGraus, setBussolaGraus] = useState(null);
  const [seguindoGps, setSeguindoGps] = useState(false);

  const marcadorVoceRef = useRef(null);
  const watchIdRef = useRef(null);
  const primeiraVezRef = useRef(true);
  const bussolaRef = useRef(null);
  bussolaRef.current = bussolaGraus;

  const criarIconeGpsSvg = (heading) => {
    const temDirecao = typeof heading === "number" && !Number.isNaN(heading);
    const rotacao = temDirecao ? heading : 0;

    return L.divIcon({
      className: "custom-gps-marker",
      html: `
        <div style="
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            background-color: rgba(59, 130, 246, 0.22);
            border-radius: 50%;
            animation: pulseGps 2s infinite;
          "></div>
          <div style="
            position: absolute;
            inset: 0;
            display: ${temDirecao ? "flex" : "none"};
            align-items: flex-start;
            justify-content: center;
            transform: rotate(${rotacao}deg);
            transition: transform 0.12s linear;
            pointer-events: none;
            z-index: 1;
          ">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              style="margin-top: 1px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));"
            >
              <polygon points="12,2 21,19 12,14 3,19" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
            </svg>
          </div>
          <div style="
            width: 14px;
            height: 14px;
            background-color: #2563eb;
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 2;
          "></div>
        </div>
        <style>
          @keyframes pulseGps {
            0% { transform: scale(0.8); opacity: 1; }
            70% { transform: scale(1.55); opacity: 0; }
            100% { transform: scale(0.8); opacity: 0; }
          }
        </style>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  };

  const pararSeguimentoGps = useCallback(() => {
    setSeguindoGps(false);
  }, []);

  const solicitarPermissaoBussola = useCallback(async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permissao = await DeviceOrientationEvent.requestPermission();
        if (permissao !== "granted") return;
      }
    } catch {
      // Ignora em navegadores que não exigem ou bloqueiam permissão explícita
    }
  }, []);

  const minhaLocalizacao = useCallback(() => {
    setSeguindoGps(true);
    solicitarPermissaoBussola();

    if (coordsUsuario && mapInstance) {
      mapInstance.stop();
      mapInstance.setView(coordsUsuario, 16, { animate: true });
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const novaPosicao = L.latLng(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          setCoordsUsuario(novaPosicao);
          if (mapInstance) {
            mapInstance.stop();
            mapInstance.setView(novaPosicao, 16, { animate: true });
          }
        },
        (err) => console.warn("Erro ao buscar posição manual: " + err.message),
        { enableHighAccuracy: true },
      );
    }
  }, [coordsUsuario, mapInstance, solicitarPermissaoBussola]);

  // Sensor de orientação / bússola do aparelho
  useEffect(() => {
    const handleOrientacao = (event) => {
      let heading = null;

      if (
        typeof event.webkitCompassHeading === "number" &&
        !Number.isNaN(event.webkitCompassHeading)
      ) {
        heading = event.webkitCompassHeading;
      } else if (
        typeof event.alpha === "number" &&
        !Number.isNaN(event.alpha)
      ) {
        heading = USAR_360_MENOS_ALPHA
          ? (360 - event.alpha) % 360
          : event.alpha % 360;
      }

      if (heading !== null) {
        const screenAngle =
          typeof window.screen?.orientation?.angle === "number"
            ? window.screen.orientation.angle
            : typeof window.orientation === "number"
              ? window.orientation
              : 0;
        const ajustado =
          (heading + screenAngle + BUSSOLA_OFFSET_GRAUS + 360) % 360;
        setBussolaGraus(ajustado);
      }
    };

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientacao,
      true,
    );
    window.addEventListener("deviceorientation", handleOrientacao, true);

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientacao,
        true,
      );
      window.removeEventListener("deviceorientation", handleOrientacao, true);
    };
  }, []);

  // Interrompe o seguimento automático caso o usuário arraste ou dê zoom manual no mapa
  useEffect(() => {
    if (!mapInstance) return;

    const pararDeSeguir = () => {
      setSeguindoGps(false);
    };

    mapInstance.on("dragstart", pararDeSeguir);
    mapInstance.on("zoomstart", (e) => {
      if (!e.originalEvent) return; // Ignora zooms programáticos
      pararDeSeguir();
    });

    return () => {
      mapInstance.off("dragstart", pararDeSeguir);
      mapInstance.off("zoomstart");
    };
  }, [mapInstance]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    };

    setRastreandoAtivo(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const novaPosicao = L.latLng(lat, lng);

        setCoordsUsuario(novaPosicao);

        if (seguindoGps && mapInstance) {
          mapInstance.panTo(novaPosicao, { animate: true });
        }
      },
      (err) => {
        console.warn("Erro no GPS: " + err.message);
        setRastreandoAtivo(false);
      },
      geoOptions,
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [mapInstance, seguindoGps]);

  useEffect(() => {
    if (!mapInstance || !coordsUsuario) return;

    if (marcadorVoceRef.current) {
      marcadorVoceRef.current.setLatLng(coordsUsuario);
      marcadorVoceRef.current.setIcon(criarIconeGpsSvg(bussolaRef.current));
    } else {
      marcadorVoceRef.current = L.marker(coordsUsuario, {
        icon: criarIconeGpsSvg(bussolaRef.current),
        interactive: false,
        zIndexOffset: 1000,
      }).addTo(mapInstance);
    }

    if (primeiraVezRef.current) {
      mapInstance.setView(coordsUsuario, 15);
      primeiraVezRef.current = false;
    }
  }, [coordsUsuario, mapInstance]);

  useEffect(() => {
    if (!marcadorVoceRef.current || typeof bussolaGraus !== "number") return;
    marcadorVoceRef.current.setIcon(criarIconeGpsSvg(bussolaGraus));
  }, [bussolaGraus]);

  const calcularDistancia = useCallback(
    (lat2, lon2) => {
      if (!coordsUsuario) return null;
      const R = 6371;
      const dLat = ((lat2 - coordsUsuario.lat) * Math.PI) / 180;
      const dLon = ((lon2 - coordsUsuario.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coordsUsuario.lat * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const d = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      return d > 1 ? d.toFixed(1) + " km" : Math.round(d * 1000) + " m";
    },
    [coordsUsuario],
  );

  return {
    coordsUsuario,
    rastreandoAtivo,
    bussolaGraus,
    minhaLocalizacao,
    pararSeguimentoGps,
    calcularDistancia,
    seguindoGps,
  };
}
