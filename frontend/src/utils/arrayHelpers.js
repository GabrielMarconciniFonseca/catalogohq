/**
 * Utilitários para garantir que arrays sempre sejam arrays válidos
 * Previne erros do tipo "items.map is not a function"
 */

/**
 * Garante que o valor seja sempre um array
 * @param {any} value - Valor a ser validado
 * @param {string} context - Contexto para logging (opcional)
 * @returns {Array} Array válido
 */
export function ensureArray(value, context = "") {
  if (!Array.isArray(value)) {
    if (context) {
      console.warn(`[ensureArray] ${context}: Valor não é um array:`, value);
    }
    return [];
  }
  return value;
}

/**
 * Valida se a resposta da API contém um array
 * @param {any} response - Resposta da API
 * @param {string} apiEndpoint - Nome do endpoint para logging
 * @returns {Array} Array válido
 */
export function validateApiResponse(response, apiEndpoint = "") {
  if (!response) {
    console.warn(
      `[validateApiResponse] ${apiEndpoint}: Resposta vazia ou null`
    );
    return [];
  }

  if (!Array.isArray(response)) {
    console.warn(
      `[validateApiResponse] ${apiEndpoint}: Resposta não é um array:`,
      response
    );
    return [];
  }

  return response;
}

/**
 * Estados iniciais seguros para o React
 */
export const SAFE_INITIAL_STATES = {
  items: [],
  filters: {
    term: "",
    publisher: "todos",
    series: "todas",
    status: "todos",
    tags: "",
  },
  status: { state: "idle", message: "" },
  categories: [],
  tags: [],
};

/**
 * Valida estado antes de operações que requerem arrays
 * @param {any} state - Estado a ser validado
 * @param {string} operation - Nome da operação para logging
 * @returns {boolean} Se o estado é válido para a operação
 */
export function validateStateForArrayOperation(state, operation = "") {
  if (!Array.isArray(state)) {
    console.error(
      `[validateStateForArrayOperation] ${operation}: Estado não é um array:`,
      state
    );
    return false;
  }
  return true;
}
