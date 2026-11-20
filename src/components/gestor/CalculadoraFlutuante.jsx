import React, { useRef } from "react";

function avaliarExpressaoMatematica(expressao) {
  const limpa = expressao
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/,/g, ".")
    .replace(/\s+/g, "");

  if (!limpa) return "0";
  if (!/^[0-9+\-*/().]+$/.test(limpa)) {
    throw new Error("Expressão inválida");
  }

  const tokens = limpa.match(/(\d+(?:\.\d+)?|[+\-*/()])/g);
  if (!tokens) {
    throw new Error("Expressão inválida");
  }

  let index = 0;

  function parseExpressao() {
    let valor = parseTermo();
    while (
      index < tokens.length &&
      (tokens[index] === "+" || tokens[index] === "-")
    ) {
      const op = tokens[index++];
      const proximo = parseTermo();
      valor = op === "+" ? valor + proximo : valor - proximo;
    }
    return valor;
  }

  function parseTermo() {
    let valor = parseFator();
    while (
      index < tokens.length &&
      (tokens[index] === "*" || tokens[index] === "/")
    ) {
      const op = tokens[index++];
      const proximo = parseFator();
      if (op === "/" && proximo === 0) {
        throw new Error("Divisão por zero");
      }
      valor = op === "*" ? valor * proximo : valor / proximo;
    }
    return valor;
  }

  function parseFator() {
    const token = tokens[index];

    if (token === "+" || token === "-") {
      index++;
      return token === "-" ? -parseFator() : parseFator();
    }

    if (token === "(") {
      index++;
      const valor = parseExpressao();
      if (tokens[index] !== ")") {
        throw new Error("Parêntese não fechado");
      }
      index++;
      return valor;
    }

    if (token && /^\d+(?:\.\d+)?$/.test(token)) {
      index++;
      return parseFloat(token);
    }

    throw new Error("Token inválido");
  }

  const resultado = parseExpressao();
  if (index !== tokens.length || !Number.isFinite(resultado)) {
    throw new Error("Resultado inválido");
  }

  return String(Number(resultado.toFixed(10)));
}

export default function CalculadoraFlutuante({
  calcState,
  setCalcState,
  calcPos,
  onDragStart,
  calcDisplay,
  setCalcDisplay,
}) {
  const startCoordRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

  const handlePointerDown = (e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    startCoordRef.current = { x: clientX, y: clientY };
    movedRef.current = false;
    onDragStart(e);
  };

  const handlePointerMove = (e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;
    if (
      Math.hypot(
        clientX - startCoordRef.current.x,
        clientY - startCoordRef.current.y,
      ) > 5
    ) {
      movedRef.current = true;
    }
  };

  const handleBubbleClick = () => {
    if (!movedRef.current) {
      setCalcState("open");
    }
    movedRef.current = false;
  };

  const calcularResultado = () => {
    try {
      setCalcDisplay(avaliarExpressaoMatematica(calcDisplay));
    } catch {
      setCalcDisplay("Erro");
    }
  };

  const bubbleStyle = calcPos
    ? { top: calcPos.y, left: calcPos.x, right: "auto", bottom: "auto" }
    : { right: 20, bottom: 20 };

  if (calcState === "closed") {
    return (
      <button
        type="button"
        className="calc-minimized-floating"
        style={bubbleStyle}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onClick={handleBubbleClick}
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
        style={bubbleStyle}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onClick={handleBubbleClick}
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

  const windowStyle = calcPos
    ? { top: calcPos.y, left: calcPos.x }
    : { bottom: 80, right: 20 };

  return (
    <div className="calc-window" style={windowStyle}>
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
          <button onClick={calcularResultado} className="btn-equal">
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
