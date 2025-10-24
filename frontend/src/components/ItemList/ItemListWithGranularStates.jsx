import { useState, useEffect } from "react";
import {
  fetchItemsWithState,
  ERROR_TYPES,
  HTTP_STATUS,
} from "../../services/api";
import ComicCard from "../ComicCard";
import "./ItemList.css";

/**
 * EXEMPLO DE MIGRAÇÃO: ItemList usando estados granulares da API
 *
 * Este arquivo demonstra como migrar o componente ItemList para usar
 * as novas funções *WithState do services/api.js
 *
 * Benefícios:
 * - Tratamento específico de erros por tipo
 * - Feedback contextual ao usuário
 * - Opção de retry para erros temporários
 * - Melhor experiência em diferentes cenários de erro
 */

function ItemListWithGranularStates({ filters, onSelectItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    // Usar versão com estados granulares
    const result = await fetchItemsWithState(filters);

    setLoading(false);

    if (result.status === "success") {
      setItems(result.data);
    } else {
      // Tratamento específico por tipo de erro
      const errorState = {
        message: result.message,
        type: result.error.type,
        statusCode: result.statusCode,
        canRetry: false,
      };

      switch (result.error.type) {
        case ERROR_TYPES.NETWORK:
          errorState.message = "Sem conexão com o servidor";
          errorState.subtitle =
            "Verifique sua conexão e tente novamente";
          errorState.canRetry = true;
          errorState.icon = "wifi-off";
          break;

        case ERROR_TYPES.AUTHENTICATION:
          errorState.message = "Sessão expirada";
          errorState.subtitle = "Faça login novamente para continuar";
          errorState.action = {
            label: "Fazer Login",
            onClick: () => (window.location.href = "/login"),
          };
          errorState.icon = "lock";
          break;

        case ERROR_TYPES.AUTHORIZATION:
          errorState.message = "Acesso não autorizado";
          errorState.subtitle = "Você não tem permissão para visualizar estes items";
          errorState.icon = "shield-alert";
          break;

        case ERROR_TYPES.SERVER:
          errorState.message = "Servidor temporariamente indisponível";
          errorState.subtitle = "Estamos trabalhando para resolver o problema";
          errorState.canRetry = true;
          errorState.icon = "server-off";
          break;

        case ERROR_TYPES.NOT_FOUND:
          errorState.message = "Nenhum item encontrado";
          errorState.subtitle = "Tente ajustar os filtros de busca";
          errorState.icon = "search";
          break;

        default:
          errorState.message = result.message || "Erro ao carregar items";
          errorState.subtitle = "Ocorreu um problema inesperado";
          errorState.canRetry = true;
          errorState.icon = "alert-circle";
      }

      setError(errorState);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="item-list">
        <div className="item-list__loading">
          <div className="loading-spinner" />
          <p>Carregando HQs...</p>
        </div>
      </div>
    );
  }

  // Error state com tratamento granular
  if (error) {
    return (
      <div className="item-list">
        <div className="item-list__error">
          <div className={`error-icon error-icon--${error.icon}`}>
            {/* Ícone SVG baseado no tipo de erro */}
            {renderErrorIcon(error.icon)}
          </div>
          <h3 className="error-title">{error.message}</h3>
          <p className="error-subtitle">{error.subtitle}</p>

          <div className="error-actions">
            {error.canRetry && (
              <button
                className="btn btn--primary"
                onClick={loadItems}
                type="button"
              >
                Tentar Novamente
              </button>
            )}
            {error.action && (
              <button
                className="btn btn--secondary"
                onClick={error.action.onClick}
                type="button"
              >
                {error.action.label}
              </button>
            )}
          </div>

          {/* Debug info em desenvolvimento */}
          {import.meta.env.DEV && (
            <details className="error-details">
              <summary>Detalhes técnicos</summary>
              <pre>
                {JSON.stringify(
                  {
                    type: error.type,
                    statusCode: error.statusCode,
                    message: error.message,
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="item-list">
        <div className="item-list__empty">
          <svg className="empty-icon" width="88" height="88" viewBox="0 0 88 88">
            {/* Ícone de lista vazia */}
          </svg>
          <h3>Nenhuma HQ encontrada</h3>
          <p>Tente ajustar os filtros ou adicione novas HQs à coleção</p>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="item-list">
      {items.map((item) => (
        <ComicCard key={item.id} item={item} onSelect={onSelectItem} />
      ))}
    </div>
  );
}

/**
 * Renderiza ícone SVG baseado no tipo de erro
 */
function renderErrorIcon(iconName) {
  const icons = {
    "wifi-off": (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 13a10 10 0 0 1 14 0" strokeWidth="2" strokeLinecap="round" />
        <path d="M8.5 16.5a5 5 0 0 1 7 0" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 8.82a15 15 0 0 1 20 0" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    lock: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    "shield-alert": (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" strokeWidth="2" />
        <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    "server-off": (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="2" width="20" height="8" rx="2" strokeWidth="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" strokeWidth="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    search: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    "alert-circle": (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };

  return icons[iconName] || icons["alert-circle"];
}

export default ItemListWithGranularStates;
