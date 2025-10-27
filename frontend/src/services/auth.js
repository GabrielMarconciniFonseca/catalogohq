/**
 * @fileoverview Serviço de autenticação - Login, registro e gerenciamento de sessão
 * @module services/auth
 */

import apiClient, { setAuthToken } from "./api.js";
import { parseError } from "./utils/errors.js";
import { apiRequest } from "./utils/api-helpers.js";

// ============================================================================
// TIPOS E INTERFACES (JSDoc)
// ============================================================================

/**
 * Credenciais de login
 * @typedef {Object} LoginCredentials
 * @property {string} email - Email do usuário
 * @property {string} password - Senha do usuário
 */

/**
 * Dados de registro de usuário
 * @typedef {Object} RegisterData
 * @property {string} name - Nome completo
 * @property {string} email - Email (único)
 * @property {string} password - Senha (mínimo 6 caracteres)
 * @property {string} [passwordConfirm] - Confirmação de senha
 */

/**
 * Dados do usuário autenticado
 * @typedef {Object} User
 * @property {number} id - ID único do usuário
 * @property {string} name - Nome completo
 * @property {string} email - Email
 * @property {string} [avatarUrl] - URL do avatar
 * @property {string} createdAt - Data de criação
 */

/**
 * Resposta de autenticação
 * @typedef {Object} AuthResponse
 * @property {User} user - Dados do usuário
 * @property {string} token - Token JWT
 * @property {number} [expiresIn] - Tempo de expiração em segundos
 */

/**
 * Resultado de operação de autenticação
 * @typedef {Object} AuthOperationResult
 * @property {AuthResponse|null} data - Dados retornados
 * @property {import('./utils/errors.js').ApiError|null} error - Erro (se houver)
 * @property {'success'|'error'} status - Status da operação
 * @property {number|null} statusCode - Código HTTP
 * @property {string} message - Mensagem descritiva
 */

// ============================================================================
// LOGIN
// ============================================================================

/**
 * Realiza login com email e senha
 * Versão que lança exceção em caso de erro
 *
 * @param {LoginCredentials} credentials - Email e senha
 * @returns {Promise<AuthResponse>} Dados do usuário e token JWT
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado (401 para credenciais inválidas)
 *
 * @example
 * try {
 *   const { user, token } = await login({
 *     email: 'usuario@example.com',
 *     password: 'senha123'
 *   });
 *   setAuthToken(token); // Configurar token para próximas requisições
 *   console.log('Bem-vindo', user.name);
 * } catch (error) {
 *   if (error.name === 'AuthenticationError') {
 *     console.error('Credenciais inválidas');
 *   }
 * }
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
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {LoginCredentials} credentials - Email e senha
 * @returns {Promise<AuthOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await loginWithState({
 *   email: 'usuario@example.com',
 *   password: 'senha123'
 * });
 *
 * if (result.status === 'success') {
 *   setAuthToken(result.data.token);
 *   console.log('Login realizado:', result.data.user.name);
 * } else {
 *   console.error('Erro no login:', result.message);
 * }
 */
export async function loginWithState(credentials) {
  return apiRequest(() => apiClient.post("/auth/login", credentials));
}

// ============================================================================
// REGISTRO
// ============================================================================

/**
 * Registra novo usuário no sistema
 * Versão que lança exceção em caso de erro
 *
 * @param {RegisterData} payload - Dados do novo usuário
 * @returns {Promise<AuthResponse>} Usuário criado e token JWT
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado (400 para validação, 409 para email duplicado)
 *
 * @example
 * try {
 *   const { user, token } = await registerUser({
 *     name: 'João Silva',
 *     email: 'joao@example.com',
 *     password: 'senha123',
 *   });
 *   setAuthToken(token);
 *   console.log('Conta criada:', user.name);
 * } catch (error) {
 *   if (error.name === 'ValidationError') {
 *     console.error('Dados inválidos:', error.errors);
 *   }
 * }
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
 * Registra usuário com estados granulares
 * Versão que retorna objeto com status e não lança exceção
 *
 * @param {RegisterData} payload - Dados do novo usuário
 * @returns {Promise<AuthOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await registerUserWithState({
 *   name: 'João Silva',
 *   email: 'joao@example.com',
 *   password: 'senha123',
 * });
 *
 * if (result.status === 'success') {
 *   setAuthToken(result.data.token);
 * } else if (result.statusCode === 409) {
 *   console.error('Email já cadastrado');
 * }
 */
export async function registerUserWithState(payload) {
  return apiRequest(() => apiClient.post("/auth/register", payload));
}

// ============================================================================
// LOGOUT
// ============================================================================

/**
 * Realiza logout removendo o token de autenticação
 * Esta função é local (não faz chamada ao backend)
 *
 * @returns {void}
 *
 * @example
 * logout();
 * // Redirecionar para página de login
 * window.location.href = '/login';
 */
export function logout() {
  setAuthToken(null);
  // Pode adicionar lógica adicional aqui:
  // - Limpar localStorage
  // - Limpar sessionStorage
  // - Redirecionar para login
}

// ============================================================================
// VALIDAÇÃO DE TOKEN
// ============================================================================

/**
 * Verifica se o usuário está autenticado (possui token válido)
 * Faz chamada ao endpoint /auth/me para validar token
 *
 * @returns {Promise<User>} Dados do usuário autenticado
 * @throws {import('./utils/errors.js').ApiError} Erro 401 se token inválido
 *
 * @example
 * try {
 *   const user = await validateToken();
 *   console.log('Usuário autenticado:', user.name);
 * } catch (error) {
 *   console.error('Token inválido, fazer login novamente');
 * }
 */
export async function validateToken() {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Valida token com estados granulares
 *
 * @returns {Promise<AuthOperationResult>} Objeto com data, error, status, etc
 *
 * @example
 * const result = await validateTokenWithState();
 * if (result.status === 'success') {
 *   console.log('Token válido:', result.data.name);
 * } else {
 *   logout();
 * }
 */
export async function validateTokenWithState() {
  return apiRequest(() => apiClient.get("/auth/me"));
}

// ============================================================================
// RECUPERAÇÃO DE SENHA
// ============================================================================

/**
 * Solicita recuperação de senha (envia email com link)
 *
 * @param {string} email - Email para recuperação
 * @returns {Promise<{message: string}>} Mensagem de confirmação
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado
 *
 * @example
 * await requestPasswordReset('usuario@example.com');
 */
export async function requestPasswordReset(email) {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Solicita recuperação de senha com estados granulares
 *
 * @param {string} email - Email para recuperação
 * @returns {Promise<AuthOperationResult>} Objeto com data, error, status, etc
 */
export async function requestPasswordResetWithState(email) {
  return apiRequest(() => apiClient.post("/auth/forgot-password", { email }));
}

/**
 * Redefine senha usando token recebido por email
 *
 * @param {string} token - Token de recuperação
 * @param {string} newPassword - Nova senha
 * @returns {Promise<{message: string}>} Mensagem de confirmação
 * @throws {import('./utils/errors.js').ApiError} Erro categorizado
 *
 * @example
 * await resetPassword('token-do-email', 'novaSenha123');
 */
export async function resetPassword(token, newPassword) {
  try {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Redefine senha com estados granulares
 *
 * @param {string} token - Token de recuperação
 * @param {string} newPassword - Nova senha
 * @returns {Promise<AuthOperationResult>} Objeto com data, error, status, etc
 */
export async function resetPasswordWithState(token, newPassword) {
  return apiRequest(() =>
    apiClient.post("/auth/reset-password", {
      token,
      password: newPassword,
    })
  );
}

// ============================================================================
// EXPORTAÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Re-exportar setAuthToken para facilitar imports
 */
export { setAuthToken };
