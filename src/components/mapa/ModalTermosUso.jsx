import React, { useEffect } from "react";

export default function ModalTermosUso({
  isOpen,
  onClose,
  isDark = false,
  onReportarErro,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themeClass = isDark ? "dark" : "light";

  return (
    <div
      className="modal-overlay modal-termos-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-termos-titulo"
      onClick={onClose}
    >
      <div
        className={`modal-content modal-termos-box ${themeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-box modal-termos-header">
          <div className="modal-termos-title-wrap">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h2 id="modal-termos-titulo" className="modal-title-text">
              Termos de Uso e Isenção de Responsabilidade
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Fechar Termos de Uso"
          >
            ✕
          </button>
        </div>

        <div className="modal-body-text modal-termos-scroll">
          <p className="modal-p">
            Ao acessar e utilizar esta aplicação, o usuário concorda
            integralmente com os termos e avisos abaixo, e o uso continuado da
            aplicação representa ciência e aceitação da versão vigente. Caso não
            concorde com qualquer condição, o usuário deve interromper o uso
            imediatamente.
          </p>

          <h3>1. Natureza da Aplicação e Uso &ldquo;Como Está&rdquo;</h3>
          <p className="modal-p">
            Esta aplicação é fornecida gratuitamente para uso pessoal,
            educacional ou interno não comercial, no estado em que se encontra (
            <em>&ldquo;as is&rdquo;</em>) e conforme a disponibilidade do
            momento. Não há garantia de funcionamento ininterrupto, ausência de
            erros, atualização instantânea ou adequação a qualquer finalidade
            específica. Recursos, interfaces, links e rotinas podem ser
            alterados, suspensos ou descontinuados sem aviso prévio.
          </p>
          <p className="modal-p">
            Este é um projeto independente e não possui vínculo oficial com
            prefeituras, órgãos públicos, órgãos de trânsito, cartórios ou
            quaisquer empresas mencionadas ou exibidas.
          </p>

          <h3>2. Localizações, Quadras e Ausência de Navegação Própria</h3>
          <p className="modal-p">
            A aplicação apenas reúne e agrega informações de quadras e
            localidades que antes não estavam organizadas dessa forma.{" "}
            <strong>
              Esta aplicação não realiza navegação GPS nem traçado de rotas em
              tempo real
            </strong>
            : para se deslocar, o usuário deve escolher e utilizar seu
            aplicativo de navegação preferido (por exemplo,{" "}
            <strong>Waze</strong> ou <strong>Google Maps</strong>).
          </p>
          <p className="modal-p">
            O desenvolvedor{" "}
            <strong>
              não se responsabiliza por localidades, quadras, endereços, limites
              de bairros ou pontos exibidos incorretamente
            </strong>
            . Alterações urbanísticas, mudanças de sentido de vias, bloqueios,
            obras, loteamentos novos, numeração divergente ou desatualizações
            podem ocorrer. É de responsabilidade exclusiva do usuário conferir e
            confirmar a localidade antes de se deslocar, respeitando as leis de
            trânsito, a atenção à via e sua segurança pessoal.
          </p>
          <p className="modal-p">
            Caso encontre alguma quadra ou informação incorreta, o usuário deve
            utilizar a opção <strong>Reportar Erro no Mapa</strong> no menu
            lateral. Relatos e sugestões passam por análise voluntária, sem
            obrigação de correção imediata ou garantia de prazo.
          </p>

          <h3>3. Armazenamento Local, Privacidade e Gestor de Gastos</h3>
          <p className="modal-p">
            <strong>
              Nenhuma localização geográfica nem cookie de rastreamento próprio
              é armazenado pela aplicação
            </strong>
            , assim como os dados do <strong>Gestor de Gastos</strong> não são
            enviados nem salvos em servidores próprios.
          </p>
          <p className="modal-p">
            Todos os registros, categorias, metas, alertas e configurações do
            Gestor de Gastos ficam salvos exclusivamente na{" "}
            <strong>memória interna / armazenamento local do navegador</strong>{" "}
            no aparelho do usuário (como <code>localStorage</code>).
          </p>
          <p className="modal-p">
            É de responsabilidade exclusiva do usuário manter suas informações a
            salvo e realizar backups periódicos (como exportação em JSON ou
            CSV). Limpeza de dados do navegador/site, uso de aba anônima, troca
            de navegador ou aparelho, otimizadores de sistema ou limites de
            armazenamento do dispositivo podem apagar ou impedir o acesso aos
            registros. Além disso, lançamentos, datas, fuso horário/data do
            aparelho, valores e cálculos manuais devem sempre ser conferidos
            pelo usuário, pois a ferramenta tem caráter organizacional e não
            presta consultoria financeira, fiscal ou contábil.
          </p>

          <h3>
            4. Código Fonte Disponível, Canal Oficial e Proibição de Venda
          </h3>
          <p className="modal-p">
            O código-fonte desta aplicação é disponibilizado gratuitamente para
            uso não comercial conforme a licença do projeto, mantendo os avisos
            de copyright e atribuição. É{" "}
            <strong>
              expressamente proibida a venda, revenda, cobrança de acesso,
              sublicenciamento, oferta como serviço pago (SaaS) ou qualquer
              outra forma de monetização ou exploração comercial
            </strong>{" "}
            da aplicação ou de suas informações agregadas por terceiros.
          </p>
          <p className="modal-p">
            O canal oficial da aplicação é o link direto do GitHub Pages:{" "}
            <a
              href="https://lucasdosantu.github.io/quadras-sade-react/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://lucasdosantu.github.io/quadras-sade-react/
            </a>
            . Apenas o desenvolvedor, como autor original (
            <code>Lucas dos Santos da Silva / lucasdosantu</code>), detém o
            direito exclusivo de monetização — inclusive por meio de anúncios —,
            jamais havendo venda da aplicação ao público. Caso o usuário veja
            pessoas ou empresas vendendo ou cobrando por esta aplicação, deve{" "}
            <strong>denunciar</strong> o abuso.
          </p>

          <h3>5. Versões, Cache, Serviços de Terceiros e Limitação Geral</h3>
          <p className="modal-p">
            Versões antigas podem permanecer em cache no navegador até que o
            usuário atualize a página ou o aplicativo. Camadas de mapa, satélite
            e links externos (como OpenStreetMap, Google, Waze, Google Maps,
            formulários de relato ou contadores) são operados por terceiros e
            possuem termos e políticas próprias, fora do controle do
            desenvolvedor.
          </p>
          <p className="modal-p">
            Na máxima extensão permitida por lei, o desenvolvedor não responde
            por quaisquer danos diretos ou indiretos, prejuízos financeiros,
            perda de dados, perda de tempo, incidentes em deslocamentos,
            ausência de suporte técnico contínuo ou consequências decorrentes do
            uso ou da impossibilidade de uso da aplicação. Ao enviar sugestões
            ou relatos, o usuário declara não violar direitos de terceiros nem
            incluir dados pessoais sensíveis. Estes termos podem ser atualizados
            a qualquer momento conforme a evolução do projeto.
          </p>
        </div>

        <div className="modal-termos-footer">
          {typeof onReportarErro === "function" && (
            <button
              type="button"
              className="modal-termos-btn-secondary"
              onClick={() => {
                onClose?.();
                onReportarErro();
              }}
            >
              Reportar Erro no Mapa
            </button>
          )}

          <button
            type="button"
            className="modal-termos-btn-primary"
            onClick={onClose}
          >
            Entendi e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
