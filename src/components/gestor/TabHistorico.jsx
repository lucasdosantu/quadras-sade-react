import React, { useState, useMemo } from "react";

export default function TabHistorico({
  currentMonth,
  onChangeMonth,
  onOpenMenu,
  hideAmounts,
  onToggleHideAmounts,
  filteredAccounts,
  getAccountStatus,
  config,
  togglePaid,
  formatDisplayMoney,
  openEditModal,
  deleteAccount,
}) {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAccounts = useMemo(() => {
    const list = [...filteredAccounts];
    list.sort((a, b) => {
      let comparison = 0;

      if (sortField === "paid") {
        comparison = Number(a.paid) - Number(b.paid);
      } else if (sortField === "date") {
        comparison = (a.date || "").localeCompare(b.date || "");
      } else if (sortField === "description") {
        comparison = (a.description || "").localeCompare(
          b.description || "",
          "pt-BR",
          { sensitivity: "base" },
        );
      } else if (sortField === "amount") {
        comparison = (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
      }

      if (comparison === 0 && sortField !== "date") {
        comparison = (a.date || "").localeCompare(b.date || "");
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
    return list;
  }, [filteredAccounts, sortField, sortDirection]);

  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="sort-indicator">
        {sortDirection === "asc" ? " ▲" : " ▼"}
      </span>
    );
  };

  return (
    <section className="tab-content" style={{ overflow: "hidden" }}>
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

        <h1>Histórico de Contas</h1>

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

        <div className="month-control month-control-hist">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="btn-arrow"
          >
            ◀
          </button>
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => onChangeMonth(e.target.value, true)}
            className="month-input-style"
          />
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            className="btn-arrow"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("paid")}
                className="th-center th-sortable"
                title="Ordenar por Pago"
              >
                Pago{renderSortIndicator("paid")}
              </th>
              <th
                onClick={() => handleSort("date")}
                className="th-sortable"
                title="Ordenar por Data"
              >
                Data{renderSortIndicator("date")}
              </th>
              <th
                onClick={() => handleSort("description")}
                className="th-sortable"
                title="Ordenar por Descrição"
              >
                Descrição{renderSortIndicator("description")}
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="th-sortable"
                title="Ordenar por Valor"
              >
                Valor{renderSortIndicator("amount")}
              </th>
              <th className="th-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="td-empty">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              sortedAccounts.map((acc) => {
                const status = getAccountStatus(acc.date, acc.paid);
                let styleColor = {};
                if (status === "critical")
                  styleColor = { color: config.criticalColor, fontWeight: 800 };
                if (status === "warning")
                  styleColor = { color: config.warningColor, fontWeight: 800 };

                return (
                  <tr key={acc.id} className={acc.paid ? "row-paid" : ""}>
                    <td className="td-center">
                      <input
                        type="checkbox"
                        checked={acc.paid}
                        onChange={() => togglePaid(acc.id)}
                        className="checkbox-style"
                      />
                    </td>
                    <td
                      style={styleColor}
                      className={acc.paid ? "paid-text" : ""}
                    >
                      {acc.date.split("-").reverse().join("/")}
                    </td>
                    <td
                      style={styleColor}
                      className={acc.paid ? "paid-text" : ""}
                    >
                      {acc.description}
                    </td>
                    <td
                      style={styleColor}
                      className={`td-bold ${acc.paid ? "paid-text" : ""}`}
                    >
                      {formatDisplayMoney(acc.amount)}
                    </td>
                    <td className="td-right">
                      <button
                        onClick={() => openEditModal(acc)}
                        title="Editar Conta"
                        className="btn-action-icon"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        title="Excluir Conta"
                        className="btn-action-icon btn-ml"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
