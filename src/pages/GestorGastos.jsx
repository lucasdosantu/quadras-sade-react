import React, { useState, useEffect, useRef } from "react";
import "./GestorGastos.css";

import {
  TabCadastro,
  TabResumo,
  TabHistorico,
  MenuLateral,
  CalculadoraFlutuante,
  ModalConfig,
  ModalMetas,
  ModalEdicao,
  ModalCategorias,
  GuiaUsoGestor,
} from "../components/gestor";

const STORAGE_KEY = "gestao_financeira_v1";
const CAT_STORAGE_KEY = "gestao_categorias_v1";
const CFG_STORAGE_KEY = "gestao_config_v1";
const THEME_SYNC_EVENT = "sade-theme-sync";

const formatLocalDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const mesclarCategorias = (categoriasAtuais, categoriasImportadas) => {
  const resultado = Array.isArray(categoriasAtuais)
    ? [...categoriasAtuais]
    : [];
  const vistas = new Set(
    resultado
      .filter((c) => typeof c === "string")
      .map((c) => c.trim().toLowerCase()),
  );

  for (const cat of categoriasImportadas) {
    if (typeof cat !== "string") continue;
    const limpa = cat.trim();
    if (!limpa) continue;
    const chave = limpa.toLowerCase();
    if (!vistas.has(chave)) {
      vistas.add(chave);
      resultado.push(limpa);
    }
  }

  return resultado;
};

export default function GestorGastos() {
  const [accounts, setAccounts] = useState(
    () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  );
  const [categories, setCategories] = useState(
    () =>
      JSON.parse(localStorage.getItem(CAT_STORAGE_KEY)) || [
        "Alimentação",
        "Moradia",
        "Transporte",
        "Lazer",
        "Outros",
      ],
  );

  const [config, setConfig] = useState(() => {
    const def = {
      theme: "dark",
      resetDateToday: true,
      defaultCategory: "",
      hideAmounts: false,
      hideCents: false,
      defaultTab: "cadastro",
      criticalDays: 1,
      criticalColor: "#ef4444",
      warningDays: 3,
      warningColor: "#ec4899",
      startOfWeek: "Segunda-feira",
      workDays: 5,
      reservePercent: 10,
    };
    return {
      ...def,
      ...(JSON.parse(localStorage.getItem(CFG_STORAGE_KEY)) || {}),
    };
  });

  const now = new Date();
  const todayStr = formatLocalDate(now);
  const currentMonthStr = todayStr.substring(0, 7);

  const [currentMonth, setCurrentMonth] = useState(currentMonthStr);
  const [activeTab, setActiveTab] = useState(config.defaultTab || "cadastro");
  const [menuAberto, setMenuAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [currentGuiaStepId, setCurrentGuiaStepId] = useState(null);

  const [formData, setFormData] = useState({
    date: todayStr,
    description: "",
    category: config.defaultCategory || "",
    amount: "",
  });

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    date: "",
    description: "",
    category: "",
    amount: "",
  });
  const [modalConfigOpen, setModalConfigOpen] = useState(false);
  const [modalMetasOpen, setModalMetasOpen] = useState(false);
  const [modalCatOpen, setModalCatOpen] = useState(false);

  const [calcState, setCalcState] = useState("closed");
  const [calcPos, setCalcPos] = useState(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [calcDisplay, setCalcDisplay] = useState("0");

  useEffect(() => {
    try {
      const totalString = JSON.stringify(localStorage);
      if (new Blob([totalString]).size > 4.5 * 1024 * 1024) {
        alert(
          "Atenção: O armazenamento local (localStorage) está próximo do limite. Faça a exportação em JSON.",
        );
      }
    } catch {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(CFG_STORAGE_KEY, JSON.stringify(config));
    document.body.className = "";
    if (config.theme === "light") document.body.classList.add("theme-light");
    if (config.theme === "oled") document.body.classList.add("theme-oled");
    window.dispatchEvent(
      new CustomEvent(THEME_SYNC_EVENT, {
        detail: {
          theme: config.theme,
          isDark: config.theme === "dark" || config.theme === "oled",
        },
      }),
    );
  }, [config]);

  useEffect(() => {
    const handleExternalThemeSync = (event) => {
      const nextTheme = event.detail?.theme;
      if (nextTheme && ["dark", "light", "oled"].includes(nextTheme)) {
        setConfig((prev) =>
          prev.theme === nextTheme ? prev : { ...prev, theme: nextTheme },
        );
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === CFG_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.theme) {
            setConfig((prev) =>
              prev.theme === parsed.theme ? prev : { ...prev, ...parsed },
            );
          }
        } catch {}
      }
    };

    window.addEventListener(THEME_SYNC_EVENT, handleExternalThemeSync);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener(THEME_SYNC_EVENT, handleExternalThemeSync);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleDragStart = (e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = calcPos ? calcPos.x : rect.left;
    const currentY = calcPos ? calcPos.y : rect.top;

    if (!calcPos) {
      setCalcPos({ x: currentX, y: currentY });
    }

    draggingRef.current = true;
    dragOffsetRef.current = { x: clientX - currentX, y: clientY - currentY };
  };

  const handleDragMove = (e) => {
    if (!draggingRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const maxX = Math.max(8, window.innerWidth - 56);
    const maxY = Math.max(8, window.innerHeight - 56);
    const nextX = Math.min(
      Math.max(8, clientX - dragOffsetRef.current.x),
      maxX,
    );
    const nextY = Math.min(
      Math.max(8, clientY - dragOffsetRef.current.y),
      maxY,
    );

    setCalcPos({ x: nextX, y: nextY });
  };

  const handleDragEnd = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [calcPos]);

  const handleMoneyInput = (e, setter) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setter((prev) => ({ ...prev, amount: "" }));
      return;
    }
    value = (parseInt(value, 10) / 100).toFixed(2);
    const formatted =
      "R$ " + value.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter((prev) => ({ ...prev, amount: formatted }));
  };

  const parseMoneyValue = (val) => {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = val.toString().trim();
    if (str.includes(",")) {
      return parseFloat(str.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
    }
    return parseFloat(str.replace(/[^\d.-]/g, "")) || 0;
  };

  const formatDisplayMoney = (val) => {
    if (config.hideAmounts) return "R$ ****";
    let num = parseFloat(val) || 0;
    if (config.hideCents) num = Math.round(num);
    return (
      "R$ " +
      num.toLocaleString("pt-BR", {
        minimumFractionDigits: config.hideCents ? 0 : 2,
        maximumFractionDigits: config.hideCents ? 0 : 2,
      })
    );
  };

  const toggleHideAmounts = () => {
    setConfig((prev) => ({
      ...prev,
      hideAmounts: !prev.hideAmounts,
    }));
  };

  const changeMonth = (delta, isDirect = false) => {
    if (isDirect && typeof delta === "string") {
      if (delta) setCurrentMonth(delta);
      return;
    }
    const [year, month] = currentMonth.split("-").map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    setCurrentMonth(
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newAccount = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: parseMoneyValue(formData.amount),
      paid: false,
    };
    setAccounts([...accounts, newAccount]);
    setFormData({
      date: config.resetDateToday ? todayStr : formData.date,
      description: "",
      category: config.defaultCategory || "",
      amount: "",
    });
    setActiveTab("registros");
  };

  const togglePaid = (id) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, paid: !acc.paid } : acc,
      ),
    );
  };

  const deleteAccount = (id) => {
    if (window.confirm("Deseja realmente apagar esta conta?")) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  const clearAllAccounts = () => {
    if (accounts.length === 0) {
      alert("Não há registros para excluir.");
      return;
    }

    const confirmacao = window.prompt(
      "ATENÇÃO: Todos os registros serão excluídos permanentemente.\n\nPara confirmar, digite EXCLUIR:",
    );

    if (confirmacao === "EXCLUIR") {
      setAccounts([]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      alert("Todos os registros foram excluídos com sucesso.");
    } else if (confirmacao !== null) {
      alert('Ação cancelada. Você precisa digitar exatamente "EXCLUIR".');
    }
  };

  const openEditModal = (acc) => {
    setEditData({
      id: acc.id,
      date: acc.date,
      description: acc.description,
      category: acc.category || "",
      amount:
        "R$ " +
        parseFloat(acc.amount)
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    });
    setModalEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setAccounts(
      accounts.map((acc) => {
        if (acc.id === editData.id) {
          return {
            ...acc,
            date: editData.date,
            description: editData.description,
            category: editData.category,
            amount: parseMoneyValue(editData.amount),
          };
        }
        return acc;
      }),
    );
    setModalEditOpen(false);
  };

  const getAccountStatus = (dueDateStr, paid) => {
    if (paid) return "normal";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dueDateStr.split("-").map(Number);
    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0 || diffDays <= config.criticalDays) return "critical";
    if (diffDays <= config.warningDays) return "warning";
    return "normal";
  };

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(accounts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `gestor_financeiro_${currentMonth}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (e) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const rawList = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.accounts)
            ? parsed.accounts
            : null;

        if (!rawList) {
          alert("Arquivo JSON inválido. Estrutura de contas não encontrada.");
          input.value = "";
          return;
        }

        const normalizedData = rawList
          .filter((item) => item && item.date && item.description !== undefined)
          .map((item, idx) => ({
            id:
              item.id ||
              (crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now().toString(36)}_${idx}`),
            date: String(item.date).substring(0, 10),
            description: String(item.description).trim(),
            category: item.category ? String(item.category).trim() : "",
            amount: parseMoneyValue(item.amount),
            paid: Boolean(item.paid),
          }));

        if (normalizedData.length === 0) {
          alert("Nenhum registro válido encontrado no arquivo JSON.");
          input.value = "";
          return;
        }

        const importedCategories = [];
        if (Array.isArray(parsed?.categories)) {
          importedCategories.push(...parsed.categories);
        }
        normalizedData.forEach((acc) => {
          if (acc.category) {
            importedCategories.push(acc.category);
          }
        });

        const aplicarCategorias = () => {
          if (importedCategories.length === 0) return;
          setCategories((prev) => {
            const atualizadas = mesclarCategorias(prev, importedCategories);
            localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(atualizadas));
            return atualizadas;
          });
        };

        const opcao = window.prompt(
          `${normalizedData.length} registros prontos para importar.\nDeseja SOBRESCREVER os dados atuais ou ADICIONAR os novos dados?\nDigite '1' para Sobrescrever ou '2' para Adicionar:`,
          "2",
        );

        if (opcao === "1") {
          setAccounts(normalizedData);
          aplicarCategorias();
          alert("Dados sobrescritos com sucesso!");
        } else if (opcao === "2") {
          const existingIds = new Set(accounts.map((a) => a.id));
          const merged = [
            ...accounts,
            ...normalizedData.map((item) =>
              existingIds.has(item.id)
                ? {
                    ...item,
                    id: crypto.randomUUID
                      ? crypto.randomUUID()
                      : `${item.id}_${Date.now()}`,
                  }
                : item,
            ),
          ];
          setAccounts(merged);
          aplicarCategorias();
          alert("Dados adicionados com sucesso!");
        }
      } catch {
        alert("Erro ao ler o arquivo JSON.");
      } finally {
        input.value = "";
      }
    };
  };

  const exportCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8,Data,Descricao,Categoria,Valor,Pago\n";
    accounts.forEach((acc) => {
      csvContent += `${acc.date},"${acc.description}","${acc.category || ""}",${acc.amount},${acc.paid}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gestor_financeiro_${currentMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getWeeksInMonth = (yearMonth) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    let weekStartDay = 1;
    if (config.startOfWeek === "Domingo") {
      weekStartDay = 0;
    } else if (config.startOfWeek === "Sábado") {
      weekStartDay = 6;
    }

    const diffFromStart = (firstDay.getDay() - weekStartDay + 7) % 7;
    const firstWeekStart = new Date(firstDay);
    firstWeekStart.setDate(firstDay.getDate() - diffFromStart);

    const weeks = [];
    let currentStart = new Date(firstWeekStart);
    let weekNum = 1;

    while (currentStart <= lastDay) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentStart.getDate() + 6);

      weeks.push({
        num: weekNum++,
        start: formatLocalDate(currentStart),
        end: formatLocalDate(currentEnd),
      });

      const nextStart = new Date(currentStart);
      nextStart.setDate(currentStart.getDate() + 7);
      currentStart = nextStart;
    }

    return weeks;
  };

  const handleGuiaStepChange = (stepId) => {
    setCurrentGuiaStepId(stepId);

    switch (stepId) {
      case "menu-gestor":
        setModalConfigOpen(false);
        setModalMetasOpen(false);
        setCalcState("closed");
        setMenuAberto(true);
        break;
      case "config-geral":
        setMenuAberto(false);
        setModalConfigOpen(true);
        break;
      case "config-categorias":
      case "config-dados":
        setMenuAberto(true);
        setModalConfigOpen(true);
        break;
      case "novo-gasto":
        setModalConfigOpen(false);
        setModalMetasOpen(false);
        setMenuAberto(false);
        setActiveTab("cadastro");
        break;
      case "resumo-mes":
        setModalMetasOpen(false);
        setActiveTab("resumo");
        break;
      case "meta-semanal":
        setActiveTab("resumo");
        setModalMetasOpen(true);
        break;
      case "historico-contas":
        setModalMetasOpen(false);
        setMenuAberto(false);
        setCalcState("closed");
        setActiveTab("registros");
        break;
      case "calculadora":
        setActiveTab("registros");
        setCalcPos(null);
        setCalcState("open");
        break;
      case "voltar-mapa":
        setCalcState("closed");
        setMenuAberto(true);
        break;
      default:
        break;
    }
  };

  const handleCloseGuia = () => {
    setGuiaAberto(false);
    setCurrentGuiaStepId(null);
    setMenuAberto(false);
    setModalConfigOpen(false);
    setModalMetasOpen(false);
    setCalcState("closed");
  };

  const guiaConfigTab =
    guiaAberto && currentGuiaStepId === "config-geral"
      ? "alertas"
      : guiaAberto && currentGuiaStepId === "config-categorias"
        ? "exibicao"
        : guiaAberto && currentGuiaStepId === "config-dados"
          ? "dados"
          : null;

  const filteredAccounts = accounts.filter(
    (acc) => acc.date && acc.date.substring(0, 7) === currentMonth,
  );
  let unpaidSum = 0,
    paidSum = 0;
  filteredAccounts.forEach((acc) => {
    if (acc.paid) paidSum += parseFloat(acc.amount) || 0;
    else unpaidSum += parseFloat(acc.amount) || 0;
  });

  const isDark = config.theme === "dark" || config.theme === "oled";

  return (
    <div className={`gestor-gastos-wrapper ${config.theme}`}>
      <main className="gestor-main">
        {activeTab === "cadastro" && (
          <TabCadastro
            currentMonth={currentMonth}
            onChangeMonth={changeMonth}
            onOpenMenu={() => setMenuAberto(true)}
            hideAmounts={config.hideAmounts}
            onToggleHideAmounts={toggleHideAmounts}
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onMoneyInput={handleMoneyInput}
            onSubmit={handleFormSubmit}
          />
        )}

        {activeTab === "resumo" && (
          <TabResumo
            currentMonth={currentMonth}
            onChangeMonth={changeMonth}
            onOpenMenu={() => setMenuAberto(true)}
            hideAmounts={config.hideAmounts}
            onToggleHideAmounts={toggleHideAmounts}
            unpaidSum={unpaidSum}
            paidSum={paidSum}
            formatDisplayMoney={formatDisplayMoney}
            onOpenMetas={() => setModalMetasOpen(true)}
          />
        )}

        {activeTab === "registros" && (
          <TabHistorico
            currentMonth={currentMonth}
            onChangeMonth={changeMonth}
            onOpenMenu={() => setMenuAberto(true)}
            hideAmounts={config.hideAmounts}
            onToggleHideAmounts={toggleHideAmounts}
            filteredAccounts={filteredAccounts}
            getAccountStatus={getAccountStatus}
            config={config}
            togglePaid={togglePaid}
            formatDisplayMoney={formatDisplayMoney}
            openEditModal={openEditModal}
            deleteAccount={deleteAccount}
          />
        )}
      </main>

      <MenuLateral
        isOpen={menuAberto}
        onClose={() => setMenuAberto(false)}
        config={config}
        setConfig={setConfig}
        isDark={isDark}
        onOpenConfig={() => setModalConfigOpen(true)}
        setActiveTab={setActiveTab}
        onOpenGuia={() => setGuiaAberto(true)}
      />

      <ModalConfig
        isOpen={modalConfigOpen}
        onClose={() => setModalConfigOpen(false)}
        config={config}
        setConfig={setConfig}
        categories={categories}
        onOpenCategories={() => setModalCatOpen(true)}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onExportCSV={exportCSV}
        onClearAllAccounts={clearAllAccounts}
        forcedTab={guiaConfigTab}
      />

      <ModalMetas
        isOpen={modalMetasOpen}
        onClose={() => setModalMetasOpen(false)}
        currentMonth={currentMonth}
        accounts={accounts}
        getWeeksInMonth={getWeeksInMonth}
        config={config}
        formatDisplayMoney={formatDisplayMoney}
        unpaidSum={unpaidSum}
        paidSum={paidSum}
      />

      <ModalEdicao
        isOpen={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        editData={editData}
        setEditData={setEditData}
        categories={categories}
        onMoneyInput={handleMoneyInput}
        onSubmit={handleEditSubmit}
      />

      <ModalCategorias
        isOpen={modalCatOpen}
        onClose={() => setModalCatOpen(false)}
        categories={categories}
        setCategories={setCategories}
        storageKey={CAT_STORAGE_KEY}
      />

      <CalculadoraFlutuante
        calcState={calcState}
        setCalcState={setCalcState}
        calcPos={calcPos}
        onResetPos={() => setCalcPos(null)}
        onDragStart={handleDragStart}
        calcDisplay={calcDisplay}
        setCalcDisplay={setCalcDisplay}
      />

      <GuiaUsoGestor
        isOpen={guiaAberto}
        onClose={handleCloseGuia}
        theme={config.theme}
        activeTab={activeTab}
        menuAberto={menuAberto}
        modalConfigOpen={modalConfigOpen}
        modalMetasOpen={modalMetasOpen}
        calcState={calcState}
        onStepChange={handleGuiaStepChange}
      />
    </div>
  );
}
