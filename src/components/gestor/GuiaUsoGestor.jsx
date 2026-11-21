import React, { useEffect, useState, useCallback, useRef } from "react";
import "../mapa/GuiaUsoMapa.css";

const TOUR_STEPS = [
  {
    id: "menu-gestor",
    title: "Menu do Gestor Financeiro",
    description:
      "Pelo menu lateral você alterna o tema, acessa as configurações e navega rapidamente entre Novo Gasto, Resumo, Histórico e o Mapa.",
    hint: "Toque em Próximo para abrir e explorar as Configurações.",
    selectors: [".menu-content", ".menu-lateral"],
  },
  {
    id: "config-geral",
    title: "Alertas & Metas",
    description:
      "Aqui você ajusta alertas de vencimento (dias e cores) e os parâmetros de metas semanais, como início da semana, dias trabalhados e reserva.",
    hint: "Veja as opções de alertas e metas e avance para a próxima aba.",
    selectors: [
      ".modal-config-tab:nth-of-type(1)",
      ".config-tabs button:first-child",
      ".modal-box",
    ],
  },
  {
    id: "config-categorias",
    title: "Cadastro & Tela",
    description:
      "Aqui você define comportamento de data no cadastro, categoria padrão, edição de categorias, exibição de centavos e aba inicial.",
    hint: "Confira as opções de cadastro, categorias e tela e siga para a próxima aba.",
    selectors: [
      ".modal-config-tab:nth-of-type(2)",
      ".config-tabs button:nth-child(2)",
      ".modal-box",
    ],
  },
  {
    id: "config-dados",
    title: "Dados",
    description:
      "Aqui você exporta e importa backups em JSON ou CSV e também pode limpar todos os registros quando precisar.",
    hint: "Use esta aba para salvar seus dados com segurança ou importar históricos.",
    selectors: [
      ".modal-config-tab:nth-of-type(3)",
      ".config-tabs button:nth-child(3)",
      ".modal-box",
    ],
  },
  {
    id: "novo-gasto",
    title: "Cadastrar novos registros",
    description:
      "Aqui é onde você lança novos gastos escolhendo a data, descrição, categoria e valor para o mês selecionado.",
    hint: "Preencha os campos sempre que quiser adicionar uma nova conta ao controle.",
    selectors: [".tab-content form", ".tab-content"],
  },
  {
    id: "resumo-mes",
    title: "Resumo do mês",
    description:
      "No Resumo Mensal você acompanha o total pendente, o que já foi pago no mês e o balanço geral do período ativo.",
    hint: "Ótimo para bater o olho na situação do mês antes de ver as metas semanais.",
    selectors: [".summary-grid-2", ".tab-content"],
  },
  {
    id: "meta-semanal",
    title: "Meta semanal para pagar as contas",
    description:
      "Aqui você vê as semanas do mês, quanto soma de contas em cada período, a meta diária estimada e a porcentagem de reserva.",
    hint: "Ajuda a planejar quanto precisa faturar por dia para cobrir as contas da semana.",
    selectors: [".meta-week-card", ".modal-box"],
  },
  {
    id: "historico-contas",
    title: "Histórico e lançamento das contas",
    description:
      "Voltando pelo menu para o Histórico de Contas, todas as suas contas aparecem listadas com status de pago, etiqueta de categoria, valor e botões de editar/excluir.",
    hint: "Toque no cabeçalho das colunas para ordenar e marque o checkbox conforme for pagando.",
    selectors: [".table-container", "table"],
  },
  {
    id: "calculadora",
    title: "Calculadora para contas rápidas",
    description:
      "A calculadora ajuda a somar valores ou conferir cálculos na hora sem sair da tela de controle das suas contas.",
    hint: "Você pode abrir, arrastar ou fechar a calculadora sempre que precisar.",
    selectors: [".calc-window", ".calc-minimized-floating"],
  },
  {
    id: "voltar-mapa",
    title: "Voltar para o Mapa",
    description:
      "Quando terminar de gerenciar seus gastos, abra o menu lateral e toque em Voltar para o Mapa para retornar ao localizador de quadras.",
    hint: "Clique em Finalizar guia para concluir o tour do Gestor de Gastos.",
    selectors: [".menu-content", ".menu-lateral"],
  },
];

function findElementByText(rootSelector, keywords = []) {
  const candidates = Array.from(
    document.querySelectorAll(
      rootSelector
        ? `${rootSelector} button, ${rootSelector} a, ${rootSelector} [role="tab"]`
        : 'button, a, [role="tab"]',
    ),
  );

  const match = candidates.find((el) => {
    const text = (el.textContent || "").toLowerCase().trim();
    if (!text) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    return keywords.some((kw) => text.includes(kw));
  });

  return match || null;
}

function findTargetElement(selectors = [], stepId = "") {
  if (stepId === "config-geral") {
    return (
      findElementByText('.modal-box [role="tablist"]', ["alertas", "metas"]) ||
      document.querySelector(".modal-box")
    );
  }

  if (stepId === "config-categorias") {
    return (
      findElementByText('.modal-box [role="tablist"]', [
        "cadastro",
        "tela",
        "categoria",
      ]) || document.querySelector(".modal-box")
    );
  }

  if (stepId === "config-dados") {
    return (
      findElementByText('.modal-box [role="tablist"]', ["dados"]) ||
      document.querySelector(".modal-box")
    );
  }

  if (stepId === "meta-semanal") {
    return (
      document.querySelector(".meta-week-card, .modal-box") ||
      findElementByText("section, main", ["meta", "semanal"])
    );
  }

  if (stepId === "calculadora") {
    return document.querySelector(".calc-window, .calc-minimized-floating");
  }

  if (stepId === "voltar-mapa") {
    return (
      findElementByText(".menu-content", ["mapa"]) ||
      document.querySelector(".menu-content")
    );
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

const stepsBottom = new Set([
  "menu-gestor",
  "config-geral",
  "config-categorias",
  "config-dados",
  "meta-semanal",
  "historico-contas",
  "calculadora",
]);

export default function GuiaUsoGestor({
  isOpen,
  onClose,
  theme = "dark",
  activeTab = "cadastro",
  menuAberto = false,
  modalConfigOpen = false,
  modalMetasOpen = false,
  calcState = "closed",
  onStepChange,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const lastNotifiedStepRef = useRef(null);

  const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOUR_STEPS.length - 1;

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
      lastNotifiedStepRef.current = null;
      return;
    }

    if (
      typeof onStepChange === "function" &&
      lastNotifiedStepRef.current !== currentStep.id
    ) {
      lastNotifiedStepRef.current = currentStep.id;
      onStepChange(currentStep.id, stepIndex);
    }

    updateSpotlight();
    const timer = setTimeout(updateSpotlight, 140);
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
    currentStep,
    stepIndex,
    updateSpotlight,
    onStepChange,
    activeTab,
    menuAberto,
    modalConfigOpen,
    modalMetasOpen,
    calcState,
  ]);

  const pad = 6;

  const spotlightStyle = targetRect
    ? {
        top: Math.max(6, targetRect.top - pad),
        left: Math.max(6, targetRect.left - pad),
        width: targetRect.width + pad * 2,
        height: targetRect.height + pad * 2,
      }
    : null;

  useEffect(() => {
    if (!isOpen || !spotlightStyle) return;

    const isInsideSpotlight = (clientX, clientY) =>
      clientX >= spotlightStyle.left &&
      clientX <= spotlightStyle.left + spotlightStyle.width &&
      clientY >= spotlightStyle.top &&
      clientY <= spotlightStyle.top + spotlightStyle.height;

    const blockSpotlightEvent = (e) => {
      if (e.target?.closest?.(".guia-mapa-card")) {
        return;
      }

      const point = e.touches?.[0] || e.changedTouches?.[0] || e;
      if (
        point &&
        typeof point.clientX === "number" &&
        typeof point.clientY === "number" &&
        isInsideSpotlight(point.clientX, point.clientY)
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("pointerdown", blockSpotlightEvent, true);
    window.addEventListener("mousedown", blockSpotlightEvent, true);
    window.addEventListener("touchstart", blockSpotlightEvent, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchend", blockSpotlightEvent, {
      capture: true,
      passive: false,
    });
    window.addEventListener("click", blockSpotlightEvent, true);

    return () => {
      window.removeEventListener("pointerdown", blockSpotlightEvent, true);
      window.removeEventListener("mousedown", blockSpotlightEvent, true);
      window.removeEventListener("touchstart", blockSpotlightEvent, true);
      window.removeEventListener("touchend", blockSpotlightEvent, true);
      window.removeEventListener("click", blockSpotlightEvent, true);
    };
  }, [isOpen, spotlightStyle]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      onClose?.();
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, TOUR_STEPS.length - 1));
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const targetIsInTopHalf = targetRect
    ? targetRect.top + targetRect.height / 2 < window.innerHeight * 0.5
    : false;

  const placeCardAtTop =
    currentStep.id === "voltar-mapa"
      ? true
      : stepsBottom.has(currentStep.id)
        ? false
        : targetRect
          ? !targetIsInTopHalf
          : false;

  const isDarkTheme = theme === "dark" || theme === "oled";

  return (
    <div
      className={`guia-mapa-layer ${isDarkTheme ? "dark" : "light"}`}
      role="dialog"
      aria-modal="false"
      aria-label="Guia de uso do Gestor de Gastos"
      style={{ zIndex: 10050 }}
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
        style={{
          width: "calc(100vw - 32px)",
          maxWidth: "420px",
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
          zIndex: 10052,
        }}
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
            {isLast ? "Finalizar guia" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
