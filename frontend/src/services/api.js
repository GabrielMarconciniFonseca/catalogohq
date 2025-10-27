/**
 * @fileoverview Configuração base do cliente HTTP (axios) e utilitários de URL
 * @module services/api
 */

import axios from "axios";

// ============================================================================
// CONFIGURAÇÃO DE URLs
// ============================================================================

/**
 * URL base padrão da API
 * @constant
 * @type {string}
 */
const DEFAULT_API_BASE_URL = "http://localhost:8080/api";

/**
 * URL base da API (pode ser sobrescrita por variável de ambiente)
 * @constant
 * @type {string}
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

/**
 * Origem da API (protocolo + domínio + porta)
 * Extraído da URL base para construção de URLs de assets
 * @constant
 * @type {string}
 */
export const API_ORIGIN = (() => {
  try {
    const parsed = new URL(API_BASE_URL);
    return parsed.origin;
  } catch {
    try {
      const fallbackBase = new URL(DEFAULT_API_BASE_URL);
      const parsed = new URL(API_BASE_URL, fallbackBase);
      return parsed.origin;
    } catch {
      return API_BASE_URL.replace(/\/api\/?$/, "");
    }
  }
})();

/**
 * Constrói URL completa para assets do backend
 *
 * @param {string} path - Caminho do asset (pode ser relativo ou absoluto)
 * @returns {string|null} URL completa ou null se path for inválido
 *
 * @example
 * const imageUrl = buildAssetUrl('/uploads/image.jpg');
 * // Retorna: "http://localhost:8080/uploads/image.jpg"
 *
 * @example
 * const externalUrl = buildAssetUrl('https://example.com/image.jpg');
 * // Retorna: "https://example.com/image.jpg"
 */
export function buildAssetUrl(path) {
  if (!path) {
    return null;
  }

  // Se já for URL completa, retornar como está
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Normalizar path para começar com /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
}

// ============================================================================
// CONFIGURAÇÃO DO CLIENTE AXIOS
// ============================================================================

/**
 * Cliente HTTP baseado em axios com configuração padrão
 * - baseURL: API_BASE_URL
 * - timeout: 30 segundos
 * - headers: Accept application/json
 *
 * @constant
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    Accept: "application/json",
  },
});

// ============================================================================
// INTERCEPTORS
// ============================================================================

/**
 * Interceptor de requisição
 * Pode ser usado para adicionar headers, logs, etc
 */
apiClient.interceptors.request.use(
  (config) => {
    // Adicionar lógica de interceptação aqui (ex: logs, timestamps)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta
 * Implementa retry automático para erros de rede
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;

    // Inicializar contador de retry se não existir
    if (!config || !config.retry) {
      config.retry = 0;
    }

    // Retry até 2 vezes em caso de erro de rede
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      if (config.retry < 2) {
        config.retry += 1;
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

/**
 * Define o token de autenticação para todas as requisições futuras
 *
 * @param {string|null} token - Token JWT (ou null para remover)
 *
 * @example
 * // Adicionar token
 * setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *
 * @example
 * // Remover token
 * setAuthToken(null);
 */
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export default apiClient;
