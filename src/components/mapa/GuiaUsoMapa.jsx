import React, { useEffect, useState, useCallback, useRef } from "react";
import "./GuiaUsoMapa.css";

const TOUR_STEPS = [
  {
    id: "busca",
    title: "Buscar quadras e pontos",
    description:
      "Digite nome, bairro, CEP ou observação para localizar uma quadra rápido. Toque no resultado para abrir as informações do ponto no mapa.",
    hint: "Selecione uma quadra nos resultados para ir ao Passo 2 (ou toque em Próximo).",
    selectors: [
      ".barra-busca-input",
      ".barra-busca-wrapper",
      ".barra-busca-form",
    ],
  },
  {
    id: "card-quadra",
    title: "Detalhes da quadra selecionada",
    description:
      "Ao escolher uma quadra no mapa ou na lista, você vê bairro, observações, distância, CEP e pode ir para o local ou adicionar à rota.",
    hint: "Toque em Adicionar à rota ou Ir para o local no card, ou clique em Próximo.",
    selectors: [".card-quadra-container"],
  },
  {
    id: "rotas",
    title: "Menu de rotas sempre econômico",
    description:
      "Adicione quantas quadras precisar no menu de rotas. Não importa a quantidade de paradas: a rota final sempre será calculada para ser a mais econômica possível.",
    hint: "Abra/minimize o painel de rotas ou clique em ABRIR NO GOOGLE MAPS para testar.",
    selectors: [".painel-rota-container"],
  },
  {
    id: "fechar-quadra",
    title: "Mais espaço quando precisar",
    description:
      "As informações da quadra podem ser fechadas no botão X no canto superior do cartão quando você quiser ampliar a área visível do mapa.",
    hint: "Toque no botão X para fechar as informações da quadra ou avance em Próximo.",
    selectors: [".card-quadra-fechar", ".card-quadra-container"],
  },
  {
    id: "tema-escuro",
    title: "Prefere o tema escuro?",
    description:
      "Se você preferir uma visualização com menos brilho ou mais conforto visual, toque no botão de Modo Noturno no menu lateral.",
    hint: "Clique sobre o botão de Modo Noturno para avançar para o próximo passo.",
    selectors: [".menu-item-row", ".menu-content", ".barra-busca-menu-btn"],
  },
  {
    id: "atualizacoes",
    title: "Verificar atualizações",
    description:
      "Ao clicar em Verificar atualizações, o mapa será reiniciado e, se houver atualizações disponíveis, elas serão aplicadas automaticamente.",
    hint: "Use essa opção no menu quando quiser garantir as novidades mais recentes do mapa.",
    selectors: [".menu-item-button", ".menu-content"],
  },
  {
    id: "gestor-gastos",
    title: "Conheça também o Gestor de Gastos",
    description:
      "Depois de dominar o mapa, você pode explorar o Gestor de Gastos pelo menu para acompanhar registros, metas e finanças no seu ritmo.",
    hint: "Este guia foca apenas no mapa. Abra o menu quando quiser explorar o Gestor de Gastos depois.",
    selectors: [".menu-content"],
  },
];

function findTargetElement(selectors = [], stepId = "") {
  if (stepId === "busca") {
    const listaEl = document.querySelector(".barra-busca-lista");
    const wrapperEl = document.querySelector(".barra-busca-wrapper");
    if (listaEl) {
      const listaRect = listaEl.getBoundingClientRect();
      if (listaRect.width > 0 && listaRect.height > 0 && wrapperEl) {
        return wrapperEl;
      }
    }
  }

  if (stepId === "fechar-quadra") {
    const closeBtn = document.querySelector(
      ".card-quadra-fechar, .card-quadra-close, .card-quadra-container button[aria-label*='fechar' i], .card-quadra-container button[title*='fechar' i]",
    );
    if (closeBtn) {
      const rect = closeBtn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return closeBtn;
      }
    }
  }

  if (stepId === "atualizacoes") {
    const buttons = Array.from(document.querySelectorAll(".menu-item-button"));
    const updateBtn = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("atualiza"),
    );
    if (updateBtn) {
      const rect = updateBtn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return updateBtn;
      }
    }
  }

  if (stepId === "gestor-gastos") {
    const links = Array.from(
      document.querySelectorAll(".menu-content a, .menu-content button"),
    );
    const gestorEl = links.find((el) =>
      el.textContent?.toLowerCase().includes("gestor"),
    );
    if (gestorEl) {
      const rect = gestorEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return gestorEl;
      }
    }
  }

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return el;
      }
    }
  }
  return null;
}

export default function GuiaUsoMapa({
  isOpen,
  onClose,
  theme = "light",
  localSelecionado,
  pontosDaRotaCount = 0,
  menuAberto = false,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const prevModoNoturnoRef = useRef(theme === "dark");

  const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const advanceToStep = useCallback((nextIdx) => {
    setStepIndex((prev) => {
      if (nextIdx <= prev) return prev;
      return Math.min(nextIdx, TOUR_STEPS.length - 1);
    });
  }, []);

  const updateSpotlight = useCallback(() => {
    if (!isOpen) return;
    const el = findTargetElement(currentStep.selectors, currentStep.id);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setTargetRect(null);
      return;
    }
    updateSpotlight();
    const timer = setTimeout(updateSpotlight, 120);
    const observer = new MutationObserver(updateSpotlight);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight, true);
    };
  }, [
    isOpen,
    updateSpotlight,
    localSelecionado,
    pontosDaRotaCount,
    menuAberto,
    theme,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    if (currentStep.id === "busca" && localSelecionado) {
      advanceToStep(1);
    }
  }, [isOpen, currentStep.id, localSelecionado, advanceToStep]);

  useEffect(() => {
    if (!isOpen) return;
    if (currentStep.id === "card-quadra" && pontosDaRotaCount > 0) {
      advanceToStep(2);
    }
  }, [isOpen, currentStep.id, pontosDaRotaCount, advanceToStep]);

  useEffect(() => {
    const isDarkNow = theme === "dark";
    if (
      isOpen &&
      currentStep.id === "tema-escuro" &&
      prevModoNoturnoRef.current !== isDarkNow
    ) {
      prevModoNoturnoRef.current = isDarkNow;
      advanceToStep(stepIndex + 1);
      return;
    }
    prevModoNoturnoRef.current = isDarkNow;
  }, [isOpen, currentStep.id, theme, stepIndex, advanceToStep]);

  useEffect(() => {
    if (!isOpen) return;

    if (currentStep.id === "tema-escuro") {
      const darkBtn = document.querySelector(".menu-item-row");
      if (!darkBtn) return;
      const onDarkClick = () => {
        setTimeout(() => {
          advanceToStep(stepIndex + 1);
        }, 120);
      };
      darkBtn.addEventListener("click", onDarkClick, true);
      return () => darkBtn.removeEventListener("click", onDarkClick, true);
    }

    if (currentStep.id === "fechar-quadra" || currentStep.id === "rotas") {
      const el = findTargetElement(currentStep.selectors, currentStep.id);
      if (!el) return;
      const onActionClick = () => {
        setTimeout(() => {
          advanceToStep(stepIndex + 1);
        }, 250);
      };
      el.addEventListener("click", onActionClick, true);
      return () => el.removeEventListener("click", onActionClick, true);
    }
  }, [isOpen, currentStep, stepIndex, advanceToStep]);

  const isFecharQuadraStep = currentStep.id === "fechar-quadra";
  const isAtualizacoesStep = currentStep.id === "atualizacoes";
  const isGestorGastosStep = currentStep.id === "gestor-gastos";
  const isMenuStep =
    currentStep.id === "tema-escuro" || currentStep.id === "gestor-gastos";

  const pad = 6;

  const fallbackFecharQuadraRect =
    isFecharQuadraStep && !targetRect
      ? {
          top: window.innerHeight - 240,
          left: window.innerWidth - 52,
          width: 36,
          height: 36,
        }
      : null;

  const activeRect = targetRect || fallbackFecharQuadraRect;

  const spotlightStyle = activeRect
    ? {
        top: Math.max(6, activeRect.top - pad),
        left: Math.max(6, activeRect.left - pad),
        width: activeRect.width + pad * 2,
        height: activeRect.height + pad * 2,
      }
    : null;

  useEffect(() => {
    if (!isOpen) return;
    if (!isAtualizacoesStep && !isGestorGastosStep) return;
    if (!spotlightStyle) return;

    const isInsideSpotlight = (clientX, clientY) => {
      return (
        clientX >= spotlightStyle.left &&
        clientX <= spotlightStyle.left + spotlightStyle.width &&
        clientY >= spotlightStyle.top &&
        clientY <= spotlightStyle.top + spotlightStyle.height
      );
    };

    const blockEvent = (e) => {
      const point = e.touches?.[0] || e.changedTouches?.[0] || e;
      if (
        point &&
        typeof point.clientX === "number" &&
        typeof point.clientY === "number"
      ) {
        if (isInsideSpotlight(point.clientX, point.clientY)) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === "function") {
            e.stopImmediatePropagation();
          }
        }
      }
    };

    const handleBlockedClick = (e) => {
      if (typeof e.clientX === "number" && typeof e.clientY === "number") {
        if (isInsideSpotlight(e.clientX, e.clientY)) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === "function") {
            e.stopImmediatePropagation();
          }

          if (isAtualizacoesStep) {
            advanceToStep(stepIndex + 1);
          } else if (isGestorGastosStep) {
            onClose();
          }
        }
      }
    };

    window.addEventListener("pointerdown", blockEvent, true);
    window.addEventListener("mousedown", blockEvent, true);
    window.addEventListener("touchstart", blockEvent, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchend", blockEvent, {
      capture: true,
      passive: false,
    });
    window.addEventListener("click", handleBlockedClick, true);

    return () => {
      window.removeEventListener("pointerdown", blockEvent, true);
      window.removeEventListener("mousedown", blockEvent, true);
      window.removeEventListener("touchstart", blockEvent, true);
      window.removeEventListener("touchend", blockEvent, true);
      window.removeEventListener("click", handleBlockedClick, true);
    };
  }, [
    isOpen,
    isAtualizacoesStep,
    isGestorGastosStep,
    spotlightStyle,
    stepIndex,
    advanceToStep,
    onClose,
  ]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, TOUR_STEPS.length - 1));
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const targetIsInTopHalf = activeRect
    ? activeRect.top + activeRect.height / 2 < window.innerHeight * 0.5
    : false;

  const placeCardAtTop = isAtualizacoesStep
    ? true
    : isMenuStep
      ? false
      : isFecharQuadraStep || (activeRect ? !targetIsInTopHalf : false);

  return (
    <div
      className={`guia-mapa-layer ${theme === "dark" ? "dark" : "light"}`}
      role="dialog"
      aria-modal="false"
      aria-label="Guia de uso do mapa"
    >
      {spotlightStyle ? (
        <>
          <div
            className="guia-mapa-mask"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: spotlightStyle.top,
            }}
          />
          <div
            className="guia-mapa-mask"
            style={{
              top: spotlightStyle.top + spotlightStyle.height,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <div
            className="guia-mapa-mask"
            style={{
              top: spotlightStyle.top,
              left: 0,
              width: spotlightStyle.left,
              height: spotlightStyle.height,
            }}
          />
          <div
            className="guia-mapa-mask"
            style={{
              top: spotlightStyle.top,
              left: spotlightStyle.left + spotlightStyle.width,
              right: 0,
              height: spotlightStyle.height,
            }}
          />
          <div
            className="guia-mapa-spotlight"
            style={spotlightStyle}
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="guia-mapa-mask" style={{ inset: 0 }} />
      )}

      <div
        className={`guia-mapa-card ${placeCardAtTop ? "pos-top" : "pos-bottom"}`}
      >
        <div className="guia-mapa-top-bar">
          <span className="guia-mapa-progress">
            Passo {stepIndex + 1} de {TOUR_STEPS.length}
          </span>
          <button
            type="button"
            className="guia-mapa-cancel-btn"
            onClick={onClose}
          >
            Encerrar guia
          </button>
        </div>

        <h2 className="guia-mapa-title">{currentStep.title}</h2>
        <p className="guia-mapa-desc">{currentStep.description}</p>
        <p className="guia-mapa-hint">{currentStep.hint}</p>

        <div className="guia-mapa-dots" aria-hidden="true">
          {TOUR_STEPS.map((step, idx) => (
            <span
              key={step.id}
              className={`guia-mapa-dot ${idx === stepIndex ? "is-active" : ""} ${
                idx < stepIndex ? "is-done" : ""
              }`}
            />
          ))}
        </div>

        <div className="guia-mapa-actions">
          <button
            type="button"
            className="guia-mapa-btn guia-mapa-btn-secondary"
            onClick={handlePrev}
            disabled={isFirst}
          >
            Voltar
          </button>

          <button
            type="button"
            className="guia-mapa-btn guia-mapa-btn-primary"
            onClick={handleNext}
          >
            {isLast ? "Finalizar tutorial" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
