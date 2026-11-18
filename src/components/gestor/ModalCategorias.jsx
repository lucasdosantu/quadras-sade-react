import React, { useState } from "react";

export default function ModalCategorias({
  isOpen,
  onClose,
  categories,
  setCategories,
  storageKey,
}) {
  const [newCatName, setNewCatName] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState(null);
  const [editingCatValue, setEditingCatValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-flex">
          <h2>Gerenciar Categorias</h2>
          <button onClick={onClose} className="modal-close-icon">
            ✕
          </button>
        </div>
        <div className="modal-body-scroll" style={{ maxHeight: 220 }}>
          {categories.map((cat, idx) => (
            <div key={cat} className="cat-item-row">
              {editingCatIndex === idx ? (
                <input
                  type="text"
                  value={editingCatValue}
                  onChange={(e) => setEditingCatValue(e.target.value)}
                  style={{ margin: 0, height: 34 }}
                />
              ) : (
                <span>{cat}</span>
              )}

              <div style={{ display: "flex", gap: 4 }}>
                {editingCatIndex === idx ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        editingCatValue &&
                        !categories.includes(editingCatValue)
                      ) {
                        const novas = [...categories];
                        novas[idx] = editingCatValue;
                        setCategories(novas);
                        localStorage.setItem(storageKey, JSON.stringify(novas));
                      }
                      setEditingCatIndex(null);
                    }}
                    className="btn-action-icon"
                    title="Salvar"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatIndex(idx);
                      setEditingCatValue(cat);
                    }}
                    className="btn-action-icon"
                    title="Editar"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const novas = categories.filter((c) => c !== cat);
                    setCategories(novas);
                    localStorage.setItem(storageKey, JSON.stringify(novas));
                  }}
                  className="btn-action-icon"
                  title="Excluir"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="Nova Categoria"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button
            onClick={() => {
              if (newCatName && !categories.includes(newCatName)) {
                const novas = [...categories, newCatName];
                setCategories(novas);
                localStorage.setItem(storageKey, JSON.stringify(novas));
                setNewCatName("");
              }
            }}
            className="btn-primary"
            style={{ marginTop: 8 }}
          >
            Adicionar Categoria
          </button>
        </div>
      </div>
    </div>
  );
}
