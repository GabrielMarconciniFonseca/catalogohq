import axios from "axios";
import { validateApiResponse } from "../utils/arrayHelpers.js";

// ============================================================================
// CONSTANTES E TIPOS DE ERRO
// ============================================================================

/**
 * Códigos de status HTTP mais comuns
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Tipos de erro para categorização
 */
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  AUTHENTICATION: "AUTHENTICATION_ERROR",
  AUTHORIZATION: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  SERVER: "SERVER_ERROR",
  TIMEOUT: "TIMEOUT_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

/**
 * Classe base para erros da API
 */
export class ApiError extends Error {
  constructor(message, type, statusCode = null, originalError = null) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Erro de rede (sem conexão, timeout, etc)
 */
export class NetworkError extends ApiError {
  constructor(
    message = "Erro de conexão. Verifique sua internet.",
    originalError = null
  ) {
    super(message, ERROR_TYPES.NETWORK, null, originalError);
    this.name = "NetworkError";
  }
}

/**
 * Erro de validação (400, 422)
 */
export class ValidationError extends ApiError {
  constructor(
    message,
    statusCode = HTTP_STATUS.BAD_REQUEST,
    errors = null,
    originalError = null
  ) {
    super(message, ERROR_TYPES.VALIDATION, statusCode, originalError);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Erro de autenticação (401)
 */
export class AuthenticationError extends ApiError {
  constructor(
    message = "Sessão expirada. Faça login novamente.",
    originalError = null
  ) {
    super(
      message,
      ERROR_TYPES.AUTHENTICATION,
      HTTP_STATUS.UNAUTHORIZED,
      originalError
    );
    this.name = "AuthenticationError";
  }
}

/**
 * Erro de autorização (403)
 */
export class AuthorizationError extends ApiError {
  constructor(
    message = "Você não tem permissão para esta ação.",
    originalError = null
  ) {
    super(
      message,
      ERROR_TYPES.AUTHORIZATION,
      HTTP_STATUS.FORBIDDEN,
      originalError
    );
    this.name = "AuthorizationError";
  }
}

/**
 * Erro de recurso não encontrado (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = "Recurso não encontrado.", originalError = null) {
    super(message, ERROR_TYPES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, originalError);
    this.name = "NotFoundError";
  }
}

/**
 * Erro do servidor (500, 503)
 */
export class ServerError extends ApiError {
  constructor(
    message = "Erro no servidor. Tente novamente mais tarde.",
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    originalError = null
  ) {
    super(message, ERROR_TYPES.SERVER, statusCode, originalError);
    this.name = "ServerError";
  }
}

// ============================================================================
// CONFIGURAÇÃO DO AXIOS
// ============================================================================

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 30000, // 30 segundos
  headers: {
    Accept: "application/json",
  },
});

// ============================================================================
// INTERCEPTORS
// ============================================================================

/**
 * Interceptor de requisição - adiciona logging e headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log para desenvolvimento (pode ser removido em produção)
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("[API] Erro na requisição:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta - trata erros globalmente
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log para desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    // Log de erro
    console.error("[API] Erro na resposta:", error);

    // Retry automático para erros de rede (opcional)
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 0;
    }

    // Retry até 2 vezes em caso de erro de rede
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      if (config.retry < 2) {
        config.retry += 1;
        console.log(`[API] Tentativa ${config.retry} de retry...`);
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// FUNÇÕES DE PARSING E TRATAMENTO DE ERROS
// ============================================================================

/**
 * Analisa erro do axios e retorna ApiError apropriado
 * @param {Error} error - Erro do axios
 * @returns {ApiError} - Erro categorizado
 */
function parseError(error) {
  // Erro de rede (sem resposta do servidor)
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return new NetworkError(
        "Tempo de conexão esgotado. Tente novamente.",
        error
      );
    }
    if (error.message === "Network Error") {
      return new NetworkError(
        "Erro de conexão. Verifique sua internet.",
        error
      );
    }
    return new NetworkError("Não foi possível conectar ao servidor.", error);
  }

  const { status, data } = error.response;
  const message = data?.message || data?.error || error.message;

  // Categorizar por status HTTP
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return new ValidationError(
        message || "Dados inválidos. Verifique os campos.",
        status,
        data?.errors || null,
        error
      );

    case HTTP_STATUS.UNAUTHORIZED:
      return new AuthenticationError(
        message || "Sessão expirada. Faça login novamente.",
        error
      );

    case HTTP_STATUS.FORBIDDEN:
      return new AuthorizationError(
        message || "Você não tem permissão para esta ação.",
        error
      );

    case HTTP_STATUS.NOT_FOUND:
      return new NotFoundError(message || "Recurso não encontrado.", error);

    case HTTP_STATUS.CONFLICT:
      return new ValidationError(
        message || "Conflito de dados. Item já existe.",
        status,
        null,
        error
      );

    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return new ServerError(
        message || "Erro no servidor. Tente novamente mais tarde.",
        status,
        error
      );

    default:
      return new ApiError(
        message || "Erro ao processar requisição.",
        ERROR_TYPES.UNKNOWN,
        status,
        error
      );
  }
}

/**
 * Função wrapper para requisições com estados granulares
 * @param {Function} requestFn - Função que executa a requisição axios
 * @returns {Promise<Object>} - Objeto com { data, error, status, statusCode, message }
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
// AUTENTICAÇÃO
// ============================================================================

/**
 * Define o token de autenticação para todas as requisições
 * @param {string|null} token - Token JWT
 */
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

/**
 * Realiza login (versão legada - mantida para compatibilidade)
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - Dados do usuário e token
 * @throws {ApiError} - Erro categorizado
 */
export async function login(credentials) {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Realiza login com estados granulares
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
 */
export async function loginWithState(credentials) {
  return apiRequest(() => apiClient.post("/auth/login", credentials));
}

/**
 * Registra novo usuário (versão legada - mantida para compatibilidade)
 * @param {Object} payload - Dados do usuário
 * @returns {Promise<Object>} - Dados do usuário criado
 * @throws {ApiError} - Erro categorizado
 */
export async function registerUser(payload) {
  try {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Registra novo usuário com estados granulares
 * @param {Object} payload - Dados do usuário
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
 */
export async function registerUserWithState(payload) {
  return apiRequest(() => apiClient.post("/auth/register", payload));
}

// ============================================================================
// QUERY BUILDER
// ============================================================================

/**
 * Constrói query string a partir de filtros
 * @param {Object} params - Filtros de busca
 * @returns {string} - Query string (?term=value&status=...)
 */
function buildQuery(params) {
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
// ITEMS (HQs)
// ============================================================================

/**
 * Busca items com filtros (versão legada - mantida para compatibilidade)
 * @param {Object} filters - Filtros de busca
 * @returns {Promise<Array>} - Lista de items
 * @throws {ApiError} - Erro categorizado
 */
export async function fetchItems(filters = {}) {
  try {
    const query = buildQuery(filters);
    const response = await apiClient.get(`/items${query}`);

    // Usar helper para validar resposta
    return validateApiResponse(response.data, "fetchItems");
  } catch (error) {
    console.error("Erro ao buscar items:", error);
    throw parseError(error);
  }
}

/**
 * Busca items com filtros e estados granulares
 * @param {Object} filters - Filtros de busca
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
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

/**
 * Busca wishlist (versão legada - mantida para compatibilidade)
 * @returns {Promise<Array>} - Lista de items da wishlist
 * @throws {ApiError} - Erro categorizado
 */
export async function fetchWishlist() {
  try {
    const response = await apiClient.get("/items/wishlist");

    // Usar helper para validar resposta
    return validateApiResponse(response.data, "fetchWishlist");
  } catch (error) {
    console.error("Erro ao buscar wishlist:", error);
    throw parseError(error);
  }
}

/**
 * Busca wishlist com estados granulares
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
 */
export async function fetchWishlistWithState() {
  const result = await apiRequest(() => apiClient.get("/items/wishlist"));

  // Validar array mesmo em caso de sucesso
  if (result.status === "success" && result.data) {
    try {
      result.data = validateApiResponse(result.data, "fetchWishlist");
    } catch (validationError) {
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

/**
 * Busca item por ID (versão legada - mantida para compatibilidade)
 * @param {number|string} id - ID do item
 * @returns {Promise<Object>} - Dados do item
 * @throws {ApiError} - Erro categorizado
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
 * @param {number|string} id - ID do item
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
 */
export async function fetchItemByIdWithState(id) {
  return apiRequest(() => apiClient.get(`/items/${id}`));
}

/**
 * Cria novo item (versão legada - mantida para compatibilidade)
 * @param {FormData} formData - Dados do formulário com imagem
 * @returns {Promise<Object>} - Item criado
 * @throws {ApiError} - Erro categorizado
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
 * Cria novo item com estados granulares
 * @param {FormData} formData - Dados do formulário com imagem
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
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

/**
 * Atualiza status do item (versão legada - mantida para compatibilidade)
 * @param {number|string} id - ID do item
 * @param {string} status - Novo status
 * @returns {Promise<Object>} - Item atualizado
 * @throws {ApiError} - Erro categorizado
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
 * Atualiza status do item com estados granulares
 * @param {number|string} id - ID do item
 * @param {string} status - Novo status
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
 */
export async function updateItemStatusWithState(id, status) {
  return apiRequest(() => apiClient.patch(`/items/${id}/status`, { status }));
}

/**
 * Importa items de CSV (versão legada - mantida para compatibilidade)
 * @param {File} file - Arquivo CSV
 * @returns {Promise<Object>} - Resultado da importação
 * @throws {ApiError} - Erro categorizado
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
 * Importa items de CSV com estados granulares
 * @param {File} file - Arquivo CSV
 * @returns {Promise<Object>} - { data, error, status, statusCode, message }
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

export default apiClient;
