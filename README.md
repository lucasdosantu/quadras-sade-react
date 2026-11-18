# 🗺️ SADE - Localizador de Quadras & Gestor de Gastos

O **SADE Localizador** é um Progressive Web App (PWA) moderno desenvolvido em **React** e **Vite**, projetado especialmente para otimizar o trabalho de campo (como mapeamento urbano, localização de quadras por CEP/bairro, cálculo de rotas e gestão financeira integrada) com alta performance e funcionamento 100% offline.

---

## 🚀 Principais Funcionalidades

### 1. 📍 Localizador e Mapeador de Quadras
* **Busca Inteligente (Fuse.js):** Pesquise quadras rapidamente digitando o número, o nome do bairro ou o CEP. Permite buscas combinadas (ex: `6, Vila Paraíso`).
* **Mapa Interativo (Leaflet):** Visualização dinâmica de ruas e alternância fluida para o modo Satélite.
* **Geolocalização em Tempo Real:** Acompanhamento da posição atual do usuário com cálculo automático de distância até a quadra selecionada.
* **Modo de Sugestão de Quadra:** Ferramenta para o usuário sugerir novas quadras diretamente no mapa, integrando o envio de coordenadas via formulário externo.
* **Gestão de Rotas:** Adicione múltiplos pontos a uma rota personalizada de visitas e gere rotas instantâneas para navegação externa.

### 2. 💰 Gestor de Gastos Integrado
* **Controle Financeiro Mensal:** Gerencie receitas, despesas e faturas de forma organizada com navegação por mês ativo.
* **Calculadora Flutuante:** Ferramenta interativa flutuante com suporte a toque/mouse para cálculos rápidos em campo.
* **Modais Modulares:** Configurações de metas semanais, gestão de categorias personalizadas e edição ágil de lançamentos.
* **Persistência Offline:** Todos os dados financeiros são salvos de forma segura no armazenamento local (*LocalStorage*) do dispositivo.

### 3. 🌙 Experiência e Usabilidade (UX/UI)
* **Modo Noturno (Dark Theme):** Interface totalmente otimizada para uso noturno ou ambientes com pouca luz (incluindo inversão de cores e filtros amoled no mapa).
* **BottomSheet (Painel Deslizante):** Visualização de detalhes das quadras de forma moderna e ergonômica na parte inferior da tela, sem poluir a visualização do mapa.
* **Instalação PWA:** Funciona como um aplicativo nativo no celular, com suporte offline ativado via Service Worker.

---

## 🛠️ Tecnologias Utilizadas

* **React 19** – Biblioteca principal para construção da interface baseada em componentes.
* **Vite** – Empacotador de alta performance para desenvolvimento e build de produção.
* **React Router DOM (HashRouter)** – Gerenciamento de rotas otimizado para ambientes estáticos como o GitHub Pages.
* **Leaflet & React-Leaflet** – Exibição de mapas interativos e customização de marcadores.
* **Fuse.js** – Motor de busca difusa (*fuzzy search*) ultrarrápido para localização de quadras.
* **CSS Moderno / Modular** – Estilização customizada focada em design limpo, responsivo e adaptado para dispositivos móveis.

---

## 📂 Arquitetura do Projeto

O projeto está estruturado em uma arquitetura modularizada para facilitar a manutenção e escalabilidade:

```text
quadras-sade-react/
├── public/                 # Ícones, manifest.json, service worker e assets estáticos
├── src/
│   ├── components/
│   │   ├── mapa/           # Componentes do mapa, busca, rotas e painéis
│   │   └── gestor/         # Componentes modulares do gestor financeiro
│   ├── data/               # Bases de dados geográficas e de anúncios
│   ├── hooks/              # Hooks customizados (useGps, useRota)
│   ├── pages/              # Páginas principais de rotas (Mapa e Gestor de Gastos)
│   ├── App.jsx             # Roteador central e layout raiz
│   ├── main.jsx            # Ponto de entrada e registro do Service Worker
│   └── index.css           # Estilos globais da aplicação
├── package.json            # Dependências e scripts de build/deploy
└── vite.config.js          # Configuração do Vite e injeção da versão do app
```

---

## ⚙️ Instalação e Execução Local

Para rodar o projeto em sua máquina ou ambiente de desenvolvimento (como o Acode no Android):

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/lucasdosantu/quadras-sade-react.git
   cd quadras-sade-react
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 📦 Deploy e Publicação (GitHub Pages)

O projeto possui automação configurada via pacote `gh-pages`. Para atualizar o código fonte e publicar uma nova versão diretamente no ar, execute o comando unificado no terminal:

```bash
git add . && git commit -m "Atualiza sistema e publica nova versão" && git push && npm run deploy
```

---

## 📄 Versão do Sistema

O versionamento é controlado centralmente no arquivo `package.json` e refletido dinamicamente no menu lateral e nos avisos do sistema.

* **Versão Atual:** `0.0.1`

---

## 🛡️ Privacidade
O SADE opera sob uma política de **privacidade estrita**: todos os dados inseridos (como registros financeiros, rotas e preferências) são armazenados localmente no seu dispositivo (*LocalStorage*), sem compartilhamento de informações com servidores externos.

© 2026 SADE • Todos os direitos reservados.