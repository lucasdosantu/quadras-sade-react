import React from "react";

export default function CalculadoraFlutuante({
  calcState,
  setCalcState,
  calcPos,
  onDragStart,
  calcDisplay,
  setCalcDisplay,
}) {
  if (calcState === "closed") {
    return (
      <button
        className="calc-open-btn"
        onClick={() => setCalcState("open")}
        title="Calculadora"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="16" y1="14" x2="16" y2="18"></line>
          <path d="M8 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
        </svg>
      </button>
    );
  }

  if (calcState === "minimized") {
    return (
      <div
        className="calc-minimized-floating"
        style={{ top: calcPos.y, left: calcPos.x }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onClick={() => setCalcState("open")}
        title="Abrir Calculadora"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="16" y1="14" x2="16" y2="18"></line>
          <path d="M8 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="calc-window" style={{ top: calcPos.y, left: calcPos.x }}>
      <div
        className="calc-header"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div className="calc-title-box">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
          </svg>
          <span>Calculadora</span>
        </div>
        <div className="calc-controls">
          <button onClick={() => setCalcState("minimized")} title="Minimizar">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button onClick={() => setCalcState("closed")} title="Fechar">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div className="calc-body">
        <input
          type="text"
          className="calc-display"
          readOnly
          value={calcDisplay}
        />
        <div className="calc-buttons">
          <button onClick={() => setCalcDisplay("0")} className="btn-tool">
            C
          </button>
          <button
            onClick={() => setCalcDisplay(calcDisplay + "/")}
            className="btn-op"
          >
            ÷
          </button>
          <button
            onClick={() => setCalcDisplay(calcDisplay + "*")}
            className="btn-op"
          >
            ×
          </button>
          <button
            onClick={() => setCalcDisplay(calcDisplay.slice(0, -1) || "0")}
            className="btn-tool"
          >
            ⌫
          </button>

          {["7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3"].map(
            (val) => (
              <button
                key={val}
                onClick={() =>
                  setCalcDisplay(calcDisplay === "0" ? val : calcDisplay + val)
                }
              >
                {val}
              </button>
            ),
          )}
          <button
            onClick={() => {
              try {
                setCalcDisplay(
                  String(
                    eval(calcDisplay.replace(/×/g, "*").replace(/÷/g, "/")),
                  ),
                );
              } catch {
                setCalcDisplay("Erro");
              }
            }}
            className="btn-equal"
          >
            =
          </button>
          <button
            onClick={() =>
              setCalcDisplay(calcDisplay === "0" ? "0" : calcDisplay + "0")
            }
            className="btn-zero"
          >
            0
          </button>
          <button
            onClick={() => setCalcDisplay(calcDisplay + ".")}
            className="btn-num"
          >
            ,
          </button>
        </div>
      </div>
    </div>
  );
}
