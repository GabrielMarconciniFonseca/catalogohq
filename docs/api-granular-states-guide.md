# Guia de Estados Granulares da API

Este documento explica como usar o sistema de estados granulares implementado em `services/api.js`.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Classes de Erro](#classes-de-erro)
- [Constantes HTTP](#constantes-http)
- [Função Wrapper apiRequest](#função-wrapper-apirequest)
- [API com Estados Granulares](#api-com-estados-granulares)
- [Exemplos Práticos](#exemplos-práticos)
- [Interceptors](#interceptors)
- [Migração Gradual](#migração-gradual)

---

## Visão Geral

O sistema de estados granulares permite que componentes reajam de forma mais precisa a diferentes tipos de erros e estados de carregamento. Em vez de apenas capturar exceções, você recebe um objeto estruturado com informações detalhadas.

### Benefícios:

- ✅ **Erros categorizados** - NetworkError, ValidationError, AuthenticationError, etc.
- ✅ **Estados explícitos** - { data, error, status, statusCode, message }
- ✅ **Retry automático** - Para erros temporários de rede
- ✅ **Logging integrado** - Facilita debugging
- ✅ **Retrocompatibilidade** - Funções antigas mantidas

---

## Classes de Erro

### Hierarquia:

```
ApiError (classe base)
├── NetworkError (sem conexão, timeout)
├── ValidationError (400, 422)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
└── ServerError (500, 503)
```

### Propriedades de ApiError:

```javascript
{
  name: string,        // Nome da classe de erro
  message: string,     // Mensagem descritiva
  type: string,        // ERROR_TYPES.NETWORK, VALIDATION, etc.
  statusCode: number,  // Código HTTP (se aplicável)
  originalError: Error, // Erro original do axios
  timestamp: string    // ISO timestamp
}
```

### Tipos de Erro (ERROR_TYPES):

```javascript
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR", // Sem conexão
  VALIDATION: "VALIDATION_ERROR", // Dados inválidos
  AUTHENTICATION: "AUTHENTICATION_ERROR", // Login necessário
  AUTHORIZATION: "AUTHORIZATION_ERROR", // Sem permissão
  NOT_FOUND: "NOT_FOUND_ERROR", // Recurso não existe
  SERVER: "SERVER_ERROR", // Erro no servidor
  TIMEOUT: "TIMEOUT_ERROR", // Tempo esgotado
  UNKNOWN: "UNKNOWN_ERROR", // Erro desconhecido
};
```

---

## Constantes HTTP

```javascript
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
```

**Uso:**

```javascript
if (result.statusCode === HTTP_STATUS.UNAUTHORIZED) {
  // Redirecionar para login
}
```

---

## Função Wrapper apiRequest

A função `apiRequest` encapsula chamadas axios e retorna objeto padronizado.

### Assinatura:

```javascript
async function apiRequest(requestFn: () => Promise) => Promise<{
  data: any,           // Dados da resposta (null em caso de erro)
  error: ApiError,     // Erro categorizado (null em caso de sucesso)
  status: string,      // "success" ou "error"
  statusCode: number,  // Código HTTP
  message: string      // Mensagem descritiva
}>
```

### Exemplo:

```javascript
const result = await apiRequest(() => apiClient.get("/items"));

if (result.status === "success") {
  console.log("Items:", result.data);
} else {
  console.error("Erro:", result.error.type, result.message);
}
```

---

## API com Estados Granulares

Todas as funções da API agora possuem duas versões:

1. **Versão legada** (mantida para compatibilidade) - lança exceções
2. **Versão com estados** (sufixo `WithState`) - retorna objeto estruturado

### Funções Disponíveis:

| Função Legada             | Função com Estados                | Descrição                     |
| ------------------------- | --------------------------------- | ----------------------------- |
| `login(credentials)`      | `loginWithState(credentials)`     | Login de usuário              |
| `registerUser(payload)`   | `registerUserWithState(payload)`  | Registro de usuário           |
| `fetchItems(filters)`     | `fetchItemsWithState(filters)`    | Buscar items com filtros      |
| `fetchWishlist()`         | `fetchWishlistWithState()`        | Buscar wishlist               |
| `fetchItemById(id)`       | `fetchItemByIdWithState(id)`      | Buscar item por ID            |
| `createItem(formData)`    | `createItemWithState(formData)`   | Criar novo item               |
| `updateItemStatus(id, s)` | `updateItemStatusWithState(id,s)` | Atualizar status do item      |
| `importItemsCsv(file)`    | `importItemsCsvWithState(file)`   | Importar items de arquivo CSV |

---

## Exemplos Práticos

### 1. Buscar Items com Tratamento de Erro Granular

```jsx
import { fetchItemsWithState, ERROR_TYPES } from "../services/api";

function ItemListComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const loadItems = async (filters) => {
    setLoading(true);
    setErrorState(null);

    const result = await fetchItemsWithState(filters);

    setLoading(false);

    if (result.status === "success") {
      setItems(result.data);
    } else {
      // Tratamento específico por tipo de erro
      switch (result.error.type) {
        case ERROR_TYPES.NETWORK:
          setErrorState({
            message: "Sem conexão. Verifique sua internet.",
            canRetry: true,
          });
          break;

        case ERROR_TYPES.AUTHENTICATION:
          setErrorState({
            message: "Sessão expirada. Faça login novamente.",
            shouldRedirect: "/login",
          });
          break;

        case ERROR_TYPES.SERVER:
          setErrorState({
            message: "Servidor temporariamente indisponível.",
            canRetry: true,
          });
          break;

        default:
          setErrorState({
            message: result.message,
            canRetry: false,
          });
      }
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {errorState && (
        <ErrorBanner
          message={errorState.message}
          onRetry={errorState.canRetry ? () => loadItems() : null}
        />
      )}
      <ItemGrid items={items} />
    </div>
  );
}
```

### 2. Login com Feedback Específico

```jsx
import { loginWithState, ERROR_TYPES, HTTP_STATUS } from "../services/api";

function LoginForm() {
  const [feedback, setFeedback] = useState(null);

  const handleLogin = async (email, password) => {
    const result = await loginWithState({ email, password });

    if (result.status === "success") {
      setFeedback({ type: "success", message: "Login realizado!" });
      // Salvar token e redirecionar
      localStorage.setItem("token", result.data.token);
      navigate("/catalog");
    } else {
      // Feedback específico por tipo de erro
      if (result.error.type === ERROR_TYPES.VALIDATION) {
        if (result.statusCode === HTTP_STATUS.UNAUTHORIZED) {
          setFeedback({
            type: "error",
            message: "Email ou senha incorretos.",
          });
        } else {
          setFeedback({
            type: "error",
            message: "Verifique os campos do formulário.",
          });
        }
      } else if (result.error.type === ERROR_TYPES.NETWORK) {
        setFeedback({
          type: "error",
          message: "Erro de conexão. Tente novamente.",
        });
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    }
  };

  return (
    <form>
      {feedback && <Feedback {...feedback} />}
      {/* ... campos do formulário ... */}
    </form>
  );
}
```

### 3. Criar Item com Validação de Erros

```jsx
import {
  createItemWithState,
  ERROR_TYPES,
  ValidationError,
} from "../services/api";

function ItemFormComponent() {
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (formData) => {
    setFieldErrors({});

    const result = await createItemWithState(formData);

    if (result.status === "success") {
      toast.success("HQ adicionada com sucesso!");
      navigate(`/items/${result.data.id}`);
    } else {
      // ValidationError contém propriedade 'errors' com detalhes por campo
      if (result.error instanceof ValidationError && result.error.errors) {
        setFieldErrors(result.error.errors);
        // Exemplo: { title: "Título é obrigatório", publisher: "Publisher inválido" }
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <form>
      <Input name="title" error={fieldErrors.title} />
      <Input name="publisher" error={fieldErrors.publisher} />
      {/* ... */}
    </form>
  );
}
```

### 4. Hook Customizado com Estados Granulares

```jsx
import { useState, useCallback } from "react";
import { fetchItemsWithState, ERROR_TYPES } from "../services/api";

function useItems(initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canRetry, setCanRetry] = useState(false);

  const fetchItems = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    setError(null);
    setCanRetry(false);

    const result = await fetchItemsWithState(filters);

    setLoading(false);

    if (result.status === "success") {
      setItems(result.data);
      return true;
    } else {
      setError({
        message: result.message,
        type: result.error.type,
      });

      // Definir se pode tentar novamente
      setCanRetry(
        result.error.type === ERROR_TYPES.NETWORK ||
          result.error.type === ERROR_TYPES.SERVER
      );

      return false;
    }
  }, []);

  const retry = useCallback(() => {
    if (canRetry) {
      fetchItems();
    }
  }, [canRetry, fetchItems]);

  return {
    items,
    loading,
    error,
    canRetry,
    fetchItems,
    retry,
  };
}

// Uso:
function ItemListPage() {
  const { items, loading, error, canRetry, fetchItems, retry } = useItems();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage message={error.message} onRetry={canRetry ? retry : null} />
    );

  return <ItemGrid items={items} />;
}
```

### 5. Atualizar Status com Feedback

```jsx
import { updateItemStatusWithState } from "../services/api";
import { useItemStatus } from "../hooks/useItemStatus";

function StatusMenu({ itemId, currentStatus }) {
  // Hook useItemStatus já usa updateItemStatusWithState internamente!
  const { updateStatus, feedback, isLoading } = useItemStatus();

  const handleStatusChange = async (newStatus) => {
    const success = await updateStatus(itemId, newStatus);

    if (success) {
      // Refetch items ou atualizar cache
      queryClient.invalidateQueries(["items"]);
    }
    // Feedback automático já gerenciado pelo hook
  };

  return (
    <div>
      {feedback.state !== "idle" && <Feedback status={feedback} />}
      <button
        onClick={() => handleStatusChange("READING")}
        disabled={isLoading}
      >
        Marcar como Lendo
      </button>
    </div>
  );
}
```

---

## Interceptors

### Request Interceptor

- Adiciona logging em desenvolvimento
- Pode adicionar headers customizados globalmente

### Response Interceptor

- Log de respostas bem-sucedidas
- **Retry automático** para erros de rede (até 2 tentativas)
- Tratamento global de erros

**Configuração de Retry:**

```javascript
// Em api.js - já configurado
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry até 2 vezes em erros de rede
    if (
      (error.code === "ECONNABORTED" || error.message === "Network Error") &&
      config.retry < 2
    ) {
      config.retry += 1;
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);
```

---

## Migração Gradual

### Estratégia Recomendada:

1. **Manter funções legadas** - Não quebre código existente
2. **Migrar componentes novos** - Use `*WithState` em código novo
3. **Refatorar gradualmente** - Atualize componentes críticos primeiro
4. **Testar extensivamente** - Valide comportamento antes de remover código antigo

### Exemplo de Migração:

**Antes (versão legada):**

```jsx
try {
  const items = await fetchItems(filters);
  setItems(items);
} catch (error) {
  console.error("Erro:", error.message);
  setError(error.message);
}
```

**Depois (versão com estados):**

```jsx
const result = await fetchItemsWithState(filters);

if (result.status === "success") {
  setItems(result.data);
} else {
  console.error("Erro:", result.error.type, result.message);
  setError({
    message: result.message,
    type: result.error.type,
    canRetry: result.error.type === ERROR_TYPES.NETWORK,
  });
}
```

### Componentes Prioritários para Migração:

1. **ItemList** - Componente crítico com muitas requisições
2. **ItemForm** - Validação de erros por campo
3. **AuthPanel** - Feedback específico de autenticação
4. **ImportCsvForm** - Erros de validação de arquivo

---

## Boas Práticas

### ✅ DOs:

- Use `*WithState` para novos componentes
- Trate erros de forma específica (switch no error.type)
- Exiba opção de retry para NetworkError e ServerError
- Redirecione para login em AuthenticationError
- Valide campos específicos em ValidationError.errors
- Use constantes HTTP_STATUS e ERROR_TYPES

### ❌ DON'Ts:

- Não capture erro genérico sem verificar tipo
- Não ignore statusCode para decisões de UI
- Não mostre mensagens técnicas ao usuário
- Não remova funções legadas até migração completa
- Não faça retry infinito (limite a 2-3 tentativas)

---

## Próximos Passos

- [ ] Migrar componente `ItemList` para usar `fetchItemsWithState`
- [ ] Atualizar `useItemStatus` para usar `updateItemStatusWithState`
- [ ] Criar componentes de erro reutilizáveis (ErrorBanner, ErrorModal)
- [ ] Adicionar testes unitários para classes de erro
- [ ] Implementar sistema de cache com React Query
- [ ] Adicionar telemetria/analytics para erros

---

## Referências

- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Error Handling Best Practices](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)
- [React Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)

---

**Autor**: GitHub Copilot  
**Data**: 24 de outubro de 2025  
**Versão**: 1.0.0
