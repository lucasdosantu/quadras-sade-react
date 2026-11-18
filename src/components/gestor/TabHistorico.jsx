import React from "react";
import HeaderGestor from "./HeaderGestor";

export default function TabHistorico({
  currentMonth,
  onChangeMonth,
  onOpenMenu,
  filteredAccounts,
  getAccountStatus,
  config,
  togglePaid,
  formatDisplayMoney,
  openEditModal,
  deleteAccount,
}) {
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
              <th className="th-center">Pago</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th className="th-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="td-empty">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => {
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
