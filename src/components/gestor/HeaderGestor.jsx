import React from "react";

export default function HeaderGestor({
  title,
  subtitle,
  currentMonth,
  onMonthChange,
  onOpenMenu,
  hideAmounts,
  onToggleHideAmounts,
}) {
  return (
    <div className="card-header">
      <button
        type="button"
        onClick={onOpenMenu}
        className="menu-hamburguer-btn"
        title="Menu"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}

      {onToggleHideAmounts && (
        <button
          type="button"
          onClick={onToggleHideAmounts}
          className="btn-olho-privacidade"
          title={hideAmounts ? "Mostrar valores" : "Esconder valores"}
          aria-label={hideAmounts ? "Mostrar valores" : "Esconder valores"}
        >
          {hideAmounts ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      )}

      {onMonthChange && (
        <div className="flex-between month-sync-box">
          <span className="label-sm">Mês Ativo</span>
          <div className="month-control">
            <button
              type="button"
              onClick={() => onMonthChange(-1)}
              className="btn-arrow"
            >
              ◀
            </button>
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => onMonthChange(e.target.value, true)}
              className="month-input-style"
            />
            <button
              type="button"
              onClick={() => onMonthChange(1)}
              className="btn-arrow"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
