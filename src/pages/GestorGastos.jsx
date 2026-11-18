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
} from "../components/gestor";

const STORAGE_KEY = "gestao_financeira_v1";
const CAT_STORAGE_KEY = "gestao_categorias_v1";
const CFG_STORAGE_KEY = "gestao_config_v1";

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
  const todayStr = now.toISOString().substring(0, 10);
  const currentMonthStr = todayStr.substring(0, 7);

  const [currentMonth, setCurrentMonth] = useState(currentMonthStr);
  const [activeTab, setActiveTab] = useState(config.defaultTab || "cadastro");
  const [menuAberto, setMenuAberto] = useState(false);

  const [formData, setFormData] = useState({
    date: todayStr,
    description: "",
    category: config.defaultCategory || "",
    amount: "",
  });

  // Modais e Calculadora
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
  const [calcPos, setCalcPos] = useState({
    x: window.innerWidth - 240,
    y: window.innerHeight - 340,
  });
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
    localStorage.setItem(CFG_STORAGE_KEY, JSON.stringify(config));
    document.body.className = "";
    if (config.theme === "light") document.body.classList.add("theme-light");
    if (config.theme === "oled") document.body.classList.add("theme-oled");
  }, [config]);

  const handleDragStart = (e) => {
    draggingRef.current = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    dragOffsetRef.current = { x: clientX - calcPos.x, y: clientY - calcPos.y };
  };

  const handleDragMove = (e) => {
    if (!draggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    setCalcPos({
      x: clientX - dragOffsetRef.current.x,
      y: clientY - dragOffsetRef.current.y,
    });
  };

  const handleDragEnd = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove);
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
    if (!val) return 0;
    return (
      parseFloat(
        val
          .toString()
          .replace(/[^\d,]/g, "")
          .replace(",", "."),
      ) || 0
    );
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

  const changeMonth = (delta) => {
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
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (Array.isArray(importedData)) {
            const opcao = window.prompt(
              "Deseja SOBRESCREVER os dados atuais ou ADICIONAR os novos dados?\nDigite '1' para Sobrescrever ou '2' para Adicionar:",
              "2",
            );
            if (opcao === "1") {
              setAccounts(importedData);
              alert("Dados sobrescritos com sucesso!");
            } else if (opcao === "2") {
              setAccounts([...accounts, ...importedData]);
              alert("Dados adicionados com sucesso!");
            }
          } else {
            alert("Arquivo JSON inválido.");
          }
        } catch {
          alert("Erro ao ler o arquivo JSON.");
        }
      };
    }
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
    let weeks = [];
    let current = new Date(firstDay);

    let weekNum = 1;
    while (current <= lastDay) {
      let startWeek = new Date(current);
      let endWeek = new Date(current);
      endWeek.setDate(endWeek.getDate() + 6);
      if (endWeek > lastDay) endWeek = new Date(lastDay);

      weeks.push({
        num: weekNum++,
        start: startWeek.toISOString().substring(0, 10),
        end: endWeek.toISOString().substring(0, 10),
      });
      current.setDate(current.getDate() + 7);
    }
    return weeks;
  };

  const filteredAccounts = accounts.filter(
    (acc) => acc.date.substring(0, 7) === currentMonth,
  );
  let unpaidSum = 0,
    paidSum = 0;
  filteredAccounts.forEach((acc) => {
    if (acc.paid) paidSum += parseFloat(acc.amount);
    else unpaidSum += parseFloat(acc.amount);
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
            onOpenMenu={() => setMenuAberto(true)}
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
      />

      <ModalMetas
        isOpen={modalMetasOpen}
        onClose={() => setModalMetasOpen(false)}
        currentMonth={currentMonth}
        filteredAccounts={filteredAccounts}
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
        onDragStart={handleDragStart}
        calcDisplay={calcDisplay}
        setCalcDisplay={setCalcDisplay}
      />
    </div>
  );
}
