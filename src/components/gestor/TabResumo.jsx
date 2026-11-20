import React from "react";
import HeaderGestor from "./HeaderGestor";

export default function TabResumo({
  currentMonth,
  onChangeMonth,
  onOpenMenu,
  hideAmounts,
  onToggleHideAmounts,
  unpaidSum,
  paidSum,
  formatDisplayMoney,
  onOpenMetas,
}) {
  return (
    <section className="tab-content">
      <HeaderGestor
        title="Resumo Mensal"
        currentMonth={currentMonth}
        onMonthChange={onChangeMonth}
        onOpenMenu={onOpenMenu}
        hideAmounts={hideAmounts}
        onToggleHideAmounts={onToggleHideAmounts}
      />

      <div className="summary-grid-2">
        <div className="card card-border-danger summary-card-inner">
          <label>Pendente no Mês</label>
          <p className="summary-value-large text-danger">
            {formatDisplayMoney(unpaidSum)}
          </p>
        </div>

        <div className="card card-border-success summary-card-inner">
          <label>Pago no Mês</label>
          <p className="summary-value-large text-success">
            {formatDisplayMoney(paidSum)}
          </p>
        </div>
      </div>

      <div className="card">
        <label>Balanço Total</label>
        <p className="summary-value-normal">
          {formatDisplayMoney(unpaidSum + paidSum)}
        </p>
      </div>

      <button
        onClick={onOpenMetas}
        className="btn-primary btn-with-svg"
        style={{ marginTop: 8 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <span>Ver Metas de Ganho Semanal</span>
      </button>
    </section>
  );
}
