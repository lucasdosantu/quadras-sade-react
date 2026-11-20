import React from "react";

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const formatDateWithWeekday = (isoDateStr) => {
  if (!isoDateStr) return "";
  const [y, m, d] = isoDateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const weekday = WEEKDAY_NAMES[dateObj.getDay()];
  return `${weekday}, ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};

export default function ModalMetas({
  isOpen,
  onClose,
  currentMonth,
  accounts,
  getWeeksInMonth,
  config,
  formatDisplayMoney,
  unpaidSum,
  paidSum,
}) {
  if (!isOpen) return null;

  const weeks = getWeeksInMonth(currentMonth);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box modal-box-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-flex">
          <h2>Metas de Ganho Semanal</h2>
          <button onClick={onClose} className="modal-close-icon">
            ✕
          </button>
        </div>

        <div className="modal-body-scroll">
          {weeks.map((week) => {
            const weekAccounts = accounts.filter(
              (acc) =>
                acc.date && acc.date >= week.start && acc.date <= week.end,
            );
            const weekSum = weekAccounts.reduce(
              (acc, curr) => acc + (parseFloat(curr.amount) || 0),
              0,
            );
            const metaDiaria =
              config.workDays > 0 ? weekSum / config.workDays : 0;
            const reservaValor = (weekSum * config.reservePercent) / 100;
            const reservaDiaria =
              config.workDays > 0 ? reservaValor / config.workDays : 0;

            return (
              <div key={week.num} className="meta-week-card">
                <div className="meta-week-header">
                  <span>SEMANA {week.num}</span>
                  <span className="meta-week-dates">
                    {formatDateWithWeekday(week.start)} a{" "}
                    {formatDateWithWeekday(week.end)}
                  </span>
                </div>
                <p className="meta-week-total">
                  Contas no período:{" "}
                  <strong>{formatDisplayMoney(weekSum)}</strong>
                </p>

                <div className="meta-week-grid">
                  <div className="meta-subbox">
                    <span className="meta-label-sm">
                      META DIÁRIA ({config.workDays}D)
                    </span>
                    <span className="meta-val-green">
                      {formatDisplayMoney(metaDiaria)}
                    </span>
                  </div>
                  <div className="meta-subbox">
                    <span className="meta-label-sm">
                      +{config.reservePercent}% RESERVA
                    </span>
                    <span className="meta-val-green">
                      {formatDisplayMoney(reservaDiaria)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="meta-total-box">
            <div>
              <span className="meta-label-sm">TOTAL MÊS</span>
              <span className="meta-total-val">
                {formatDisplayMoney(unpaidSum + paidSum)}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="meta-label-sm">MÉDIA DIÁRIA C/ RESERVA</span>
              <span className="meta-total-val text-success">
                {formatDisplayMoney(
                  config.workDays > 0 && weeks.length > 0
                    ? ((unpaidSum + paidSum) *
                        (1 + config.reservePercent / 100)) /
                        config.workDays /
                        weeks.length
                    : 0,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
