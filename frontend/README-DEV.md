# README de Desenvolvimento - Frontend

## Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar diferentes aspectos da aplicação em diferentes ambientes (desenvolvimento e produção).

### Arquivos de Configuração

- **`.env.example`**: Template com todas as variáveis disponíveis
- **`.env.development`**: Configurações para ambiente de desenvolvimento (usado com `npm run dev`)
- **`.env.production`**: Configurações para ambiente de produção (usado com `npm run build`)

### Variáveis Disponíveis

#### `VITE_API_BASE_URL`

URL base da API backend (Spring Boot).

- **Desenvolvimento**: `http://localhost:8080/api`
- **Produção**: URL da sua API em produção (ex: `https://api.seudominio.com/api`)

#### `VITE_GOOGLE_AUTH_URL`

URL para autenticação OAuth com Google.

- **Padrão**: `/api/auth/google`
- Modifique se sua rota de autenticação for diferente

### Como Usar

1. Copie o arquivo `.env.example` para criar seus ambientes:

   ```bash
   # Para desenvolvimento
   cp .env.example .env.development

   # Para produção
   cp .env.example .env.production
   ```

2. Edite os arquivos com os valores apropriados para cada ambiente

3. As variáveis são acessadas no código usando `import.meta.env`:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_BASE_URL;
   ```

### Importante

- Todas as variáveis de ambiente devem começar com `VITE_` para serem expostas ao código frontend
- Não commite arquivos `.env.development` ou `.env.production` com dados sensíveis
- O arquivo `.env.example` serve apenas como documentação

---

## Estrutura de Estados e Mocks

Este documento descreve os estados iniciais e estruturas de dados mock utilizados no desenvolvimento do frontend.

### Estados Iniciais Seguros

Os estados iniciais são definidos em `src/utils/arrayHelpers.js` para garantir que o aplicativo sempre trabalhe com estruturas de dados válidas:

```javascript
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
};
```

#### Descrição dos Estados:

- **`items`**: Array de itens (HQs) carregados da API ou mock
- **`filters`**: Objeto contendo todos os filtros ativos
  - `term`: Termo de busca (string)
  - `publisher`: Editora selecionada (string, default: "todos")
  - `series`: Série selecionada (string, default: "todas")
  - `status`: Status de leitura (string, default: "todos")
  - `tags`: Tags separadas por vírgula (string)
- **`status`**: Estado da aplicação
  - `state`: Estado atual ("idle", "loading", "success", "error")
  - `message`: Mensagem de feedback para o usuário
- **`categories`**: Array de categorias com contadores

### Estrutura de Dados Mock

#### Item (HQ)

```javascript
const mockItem = {
  id: 1,
  title: "Watchmen",
  publisher: "DC Comics",
  series: "Watchmen",
  status: "COMPLETED", // OWNED | WISHLIST | READING | COMPLETED
  releaseYear: 1986,
  authors: ["Alan Moore", "Dave Gibbons"],
  tags: ["super-herói", "graphic novel", "clássico"],
  rating: 5,
  coverImageUrl: "https://example.com/cover.jpg",
  notes: "Uma das melhores graphic novels de todos os tempos",
};
```

#### Categoria

```javascript
const mockCategory = {
  id: "todos", // todos | OWNED | WISHLIST | READING | COMPLETED
  label: "Todas",
  count: 150,
  icon: "./assets/figma/todas.svg",
};
```

### Categorias Padrão (CategoryFilter)

O componente `CategoryFilter` utiliza as seguintes categorias por padrão:

```javascript
const defaultCategories = [
  { id: "todos", label: "Todas", count: 0, icon: todasIcon },
  { id: "OWNED", label: "Coleção", count: 0, icon: colecaoIcon },
  { id: "WISHLIST", label: "Wishlist", count: 0, icon: wishlistIcon },
  { id: "READING", label: "Lendo", count: 0, icon: lendoIcon },
  { id: "COMPLETED", label: "Completos", count: 0, icon: completosIcon },
];
```

### Status de Itens

Os status possíveis para um item são definidos em `src/constants/comicStatus.js`:

- **`OWNED`**: Item na coleção (não lido)
- **`WISHLIST`**: Item na lista de desejos
- **`READING`**: Item sendo lido atualmente
- **`COMPLETED`**: Item completamente lido

### Hook de Filtros (useCategoryFilters)

O hook `useCategoryFilters` encapsula toda a lógica de filtragem e contagem:

```javascript
import { useCategoryFilters } from "./hooks/useCategoryFilters";

// No componente
const {
  filteredItems,
  categories,
  publishers,
  seriesOptions,
  filters,
  updateFilters,
} = useCategoryFilters(items);
```

#### Retorno do Hook:

- **`filteredItems`**: Array de itens filtrados baseado nos filtros ativos
- **`categories`**: Array de categorias com contadores atualizados
- **`publishers`**: Array de editoras únicas encontradas nos itens
- **`seriesOptions`**: Array de séries únicas encontradas nos itens
- **`filters`**: Objeto com os filtros atualmente ativos
- **`updateFilters(newFilters)`**: Função para atualizar os filtros

### Validação de Arrays

Para prevenir erros como "items.map is not a function", utilize as funções de validação:

```javascript
import { ensureArray, validateApiResponse } from "./utils/arrayHelpers";

// Garantir que um valor seja sempre array
const safeItems = ensureArray(possiblyNullValue, "contexto");

// Validar resposta de API
const items = validateApiResponse(apiResponse, "api/items");
```

### Exemplo de Uso Completo

```jsx
import React, { useState, useEffect } from "react";
import { useCategoryFilters } from "./hooks/useCategoryFilters";
import { SAFE_INITIAL_STATES } from "./utils/arrayHelpers";
import CategoryFilter from "./components/CategoryFilter";
import ItemList from "./components/ItemList";

function App() {
  const [items, setItems] = useState(SAFE_INITIAL_STATES.items);
  const [loading, setLoading] = useState(false);

  const { filteredItems, categories, filters, updateFilters } =
    useCategoryFilters(items);

  useEffect(() => {
    // Carregar itens da API
    setLoading(true);
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(ensureArray(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <CategoryFilter
        activeFilter={filters.status}
        categories={categories}
        onFilterChange={(status) => updateFilters({ status })}
      />
      <ItemList items={filteredItems} loading={loading} />
    </div>
  );
}
```

### Boas Práticas

1. **Sempre inicialize arrays vazios**: Use `SAFE_INITIAL_STATES` para garantir estados válidos
2. **Valide respostas de API**: Use `validateApiResponse()` ao receber dados externos
3. **Use ensureArray()**: Sempre que houver dúvida se um valor é array
4. **Memoize valores derivados**: Use `useMemo` para cálculos baseados em arrays grandes
5. **Props com defaults**: Sempre forneça valores padrão para props que esperam arrays ou objetos

### Referências

- Hook de filtros: `src/hooks/useCategoryFilters.js`
- Helpers de array: `src/utils/arrayHelpers.js`
- Constantes de status: `src/constants/comicStatus.js`
- Componente de filtro: `src/components/CategoryFilter/index.jsx`
