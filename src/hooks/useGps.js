import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";

export function useGps(mapInstance) {
  const [coordsUsuario, setCoordsUsuario] = useState(null);
  const [rastreandoAtivo, setRastreandoAtivo] = useState(false);
  const [bussolaGraus, setBussolaGraus] = useState(0);
  const [seguindoGps, setSeguindoGps] = useState(false);

  const marcadorVoceRef = useRef(null);
  const watchIdRef = useRef(null);
  const primeiraVezRef = useRef(true);

  const criarIconeGpsSvg = () =>
    L.divIcon({
      className: "custom-gps-marker",
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            background-color: rgba(59, 130, 246, 0.25);
            border-radius: 50%;
            animation: pulseGps 2s infinite;
          "></div>
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
            70% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(0.8); opacity: 0; }
          }
        </style>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  const minhaLocalizacao = useCallback(() => {
    setSeguindoGps(true);

    if (coordsUsuario && mapInstance) {
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
            mapInstance.setView(novaPosicao, 16, { animate: true });
          }
        },
        (err) => console.warn("Erro ao buscar posição manual: " + err.message),
        { enableHighAccuracy: true },
      );
    }
  }, [coordsUsuario, mapInstance]);

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

        // Se o modo de seguimento estiver ativo, centraliza o mapa automaticamente a cada nova leitura de GPS
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
    } else {
      marcadorVoceRef.current = L.marker(coordsUsuario, {
        icon: criarIconeGpsSvg(),
        interactive: false,
        zIndexOffset: 1000,
      }).addTo(mapInstance);
    }

    if (primeiraVezRef.current) {
      mapInstance.setView(coordsUsuario, 15);
      primeiraVezRef.current = false;
    }
  }, [coordsUsuario, mapInstance]);

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
    calcularDistancia,
    seguindoGps,
  };
}
