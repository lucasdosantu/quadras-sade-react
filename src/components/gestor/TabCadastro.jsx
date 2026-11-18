import React from "react";
import HeaderGestor from "./HeaderGestor";

export default function TabCadastro({
  currentMonth,
  onChangeMonth,
  onOpenMenu,
  formData,
  setFormData,
  categories,
  onMoneyInput,
  onSubmit,
}) {
  return (
    <section className="tab-content">
      <HeaderGestor
        title="Fluxo de Caixa"
        subtitle="Controle de Despesas"
        currentMonth={currentMonth}
        onMonthChange={onChangeMonth}
        onOpenMenu={onOpenMenu}
      />

      <form onSubmit={onSubmit} className="card">
        <div>
          <label>Vencimento</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Ex: Conta de Luz"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Categoria</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
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
          <label>Valor Total (R$)</label>
          <input
            type="tel"
            placeholder="R$ 0,00"
            value={formData.amount}
            onChange={(e) => onMoneyInput(e, setFormData)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Cadastrar
        </button>
      </form>
    </section>
  );
}
