# Hook useItemStatus - Guia de Uso

## Visão Geral

O hook `useItemStatus` orquestra a atualização de status de items (HQs) e o feedback ao usuário. Ele encapsula toda a lógica de chamada à API, tratamento de erros e estados de loading.

## API do Hook

```javascript
const { updateStatus, feedback, clearFeedback, isLoading } = useItemStatus();
```

### Retorno

- **updateStatus**: `(itemId, newStatus) => Promise<boolean>`

  - Função assíncrona para atualizar o status de um item
  - Retorna `true` em caso de sucesso, `false` em caso de erro
  - Parâmetros:
    - `itemId`: ID do item (number ou string)
    - `newStatus`: Novo status (OWNED, READING, WISHLIST, COMPLETED)

- **feedback**: `{ state: string, message: string }`

  - Objeto com o estado atual do feedback
  - `state`: 'idle' | 'loading' | 'success' | 'error'
  - `message`: Mensagem descritiva do estado

- **clearFeedback**: `() => void`

  - Função para limpar o feedback manualmente
  - Útil quando o feedback precisa ser resetado antes dos 3 segundos automáticos

- **isLoading**: `boolean`
  - Indica se há uma operação de atualização em andamento
  - Útil para desabilitar botões durante o carregamento

## Exemplos de Uso

### 1. Uso Básico

```jsx
import { useItemStatus } from "../../hooks/useItemStatus";
import { COMIC_STATUS } from "../../constants/comicStatus";
import Feedback from "../Feedback";

function MyComponent({ itemId }) {
  const { updateStatus, feedback, isLoading } = useItemStatus();

  const handleMoveToWishlist = async () => {
    const success = await updateStatus(itemId, COMIC_STATUS.WISHLIST);

    if (success) {
      console.log("Item movido para wishlist!");
      // Atualizar UI local ou refetch de dados
    }
  };

  return (
    <div>
      <button onClick={handleMoveToWishlist} disabled={isLoading}>
        Adicionar à Wishlist
      </button>

      {feedback.state !== "idle" && <Feedback status={feedback} />}
    </div>
  );
}
```

### 2. Menu de Seleção de Status

```jsx
import { useItemStatus } from "../../hooks/useItemStatus";
import { COMIC_STATUS, STATUS_CONFIG } from "../../constants/comicStatus";

function StatusSelector({ itemId, currentStatus, onStatusChanged }) {
  const { updateStatus, isLoading } = useItemStatus();

  const handleStatusChange = async (newStatus) => {
    const success = await updateStatus(itemId, newStatus);

    if (success && onStatusChanged) {
      onStatusChanged(itemId, newStatus);
    }
  };

  return (
    <div className="status-selector">
      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
        <button
          key={status}
          onClick={() => handleStatusChange(status)}
          disabled={isLoading || status === currentStatus}
          style={{ backgroundColor: config.backgroundColor }}
        >
          {config.label}
        </button>
      ))}
    </div>
  );
}
```

### 3. Integração com Context Menu

```jsx
import { useItemStatus } from "../../hooks/useItemStatus";
import { COMIC_STATUS } from "../../constants/comicStatus";

function ComicCardContextMenu({ item, onClose }) {
  const { updateStatus, feedback, isLoading } = useItemStatus();

  const markAsReading = async () => {
    const success = await updateStatus(item.id, COMIC_STATUS.READING);

    if (success) {
      setTimeout(() => {
        onClose();
        // Refetch ou atualizar estado global
      }, 1500);
    }
  };

  const markAsCompleted = async () => {
    const success = await updateStatus(item.id, COMIC_STATUS.COMPLETED);

    if (success) {
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div className="context-menu">
      <button onClick={markAsReading} disabled={isLoading}>
        📖 Marcar como Lendo
      </button>
      <button onClick={markAsCompleted} disabled={isLoading}>
        ✅ Marcar como Completo
      </button>

      {feedback.state === "error" && (
        <div className="error">{feedback.message}</div>
      )}
    </div>
  );
}
```

### 4. Uso com Estado Global (Context)

```jsx
import { useItemStatus } from "../../hooks/useItemStatus";
import { useItems } from "../../context/ItemsContext";

function ItemCard({ item }) {
  const { updateStatus, feedback, isLoading } = useItemStatus();
  const { refreshItems } = useItems();

  const handleStatusUpdate = async (newStatus) => {
    const success = await updateStatus(item.id, newStatus);

    if (success) {
      // Atualizar contexto global após sucesso
      await refreshItems();
    }
  };

  return (
    <div>
      {/* ... card content ... */}
      <select
        value={item.status}
        onChange={(e) => handleStatusUpdate(e.target.value)}
        disabled={isLoading}
      >
        <option value="OWNED">Na Coleção</option>
        <option value="READING">Lendo</option>
        <option value="WISHLIST">Wishlist</option>
        <option value="COMPLETED">Completo</option>
      </select>

      {feedback.state !== "idle" && (
        <span className={`feedback ${feedback.state}`}>{feedback.message}</span>
      )}
    </div>
  );
}
```

### 5. Limpeza Manual de Feedback

```jsx
import { useItemStatus } from "../../hooks/useItemStatus";
import { useEffect } from "react";

function MyComponent({ itemId, visible }) {
  const { updateStatus, feedback, clearFeedback } = useItemStatus();

  // Limpar feedback quando componente ficar invisível
  useEffect(() => {
    if (!visible) {
      clearFeedback();
    }
  }, [visible, clearFeedback]);

  const handleUpdate = async () => {
    await updateStatus(itemId, "READING");
  };

  return (
    <div>
      <button onClick={handleUpdate}>Atualizar</button>
      {feedback.message && <p>{feedback.message}</p>}
    </div>
  );
}
```

## Tratamento de Erros

O hook já trata automaticamente os seguintes casos de erro:

1. **Item ID faltando**: Retorna mensagem "ID do item é obrigatório"
2. **Status faltando**: Retorna mensagem "Status é obrigatório"
3. **Erro na API**: Exibe a mensagem de erro retornada pela API
4. **Erro genérico**: Exibe "Erro ao atualizar status. Tente novamente."

## Feedback Automático

- **Success**: O feedback de sucesso é automaticamente limpo após 3 segundos
- **Error**: O feedback de erro permanece até ser limpo manualmente ou até uma nova operação
- **Loading**: O estado de loading é automaticamente gerenciado durante a operação

## Integração com Componente Feedback

O hook é projetado para funcionar perfeitamente com o componente `Feedback`:

```jsx
import Feedback from "../Feedback";
import { useItemStatus } from "../../hooks/useItemStatus";

function MyComponent() {
  const { updateStatus, feedback } = useItemStatus();

  return (
    <div>
      {/* ... seu código ... */}

      {feedback.state !== "idle" && <Feedback status={feedback} />}
    </div>
  );
}
```

## Status Válidos

Importe as constantes de `src/constants/comicStatus.js`:

```javascript
import { COMIC_STATUS } from "../../constants/comicStatus";

// Valores válidos:
COMIC_STATUS.OWNED; // "OWNED" - Na Coleção
COMIC_STATUS.READING; // "READING" - Lendo
COMIC_STATUS.WISHLIST; // "WISHLIST" - Lista de Desejos
COMIC_STATUS.COMPLETED; // "COMPLETED" - Completo
```

## Boas Práticas

1. **Sempre verificar o retorno**: Use o booleano retornado para decidir ações subsequentes
2. **Desabilitar UI durante loading**: Use `isLoading` para desabilitar botões/inputs
3. **Atualizar dados após sucesso**: Refetch ou atualize o estado local após sucesso
4. **Feedback visível**: Sempre mostre o feedback ao usuário
5. **Limpar quando necessário**: Use `clearFeedback` ao desmontar ou esconder componentes

## Componente de Exemplo Completo

Veja `src/components/ItemStatusMenu/index.jsx` para um exemplo completo de implementação.

## Testes

```javascript
import { renderHook, act } from "@testing-library/react";
import { useItemStatus } from "./useItemStatus";
import * as api from "../services/api";

jest.mock("../services/api");

describe("useItemStatus", () => {
  it("should update status successfully", async () => {
    api.updateItemStatus.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useItemStatus());

    let success;
    await act(async () => {
      success = await result.current.updateStatus(1, "READING");
    });

    expect(success).toBe(true);
    expect(result.current.feedback.state).toBe("success");
  });

  it("should handle errors", async () => {
    api.updateItemStatus.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useItemStatus());

    let success;
    await act(async () => {
      success = await result.current.updateStatus(1, "READING");
    });

    expect(success).toBe(false);
    expect(result.current.feedback.state).toBe("error");
  });
});
```

## Próximos Passos

- [ ] Adicionar suporte para undo/redo
- [ ] Implementar otimistic updates
- [ ] Adicionar analytics tracking
- [ ] Implementar rate limiting
