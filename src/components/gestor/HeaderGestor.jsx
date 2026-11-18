import React from "react";

export default function HeaderGestor({
  title,
  subtitle,
  currentMonth,
  onMonthChange,
  onOpenMenu,
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
