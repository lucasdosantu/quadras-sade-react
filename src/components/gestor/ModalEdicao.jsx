import React from "react";

export default function ModalEdicao({
  isOpen,
  onClose,
  editData,
  setEditData,
  categories,
  onMoneyInput,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-flex">
          <h2>Alterar Conta</h2>
          <button onClick={onClose} className="modal-close-icon">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form-vertical">
          <div>
            <label>Vencimento</label>
            <input
              type="date"
              value={editData.date}
              onChange={(e) =>
                setEditData({ ...editData, date: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Descrição</label>
            <input
              type="text"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Categoria</label>
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
            >
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Valor (R$)</label>
            <input
              type="tel"
              value={editData.amount}
              onChange={(e) => onMoneyInput(e, setEditData)}
              required
            />
          </div>

          <div className="modal-actions-box">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn-cancel"
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
