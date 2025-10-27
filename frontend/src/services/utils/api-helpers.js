/**
 * @fileoverview Funções auxiliares para requisições e tratamento de dados da API
 * @module services/utils/api-helpers
 */

import { ValidationError } from "./errors.js";

// ============================================================================
// WRAPPER DE REQUISIÇÕES
// ============================================================================

/**
 * Objeto de resultado de requisição com estados granulares
 * @typedef {Object} ApiRequestResult
 * @property {*} data - Dados da resposta (null em caso de erro)
 * @property {import('./errors.js').ApiError|null} error - Erro categorizado (null em caso de sucesso)
 * @property {'success'|'error'} status - Status da operação
 * @property {number|null} statusCode - Código HTTP da resposta
 * @property {string} message - Mensagem descritiva
 */

/**
 * Função wrapper para requisições com estados granulares
 * Executa uma função de requisição axios e retorna objeto padronizado com resultado
 *
 * @param {Function} requestFn - Função que executa a requisição axios
 * @returns {Promise<ApiRequestResult>} Objeto com { data, error, status, statusCode, message }
 *
 * @example
 * const result = await apiRequest(() => apiClient.get('/items'));
 * if (result.status === 'success') {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.message);
 * }
 */
export async function apiRequest(requestFn) {
  try {
    const response = await requestFn();
    return {
      data: response.data,
      error: null,
      status: "success",
      statusCode: response.status,
      message: response.data?.message || "Operação concluída com sucesso.",
    };
  } catch (error) {
    // parseError será importado do módulo de erros quando necessário
    const { parseError } = await import("./errors.js");
    const parsedError = parseError(error);
    return {
      data: null,
      error: parsedError,
      status: "error",
      statusCode: parsedError.statusCode,
      message: parsedError.message,
    };
  }
}

// ============================================================================
// QUERY BUILDER
// ============================================================================

/**
 * Objeto de parâmetros de filtro
 * @typedef {Object} FilterParams
 * @property {string} [term] - Termo de busca
 * @property {string} [publisher] - Editora
 * @property {string} [series] - Série
 * @property {string} [status] - Status do item
 * @property {string[]} [tags] - Tags para filtrar
 */

/**
 * Constrói query string a partir de filtros
 * Remove valores vazios e valores padrão ("todos", "todas")
 *
 * @param {FilterParams} params - Filtros de busca
 * @returns {string} Query string formatada (?term=value&status=...)
 *
 * @example
 * const query = buildQuery({ term: 'batman', publisher: 'DC' });
 * // Retorna: "?term=batman&publisher=DC"
 */
export function buildQuery(params) {
  const searchParams = new URLSearchParams();

  if (params.term) {
    searchParams.set("term", params.term);
  }

  if (params.publisher && params.publisher !== "todos") {
    searchParams.set("publisher", params.publisher);
  }

  if (params.series && params.series !== "todas") {
    searchParams.set("series", params.series);
  }

  if (params.status && params.status !== "todos") {
    searchParams.set("status", params.status);
  }

  if (Array.isArray(params.tags) && params.tags.length) {
    params.tags.forEach((tag) => {
      if (tag.trim()) {
        searchParams.append("tags", tag.trim());
      }
    });
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ============================================================================
// VALIDAÇÃO DE RESPOSTA
// ============================================================================

/**
 * Valida se a resposta da API é um array válido
 * Lança erro se não for array ou se for null/undefined
 *
 * @param {*} data - Dados retornados pela API
 * @param {string} context - Contexto da chamada (para mensagem de erro)
 * @returns {Array} Array validado
 * @throws {ValidationError} Se os dados não forem um array válido
 *
 * @example
 * const items = validateArrayResponse(response.data, 'fetchItems');
 */
export function validateArrayResponse(data, context = "API") {
  if (!Array.isArray(data)) {
    throw new ValidationError(
      `Resposta inválida de ${context}: esperado array, recebido ${typeof data}`
    );
  }
  return data;
}

// ============================================================================
// URL HELPERS
// ============================================================================

/**
 * Constrói URL completa para assets do backend
 * Trata URLs absolutas e relativas
 *
 * @param {string} path - Caminho do asset
 * @param {string} apiOrigin - Origem da API
 * @returns {string|null} URL completa ou null se path for inválido
 *
 * @example
 * const imageUrl = buildAssetUrl('/uploads/image.jpg', 'http://localhost:8080');
 * // Retorna: "http://localhost:8080/uploads/image.jpg"
 */
export function buildAssetUrl(path, apiOrigin) {
  if (!path) {
    return null;
  }

  // Se já for URL completa, retornar como está
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Normalizar path para começar com /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiOrigin}${normalizedPath}`;
}
