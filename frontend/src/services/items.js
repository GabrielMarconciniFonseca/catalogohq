/**
 * @fileoverview Serviço de gerenciamento de items (HQs) - CRUD completo
 * @module services/items
 */

import apiClient from "./api.js";
import { parseError } from "./utils/errors.js";
import {
  apiRequest,
  buildQuery,
  validateArrayResponse,
} from "./utils/api-helpers.js";
import { validateApiResponse } from "../utils/arrayHelpers.js";

// ============================================================================
// TIPOS E INTERFACES (JSDoc)
// ============================================================================

/**
 * Objeto de Item (HQ)
 * @typedef {Object} Item
 * @property {number} id - ID único do item
 * @property {string} title - Título da HQ
 * @property {string} publisher - Editora
 * @property {string} [series] - Série/coleção
 * @property {number} [issueNumber] - Número da edição
 * @property {string} status - Status atual (lido, lendo, quero_ler, etc)
 * @property {string} [imageUrl] - URL da imagem de capa
 * @property {string[]} [tags] - Tags associadas
 * @property {string} [purchaseDate] - Data de compra (ISO 8601)
 * @property {number} [rating] - Avaliação (0-5)
 * @property {string} [notes] - Notas/observações
 * @property {string} createdAt - Data de criação
 * @property {string} updatedAt - Data de atualização
 */

/**
 * Filtros para busca de items
 * @typedef {Object} ItemFilters
 * @property {string} [term] - Termo de busca (título, série)
 * @property {string} [publisher] - Filtrar por editora
 * @property {string} [series] - Filtrar por série
 * @property {string} [status] - Filtrar por status
 * @property {string[]} [tags] - Filtrar por tags
 */

/**
 * Resultado de operação com estados granulares
 * @typedef {Object} ItemOperationResult
 * @property {Item|Item[]|null} data - Dados retornados
 * @property {import('./utils/errors.js').ApiError|null} error - Erro (se houver)
 * @property {'success'|'error'} status - Status da operação
 * @property {number|null} statusCode - Código HTTP
 * @property {string} message - Mensagem descritiva
 */

// ============================================================================
// BUSCAR ITEMS
// ============================================================================

/**
 * Busca lista de items com filtros opcionais
 * Versão que lança exceção em caso de erro
 *
 * @param {ItemFilters} [filters={}] - Filtros de busca
 * @returns {Promise<Item[]>} Lista de items
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado
 *
 * @example
 * const items = await fetchItems({ publisher: 'Marvel', status: 'lido' });
 */
export async function fetchItems(filters = {}) {
  try {
    const query = buildQuery(filters);
    const response = await apiClient.get(`/items${query}`);

    // Validar que a resposta é um array
    return validateApiResponse(response.data, "fetchItems");
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Busca lista de items com filtros e estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {ItemFilters} [filters={}] - Filtros de busca
 * @returns {Promise<ItemOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await fetchItemsWithState({ term: 'batman' });
 * if (result.status === 'success') {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.message);
 * }
 */
export async function fetchItemsWithState(filters = {}) {
  const result = await apiRequest(() => {
    const query = buildQuery(filters);
    return apiClient.get(`/items${query}`);
  });

  // Validar array mesmo em caso de sucesso
  if (result.status === "success" && result.data) {
    try {
      result.data = validateApiResponse(result.data, "fetchItems");
    } catch (validationError) {
      const { ValidationError } = await import("./utils/errors.js");
      return {
        data: [],
        error: new ValidationError(validationError.message),
        status: "error",
        statusCode: null,
        message: validationError.message,
      };
    }
  }

  return result;
}

// ============================================================================
// BUSCAR WISHLIST
// ============================================================================

/**
 * Busca items marcados como wishlist (quero_ler)
 * Versão que lança exceção em caso de erro
 *
 * @returns {Promise<Item[]>} Lista de items da wishlist
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado
 *
 * @example
 * const wishlist = await fetchWishlist();
 */
export async function fetchWishlist() {
  try {
    const response = await apiClient.get("/items/wishlist");
    return validateApiResponse(response.data, "fetchWishlist");
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Busca wishlist com estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @returns {Promise<ItemOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await fetchWishlistWithState();
 */
export async function fetchWishlistWithState() {
  const result = await apiRequest(() => apiClient.get("/items/wishlist"));

  // Validar array mesmo em caso de sucesso
  if (result.status === "success" && result.data) {
    try {
      result.data = validateApiResponse(result.data, "fetchWishlist");
    } catch (validationError) {
      const { ValidationError } = await import("./utils/errors.js");
      return {
        data: [],
        error: new ValidationError(validationError.message),
        status: "error",
        statusCode: null,
        message: validationError.message,
      };
    }
  }

  return result;
}

// ============================================================================
// BUSCAR ITEM POR ID
// ============================================================================

/**
 * Busca um item específico por ID
 * Versão que lança exceção em caso de erro
 *
 * @param {number|string} id - ID do item
 * @returns {Promise<Item>} Dados completos do item
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado (404 se não encontrado)
 *
 * @example
 * const item = await fetchItemById(123);
 */
export async function fetchItemById(id) {
  try {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Busca item por ID com estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {number|string} id - ID do item
 * @returns {Promise<ItemOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await fetchItemByIdWithState(123);
 */
export async function fetchItemByIdWithState(id) {
  return apiRequest(() => apiClient.get(`/items/${id}`));
}

// ============================================================================
// CRIAR ITEM
// ============================================================================

/**
 * Cria um novo item com upload de imagem
 * Versão que lança exceção em caso de erro
 *
 * @param {FormData} formData - Dados do formulário incluindo arquivo de imagem
 * @returns {Promise<Item>} Item criado com ID gerado
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado (400 para validação)
 *
 * @example
 * const formData = new FormData();
 * formData.append('title', 'Batman #1');
 * formData.append('publisher', 'DC');
 * formData.append('image', fileInput.files[0]);
 * const newItem = await createItem(formData);
 */
export async function createItem(formData) {
  try {
    const response = await apiClient.post("/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Cria item com estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {FormData} formData - Dados do formulário incluindo arquivo de imagem
 * @returns {Promise<ItemOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await createItemWithState(formData);
 */
export async function createItemWithState(formData) {
  return apiRequest(() =>
    apiClient.post("/items", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
}

// ============================================================================
// ATUALIZAR STATUS
// ============================================================================

/**
 * Atualiza apenas o status de um item
 * Versão que lança exceção em caso de erro
 *
 * @param {number|string} id - ID do item
 * @param {string} status - Novo status (lido, lendo, quero_ler, etc)
 * @returns {Promise<Item>} Item atualizado
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado
 *
 * @example
 * const updated = await updateItemStatus(123, 'lido');
 */
export async function updateItemStatus(id, status) {
  try {
    const response = await apiClient.patch(`/items/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Atualiza status com estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {number|string} id - ID do item
 * @param {string} status - Novo status
 * @returns {Promise<ItemOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await updateItemStatusWithState(123, 'lendo');
 */
export async function updateItemStatusWithState(id, status) {
  return apiRequest(() => apiClient.patch(`/items/${id}/status`, { status }));
}

// ============================================================================
// IMPORTAR CSV
// ============================================================================

/**
 * Importa múltiplos items de um arquivo CSV
 * Versão que lança exceção em caso de erro
 *
 * @param {File} file - Arquivo CSV com items
 * @returns {Promise<{imported: number, errors: string[]}>} Resultado da importação
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado
 *
 * @example
 * const result = await importItemsCsv(file);
 * console.log(`${result.imported} items importados`);
 */
export async function importItemsCsv(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/items/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Importa CSV com estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {File} file - Arquivo CSV
 * @returns {Promise<ItemOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await importItemsCsvWithState(file);
 */
export async function importItemsCsvWithState(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest(() =>
    apiClient.post("/items/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
}
