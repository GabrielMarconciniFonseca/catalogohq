/**
 * @fileoverview Classes de erro personalizadas para tratamento de erros da API
 * @module services/utils/errors
 */

// ============================================================================
// CONSTANTES E TIPOS DE ERRO
// ============================================================================

/**
 * Códigos de status HTTP mais comuns
 * @constant
 * @type {Object}
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
 * @constant
 * @type {Object}
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

// ============================================================================
// CLASSES DE ERRO
// ============================================================================

/**
 * Classe base para erros da API
 * @class ApiError
 * @extends Error
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Mensagem de erro
   * @param {string} type - Tipo do erro (ERROR_TYPES)
   * @param {number|null} statusCode - Código HTTP do erro
   * @param {Error|null} originalError - Erro original do axios
   */
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
 * @class NetworkError
 * @extends ApiError
 */
export class NetworkError extends ApiError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Error|null} originalError - Erro original
   */
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
 * @class ValidationError
 * @extends ApiError
 */
export class ValidationError extends ApiError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {number} statusCode - Código HTTP
   * @param {Object|null} errors - Detalhes dos erros de validação
   * @param {Error|null} originalError - Erro original
   */
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
 * @class AuthenticationError
 * @extends ApiError
 */
export class AuthenticationError extends ApiError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Error|null} originalError - Erro original
   */
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
 * @class AuthorizationError
 * @extends ApiError
 */
export class AuthorizationError extends ApiError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Error|null} originalError - Erro original
   */
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
 * @class NotFoundError
 * @extends ApiError
 */
export class NotFoundError extends ApiError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Error|null} originalError - Erro original
   */
  constructor(message = "Recurso não encontrado.", originalError = null) {
    super(message, ERROR_TYPES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, originalError);
    this.name = "NotFoundError";
  }
}

/**
 * Erro do servidor (500, 503)
 * @class ServerError
 * @extends ApiError
 */
export class ServerError extends ApiError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {number} statusCode - Código HTTP
   * @param {Error|null} originalError - Erro original
   */
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
// FUNÇÃO DE PARSING DE ERROS
// ============================================================================

/**
 * Analisa erro do axios e retorna ApiError apropriado
 * @param {Error} error - Erro do axios
 * @returns {ApiError} Erro categorizado
 */
export function parseError(error) {
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
