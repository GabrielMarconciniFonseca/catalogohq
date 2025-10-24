# Plano de Adequação ao Figma

Este documento descreve o plano iterativo para alinhar o frontend do projeto com o protótipo do Figma: [Catalogo HQ](https://www.figma.com/design/ZidlbmnbmHAhWXKHoqwpcv/Catalogo-Hq?node-id=61-3).

## ✅ Problemas Críticos - STATUS ATUAL (node-id=61-5)

**Status**: � **FASE 2 CONCLUÍDA** - Grid de 6 colunas implementado com sistema responsivo completo!

### ✅ Últimas Implementações (Fase 2):

**1. ✅ SISTEMA DE IMAGENS COM FALLBACK:**

- **Status**: ✅ CONCLUÍDO
- **Implementação**: Sistema robusto de carregamento com fallback visual elegante
- **Detalhes técnicos**:
  - Ícone SVG placeholder (88x88px)
  - Skeleton loading animado
  - Estados: loading, loaded, error
  - Mensagens contextuais
  - Background #F3F4F6 (Figma)

**2. ✅ SISTEMA DE ABAS HORIZONTAL:**

- **Status**: ✅ CONCLUÍDO
- **Implementação**: Abas horizontal completo (Todas, Coleção, Wishlist, Lendo, Completos)
- **Detalhes técnicos**:
  - Container com `width: 100%` e `flex: 1` nos botões
  - Ícones 16px, altura 30px
  - Background `rgba(236, 236, 240, 0.5)`
  - Border-radius 14px

**3. ✅ LAYOUT GERAL:**

- **Status**: ✅ CONCLUÍDO
- **Implementação**: Header → Abas → Grid de Cards
- **Correção**: Removido `display: grid` conflitante no App.css

### ✅ Ações Concluídas (Fase 2):

**TODOS OS ITENS CRÍTICOS CONCLUÍDOS:**

1. ✅ **Grid de 6 colunas** - Sistema de grid responsivo implementado com 6 colunas no desktop

### ✅ O que está funcionando:

- ✅ Header com logo e busca
- ✅ Sistema de abas horizontal full-width
- ✅ Botão "Adicionar HQ" no lugar correto
- ✅ Layout Header → Abas → Grid
- ✅ **Grid de 6 colunas no desktop (1528px max-width)**
- ✅ **Sistema responsivo completo (6→5→4→3→2→1 colunas)**
- ✅ Cards com dimensões corretas (202x332px)
- ✅ Sistema de imagens com fallback visual
- ✅ Skeleton loading animado
- ✅ Badges de status nos cards
- ✅ Estados hover e active nas abas
- ✅ Contadores de itens por categoria
- ✅ Gap consistente (24px desktop, 16px mobile)
- ✅ Centralização automática do grid

---

## Visão Geral

- **Objetivo**: Reproduzir fielmente o layout do Figma, enquanto evoluímos a arquitetura de código para maior legibilidade e reuso.
- **Abordagem**: Executar em ondas simultâneas de UI e refatoração, garantindo que cada ajuste visual traga melhorias estruturais.
- **Pilares**:
  1. **Correção visual** (cores, espaçamentos, tipografia, componentes)
  2. **Refino estrutural** (componentização, hooks, separação de responsabilidades)
  3. **Qualidade** (testes, documentação, padrões de código)

## Linha do Tempo Resumida

| Fase | Foco Principal                           | Resultado Esperado                                      |
| ---- | ---------------------------------------- | ------------------------------------------------------- |
| 1    | Correções críticas + base de refatoração | UI sem bugs graves, dados carregando corretamente       |
| 2    | Grid e cards alinhados ao Figma          | Cards visuais equivalentes, componentes reaproveitáveis |
| 3    | Interações, badges e detalhes            | Experiência refinada, lógica desacoplada                |
| 4    | Otimizações e QA final                   | Projeto pronto para homologação                         |

## Fase 1 – Fundamentos e Correções Críticas

### UI

- [x] Reproduzir header idêntico ao Figma (logo, busca central, avatar/login)
- [x] Garantir tipografia `Arimo` global e pesos corretos
- [x] Adicionar botão "Adicionar HQ" alinhado ao contador de resultados

### Lógica & Refatoração

- [x] Resolver erro `items.map is not a function` (garantir arrays e estados iniciais)
- [x] Criar hook `useCategoryFilters` encapsulando filtro, contagem e itens filtrados
- [x] Revisar `AuthContext` e `Layout` para usar parâmetros padrão no lugar de `defaultProps`

### Qualidade

- [ ] Documentar estados iniciais e mocks no README de desenvolvimento
- [ ] Adicionar teste unitário simples para `CategoryFilter` (renderização básica)

## Fase 2 – Grid Principal e Cards

**Status da Fase**: 🔄 **EM ANDAMENTO** - Principais componentes visuais implementados

### ✅ UI - Concluído

- [x] Construir grid responsivo seguindo dimensões do Figma (202x332 px por card)
- [x] **Sistema de abas horizontal** - ✅ Abas ocupando toda largura com distribuição igual
- [x] **Layout geral** - ✅ Estrutura Header → Abas → Grid de Cards
- [x] **Exibir imagens com fallback** - ✅ Sistema robusto com skeleton loading e ícone SVG
- [x] **Bordas, sombras e espaçamentos** - ✅ Estilos conforme Figma
- [x] **Sistema de navegação por abas** - ✅ 5 abas com ícones 16px e contadores

### ⏳ UI - Pendente

- [x] **Dimensões finais dos cards** - ✅ **VALIDADO** - Cards mantêm 202x332px no desktop e proporção correta no mobile

### ✅ Lógica & Refatoração - Concluído

- [x] **CategoryFilter reimplementado** - ✅ Sistema de abas horizontal full-width
- [x] **App.jsx reorganizado** - ✅ CategoryFilter na posição correta entre header e grid
- [x] **Sistema de estados de imagem** - ✅ Loading, loaded e error states
- [x] **Revisar ItemList para grid de 6 colunas** - ✅ Ajustado CSS grid com sistema responsivo completo
- [x] **Criar componente ComicCard** - ✅ Componente principal com propriedades controladas
- [x] **Extrair CardBadge, CardRating, CardTags** - ✅ Subcomponentes reutilizáveis criados
- [x] **Centralizar mapeamento de status** - ✅ Arquivo `src/constants/comicStatus.js` com helpers

### ⏳ Lógica & Refatoração - Pendente

Nenhum item pendente na Fase 2!

### Qualidade

- [ ] Cobrir `ComicCard` com testes de snapshot e variações de status
- [ ] Atualizar Storybook/Playwright (se aplicável) com histórias de estados

## Fase 3 – Microinterações e Detalhes

### UI

- [x] Implementar overlay com data no hover (gradiente + animação fade)
- [x] Ajustar badges de status conforme cores e ícones do Figma
- [x] Reproduzir componente de rating com estrelas SVG cheias/parciais

### Lógica & Refatoração

- [x] Criar hook `useItemStatus` para orquestrar atualização de status e feedback
- [x] Revisar `services/api.js` para lidar com estados de carregamento/erro mais granulares
- [ ] Garantir que filtros, busca e páginas usem estados derivados memoizados

### Qualidade

- [ ] Testes de integração para filtro + lista (Vitest + Testing Library)
- [ ] Playwright: fluxo de mudança de status e validação visual básica

## Fase 4 – Otimizações e QA Final

### UI

- [ ] Conferir consistência de cores (tokens), espaçamentos e bordas
- [ ] Validar responsividade (breakpoints 1440, 1024, 768, 375)
- [ ] Ajustar `footer` conforme design (mesmo se vazio, garantir padding/borda)

### Lógica & Refatoração

- [ ] Revisar árvore de componentes para evitar renders desnecessários (`React.memo`/`useMemo`)
- [ ] Centralizar variáveis de tema em `styles/tokens.css`
- [ ] Limpeza final de console logs e comentários temporários

### Qualidade

- [ ] Auditoria de acessibilidade (ARIA, tabulação, contrastes)
- [ ] Atualizar documentação (`README.md`, `COMO-RODAR.md`) com novo fluxo e scripts
- [ ] Checklist final comparando cada seção com o Figma

## Macro Roadmap Técnico

1. **Componentização**
   - CategoryFilter (apresentação) ✅
   - Hooks para lógica (filtragem, status, busca)
   - Cartões e subcomponentes reutilizáveis
2. **State Management**
   - Consolidar estados derivados em hooks + contextos leves
   - Evitar cálculos repetidos em renderizações
3. **Estilos**
   - Padronizar com CSS Modules ou abordagem BEM já existente
   - Introduzir tokens de design (`:root`) para cores e espaçamentos
4. **Dados**
   - Criar camada de mocks consistente para desenvolvimento/testes
   - Planejar integração real ou fixtures carregados do backend Java
5. **Automação**
   - Scripts npm: `lint`, `test`, `test:e2e`, `preview`
   - Git hooks (husky) para lint/test antes de commits (opcional)

## Dependências & Ferramentas Sugeridas

- **UI**: Radix Icons / Heroicons (caso precise substituir SVGs estáticos)
- **Lógica**: Zustand ou Context API para estados globais (se escopo crescer)
- **Estilos**: CSS atual + PostCSS (já com Vite)
- **Testes**: Vitest + Testing Library (já configurado)
- **Visual**: Storybook (opcional, mas recomendado para cards)

## Critérios de Aceite

- Layout igual ao Figma (diferença máxima de 1px em dimensões-chave)
- Todos os estados de filtro/status funcionais
- Código organizado em componentes e hooks com responsabilidades claras
- Testes mínimos passando (unitários e end-to-end principais)
- Documentação atualizada para novos contribuidores

---

## 📝 Changelog de Implementações

### 24 de Outubro de 2025 - Sistema de Estados Granulares na API ✅

**Implementação de tratamento avançado de erros e estados na camada de serviços (Fase 3)**

#### Arquivos Modificados:

1. **`frontend/src/services/api.js`**

   - **Classes de Erro Customizadas:**

     - `ApiError` (classe base) com propriedades: type, statusCode, originalError, timestamp
     - `NetworkError` - Erros de conexão, timeout (sem resposta do servidor)
     - `ValidationError` - Erros 400/422 com suporte a erros por campo
     - `AuthenticationError` - Erro 401 (sessão expirada)
     - `AuthorizationError` - Erro 403 (sem permissão)
     - `NotFoundError` - Erro 404 (recurso não existe)
     - `ServerError` - Erros 500/503 (servidor indisponível)

   - **Constantes Exportadas:**

     - `HTTP_STATUS` - Códigos HTTP mais comuns (OK: 200, UNAUTHORIZED: 401, etc.)
     - `ERROR_TYPES` - Tipos de erro categorizados (NETWORK, VALIDATION, etc.)

   - **Interceptors do Axios:**

     - **Request Interceptor:** Logging de requisições em modo dev
     - **Response Interceptor:**
       - Log de respostas bem-sucedidas
       - Retry automático para erros de rede (até 2 tentativas)
       - Tratamento global de erros

   - **Função `parseError(error)`:**

     - Analisa erro do axios e retorna ApiError apropriado
     - Categoriza por status HTTP
     - Extrai mensagens contextuais do backend
     - Tratamento especial para erros de rede

   - **Função `apiRequest(requestFn)`:**

     - Wrapper que retorna objeto padronizado: `{ data, error, status, statusCode, message }`
     - `status`: "success" ou "error"
     - `data`: dados da resposta (null em erro)
     - `error`: ApiError categorizado (null em sucesso)
     - `statusCode`: código HTTP da resposta
     - `message`: mensagem descritiva

   - **Funções com Estados Granulares (sufixo `WithState`):**

     - `loginWithState(credentials)` - Login com estados
     - `registerUserWithState(payload)` - Registro com estados
     - `fetchItemsWithState(filters)` - Buscar items com estados
     - `fetchWishlistWithState()` - Buscar wishlist com estados
     - `fetchItemByIdWithState(id)` - Buscar item por ID com estados
     - `createItemWithState(formData)` - Criar item com estados
     - `updateItemStatusWithState(id, status)` - Atualizar status com estados
     - `importItemsCsvWithState(file)` - Importar CSV com estados

   - **Retrocompatibilidade:**
     - Todas as funções legadas mantidas (login, fetchItems, etc.)
     - Código existente continua funcionando sem modificações
     - Migração gradual recomendada

#### Arquivos Criados:

2. **`docs/api-granular-states-guide.md`**
   - Documentação completa do sistema de estados granulares
   - **Conteúdo:**
     - Visão geral e benefícios
     - Descrição de todas as classes de erro
     - Constantes HTTP_STATUS e ERROR_TYPES
     - Explicação da função apiRequest
     - Tabela de funções (legadas vs com estados)
     - 5 exemplos práticos de uso:
       1. Buscar items com tratamento de erro granular
       2. Login com feedback específico
       3. Criar item com validação de erros por campo
       4. Hook customizado com estados granulares
       5. Atualizar status com feedback
     - Documentação dos interceptors
     - Estratégia de migração gradual
     - Boas práticas (DOs e DON'Ts)
     - Próximos passos e referências

#### Resultado:

- ✅ **Erros categorizados** - 7 tipos de erro específicos (NetworkError, ValidationError, etc.)
- ✅ **Estados explícitos** - Objeto padronizado { data, error, status, statusCode, message }
- ✅ **Retry automático** - Até 2 tentativas para erros de rede temporários
- ✅ **Logging integrado** - Console logs em modo desenvolvimento
- ✅ **Timeout configurado** - 30 segundos por requisição
- ✅ **Retrocompatibilidade total** - Funções legadas mantidas
- ✅ **Documentação completa** - Guia com 5 exemplos práticos
- ✅ **Constantes exportadas** - HTTP_STATUS e ERROR_TYPES para uso em componentes
- ✅ **Validação de arrays** - Integração com validateApiResponse mantida

#### Especificações Técnicas:

**Estrutura de Resposta (apiRequest):**

```javascript
{
  data: any,           // Dados da resposta (null em erro)
  error: ApiError,     // Erro categorizado (null em sucesso)
  status: "success" | "error",
  statusCode: number,  // Código HTTP
  message: string      // Mensagem descritiva
}
```

**Hierarquia de Erros:**

```
ApiError (base)
├── NetworkError (sem conexão, timeout)
├── ValidationError (400, 422, erros de campo)
├── AuthenticationError (401, sessão expirada)
├── AuthorizationError (403, sem permissão)
├── NotFoundError (404, recurso não existe)
└── ServerError (500, 503, erro no servidor)
```

**Exemplo de Uso:**

```javascript
const result = await fetchItemsWithState({ status: "OWNED" });

if (result.status === "success") {
  setItems(result.data);
} else {
  // Tratamento específico por tipo de erro
  switch (result.error.type) {
    case ERROR_TYPES.NETWORK:
      showErrorWithRetry(result.message);
      break;
    case ERROR_TYPES.AUTHENTICATION:
      redirectToLogin();
      break;
    default:
      showError(result.message);
  }
}
```

#### Integrações:

- `validateApiResponse` - Mantida para validação de arrays
- `useItemStatus` - Pode ser atualizado para usar `updateItemStatusWithState`
- Componentes futuros - Devem usar funções `*WithState`

#### Migração Recomendada:

**Componentes Prioritários:**

1. **ItemList** - Tratamento de erros de carregamento
2. **ItemForm** - Validação de erros por campo
3. **AuthPanel** - Feedback específico de autenticação
4. **ImportCsvForm** - Erros de validação de arquivo

**Estratégia:**

- Manter funções legadas (não quebrar código existente)
- Usar `*WithState` em novos componentes
- Migrar componentes críticos gradualmente
- Testar extensivamente antes de remover código antigo

#### Próximos Passos (Fase 3):

- ✅ ~~Criar hook `useItemStatus` para orquestrar atualização de status e feedback~~
- ✅ ~~Revisar `services/api.js` para lidar com estados de carregamento/erro mais granulares~~
- [ ] Garantir que filtros, busca e páginas usem estados derivados memoizados
- [ ] Migrar `ItemList` para usar `fetchItemsWithState`
- [ ] Atualizar `useItemStatus` para usar `updateItemStatusWithState`
- [ ] Criar componentes de erro reutilizáveis (ErrorBanner, ErrorModal)
- [ ] Testes unitários para classes de erro

#### Benefícios Imediatos:

- 🎯 **Melhor UX** - Mensagens de erro contextuais e ações específicas
- 🛡️ **Maior resiliência** - Retry automático para erros temporários
- 🐛 **Debug facilitado** - Logging estruturado e categorização de erros
- 📊 **Monitoramento** - Tipos de erro podem ser enviados para analytics
- 🔄 **Manutenibilidade** - Código mais limpo e testável

---

### 24 de Outubro de 2025 - Hook useItemStatus para Orquestração de Status ✅

**Implementação do hook customizado para gerenciar atualização de status e feedback (Fase 3)**

#### Arquivos Criados:

1. **`frontend/src/hooks/useItemStatus.js`**

   - Hook principal para orquestrar atualização de status de items
   - **API do Hook:**
     - `updateStatus(itemId, newStatus)`: Função assíncrona que retorna Promise<boolean>
     - `feedback`: Objeto com `{ state, message }` para feedback ao usuário
     - `clearFeedback()`: Função para limpar feedback manualmente
     - `isLoading`: Boolean indicando operação em andamento
   - **Funcionalidades:**
     - Validação de parâmetros (itemId e newStatus obrigatórios)
     - Chamada à API `updateItemStatus` do services/api.js
     - Estados de feedback: 'idle', 'loading', 'success', 'error'
     - Auto-limpeza de feedback de sucesso após 3 segundos
     - Tratamento robusto de erros com mensagens contextuais
     - Uso de `useCallback` para otimização de performance
   - **Integração:**
     - Usa `getStatusLabel()` de `comicStatus.js` para mensagens
     - Compatível com componente `Feedback` existente
     - Retorna boolean para decisões de fluxo (success/failure)

2. **`frontend/src/components/ItemStatusMenu/index.jsx`**

   - Componente de exemplo demonstrando uso do hook
   - Menu para seleção de status com 4 opções (OWNED, READING, WISHLIST, COMPLETED)
   - **Funcionalidades:**
     - Lista todas as opções de status com indicadores coloridos
     - Marca status atual com checkmark
     - Desabilita opção atual e botões durante loading
     - Fecha menu automaticamente após sucesso (1.5s delay)
     - Exibe feedback inline usando componente `Feedback`
   - **Props:**
     - `itemId`: ID do item a ser atualizado
     - `currentStatus`: Status atual do item
     - `onStatusChanged`: Callback após mudança bem-sucedida
     - `onClose`: Callback para fechar menu

3. **`frontend/src/components/ItemStatusMenu/ItemStatusMenu.css`**

   - Estilos completos para o menu de status
   - **Design:**
     - Card flutuante com sombra e border-radius 12px
     - Background branco (#FFFFFF)
     - Header com título e botão de fechar
     - Opções com indicadores coloridos (16x16px, border-radius 4px)
     - Hover states com borda na cor do status
     - Estado ativo com background #ECEEF2
     - Animação de pulse durante loading
     - Transições suaves (0.2s ease)
   - **Responsividade:**
     - Desktop: min-width 240px, max-width 320px
     - Mobile (<480px): min-width 200px, padding reduzido

4. **`docs/useItemStatus-guide.md`**
   - Documentação completa do hook
   - **Conteúdo:**
     - Visão geral e API do hook
     - 5 exemplos práticos de uso
     - Integração com Context API
     - Tratamento de erros
     - Feedback automático
     - Status válidos (constantes)
     - Boas práticas
     - Exemplo de testes unitários
     - Próximos passos (undo/redo, optimistic updates)

#### Resultado:

- ✅ **Hook reutilizável** - Encapsula toda lógica de atualização de status
- ✅ **Feedback ao usuário** - Estados claros (loading, success, error)
- ✅ **Tratamento de erros** - Mensagens contextuais e robustas
- ✅ **Auto-limpeza** - Feedback de sucesso limpo após 3 segundos
- ✅ **Performance otimizada** - Uso de useCallback para memoização
- ✅ **Componente de exemplo** - ItemStatusMenu demonstra uso completo
- ✅ **Documentação completa** - Guia com 5 exemplos práticos
- ✅ **Tipagem PropTypes** - Componente totalmente tipado
- ✅ **Acessibilidade** - ARIA labels e estados disabled
- ✅ **Design consistente** - Cores e estilos alinhados ao Figma

#### Especificações Técnicas:

**Hook API:**

```javascript
const { updateStatus, feedback, clearFeedback, isLoading } = useItemStatus();

// updateStatus: (itemId, newStatus) => Promise<boolean>
// feedback: { state: 'idle'|'loading'|'success'|'error', message: string }
// clearFeedback: () => void
// isLoading: boolean
```

**Estados de Feedback:**

- **idle**: Estado inicial, sem operação em andamento
- **loading**: "Atualizando status..."
- **success**: "Status atualizado para \"{label}\" com sucesso!" (auto-limpa em 3s)
- **error**: Mensagem de erro da API ou "Erro ao atualizar status."

**Validações:**

- ItemId obrigatório (retorna erro se ausente)
- NewStatus obrigatório (retorna erro se ausente)
- Aceita itemId como number ou string
- Valida status através de constantes COMIC_STATUS

**Integrações:**

- `services/api.js`: Usa função `updateItemStatus` existente
- `constants/comicStatus.js`: Usa `getStatusLabel()` para mensagens
- `components/Feedback`: Compatível com estrutura { state, message }

#### Exemplos de Uso:

**1. Uso Básico:**

```jsx
const { updateStatus, feedback, isLoading } = useItemStatus();

const handleUpdate = async () => {
  const success = await updateStatus(itemId, COMIC_STATUS.READING);
  if (success) {
    // Refetch ou atualizar UI
  }
};
```

**2. Com Menu de Seleção:**

```jsx
<ItemStatusMenu
  itemId={item.id}
  currentStatus={item.status}
  onStatusChanged={(id, newStatus) => refreshItems()}
  onClose={() => setMenuOpen(false)}
/>
```

**3. Integração com Feedback:**

```jsx
{
  feedback.state !== "idle" && <Feedback status={feedback} />;
}
```

#### Arquitetura:

```
hooks/
└── useItemStatus.js          (Hook principal)

components/
├── ItemStatusMenu/           (Exemplo de uso)
│   ├── index.jsx
│   └── ItemStatusMenu.css
└── Feedback/                 (Componente existente)
    └── index.jsx

constants/
└── comicStatus.js            (Status e helpers)

services/
└── api.js                    (updateItemStatus já existe)

docs/
└── useItemStatus-guide.md    (Documentação completa)
```

#### Próximos Passos (Fase 3):

- ✅ ~~Criar hook `useItemStatus` para orquestrar atualização de status e feedback~~
- [ ] Revisar `services/api.js` para lidar com estados de carregamento/erro mais granulares
- [ ] Garantir que filtros, busca e páginas usem estados derivados memoizados
- [ ] Implementar optimistic updates no hook
- [ ] Adicionar undo/redo functionality
- [ ] Testes unitários para useItemStatus

#### Screenshot de Validação:

- Arquivo sugerido: `temp/item-status-menu-validation.png`
- ItemStatusMenu funcionando com todas as opções de status
- Estados de loading e feedback visíveis

---

### 24 de Outubro de 2025 - Componente de Rating com Estrelas SVG Parciais ✅

**Implementação de rating com estrelas cheias e parcialmente preenchidas (Fase 3)**

#### Arquivos Modificados:

1. **`frontend/src/components/ComicCard/CardRating/index.jsx`**

   - **Função `getStarFillPercentage()`:** Calcula porcentagem de preenchimento para cada estrela
     - Estrela completa (rating >= index): retorna 100%
     - Estrela parcial (rating entre index-1 e index): retorna (rating - floor) × 100
     - Estrela vazia (rating < index-1): retorna 0%
   - **Componente `StarIcon` melhorado:**
     - Props: `fillPercentage` (0-100) e `index` (para ID único)
     - SVG com `<linearGradient>` único por estrela
     - Gradiente horizontal (x1="0%" → x2="100%")
     - Dois `<stop>` points no offset de fillPercentage
     - Primeiro stop: cor amarela (#FFD43B)
     - Segundo stop: transparente
   - **Componente `CardRating`:**
     - Renderiza 5 estrelas com fillPercentage calculado individualmente
     - Normaliza rating entre 0 e 5
     - Exibe valor numérico formatado com 1 casa decimal

2. **`frontend/src/components/ComicCard/CardRating/CardRating.css`**

   - Removida classe `.card-rating__star--filled` (não mais necessária)
   - Adicionado `display: block` em `.card-rating__star` para garantir renderização correta
   - Estilos mantidos conforme Figma (cores, tipografia, espaçamentos)

3. **`frontend/src/App.jsx`** (TEMPORÁRIO)
   - Adicionados ratings variados aos dados mockados para teste
   - Linha 60: `rating: 4.5 + (index * 0.3)`
   - Deve ser removido quando backend incluir campo `rating`

#### Resultado:

- ✅ **Estrelas cheias** - Preenchimento 100% com cor #FFD43B
- ✅ **Estrelas parciais** - Preenchimento gradual de 0-100%
- ✅ **Estrelas vazias** - Apenas stroke cinza rgba(113, 113, 130, 0.3)
- ✅ **Rating 4.5** - 4 estrelas cheias + 1 estrela 50% preenchida
- ✅ **Rating 4.8** - 4 estrelas cheias + 1 estrela 80% preenchida
- ✅ **Dimensões Figma** - Estrelas 6x6px, gap 2px
- ✅ **Cores exatas** - Amarelo #FFD43B, cinza rgba(113, 113, 130, 0.3)
- ✅ **Tipografia** - Arimo 8px, line-height 1.5, cor #717182

#### Especificações Técnicas:

**Cálculo de Preenchimento:**

```javascript
// Exemplo: rating = 4.7
// Estrela 1-4: 100% (rating >= starIndex)
// Estrela 5: 70% ((4.7 - 4) * 100 = 70%)
```

**SVG Gradient:**

```jsx
<linearGradient id="star-gradient-{index}" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="{fillPercentage}%" stopColor="#FFD43B" />
  <stop offset="{fillPercentage}%" stopColor="transparent" />
</linearGradient>
```

**Estrutura de Dados:**

- Rating 0.0: 0 estrelas cheias, 5 vazias
- Rating 2.3: 2 estrelas cheias, 1 estrela 30%, 2 vazias
- Rating 4.5: 4 estrelas cheias, 1 estrela 50%
- Rating 5.0: 5 estrelas cheias

#### Validação Visual:

- Testado com ratings 4.5 e 4.8
- Quinta estrela exibe preenchimento parcial correto (50% e 80%)
- Stroke sempre visível em todas as estrelas
- Gradiente suave sem cortes ou artefatos

#### Próximos Passos (Fase 3):

- ✅ ~~Implementar overlay com data no hover~~
- ✅ ~~Ajustar badges de status conforme cores e ícones do Figma~~
- ✅ ~~Reproduzir componente de rating com estrelas SVG cheias/parciais~~
- [ ] Criar hook `useItemStatus` para orquestrar atualização de status e feedback
- [ ] Revisar `services/api.js` para lidar com estados de carregamento/erro mais granulares

---

### 24 de Outubro de 2025 - Ajuste de Badges de Status Conforme Figma ✅

**Implementação de badges com cores e ícones corretos do Figma (Fase 3)**

#### Arquivos Modificados:

1. **`frontend/src/constants/comicStatus.js`**

   - **Correção de cores e textos:**
     - READING: textColor "#FFFFFF" → "#212529" (preto escuro)
     - WISHLIST: backgroundColor "#51CF66" → "#E03131" (vermelho)
     - COMPLETED: backgroundColor "#E03131" → "#51CF66" (verde)

2. **`frontend/src/components/ComicCard/CardBadge/index.jsx`**

   - **Ícones específicos para cada status:**
     - OWNED: CollectionIcon (ícone de coleção)
     - READING: ReadingIcon (ícone de livro aberto)
     - WISHLIST: WishlistIcon (ícone de coração)
     - COMPLETED: CompletedIcon (ícone de check em círculo)
   - Função `getStatusIcon()` para renderizar ícone correto
   - Todos os ícones com 12x12px em SVG

3. **`frontend/src/components/ComicCard/CardBadge/CardBadge.css`**
   - **Correção de cores CSS:**
     - `.card-badge--reading`: color "#FFFFFF" → "#212529"
     - `.card-badge--wishlist`: backgroundColor "#51CF66" → "#E03131"
     - `.card-badge--completed`: backgroundColor "#E03131" → "#51CF66"

#### Resultado:

- ✅ **Badge "Na Coleção"** - Azul (#4C6EF5) com texto branco e ícone de coleção
- ✅ **Badge "Lendo"** - Amarelo (#FFD43B) com texto preto (#212529) e ícone de livro
- ✅ **Badge "Wishlist"** - Vermelho (#E03131) com texto branco e ícone de coração
- ✅ **Badge "Completo"** - Verde (#51CF66) com texto branco e ícone de check
- ✅ **Todos os ícones** - 12x12px em SVG com `currentColor`
- ✅ **Posicionamento** - Canto superior direito (3px top, 3px right)
- ✅ **Espaçamento** - Gap 4px entre ícone e texto
- ✅ **Tipografia** - Arimo 12px, line-height 1.33
- ✅ **Border-radius** - 8px conforme Figma

#### Especificações Técnicas (Figma):

| Status    | Background | Texto   | Ícone            | Label      |
| --------- | ---------- | ------- | ---------------- | ---------- |
| OWNED     | #4C6EF5    | #FFFFFF | Coleção (branco) | Na Coleção |
| READING   | #FFD43B    | #212529 | Livro (preto)    | Lendo      |
| WISHLIST  | #E03131    | #FFFFFF | Coração (branco) | Wishlist   |
| COMPLETED | #51CF66    | #FFFFFF | Check (branco)   | Completo   |

#### Screenshot de Validação:

- Arquivo salvo: `temp/badges-status-figma-validacao.png`
- Validação visual de todos os 4 badges implementados corretamente

#### Próximos Passos (Fase 3):

- ✅ ~~Ajustar badges de status conforme cores e ícones do Figma~~
- [ ] Reproduzir componente de rating com estrelas SVG cheias/parciais
- [ ] Implementar microinterações e animações refinadas

---

### 24 de Outubro de 2025 - Overlay com Data no Hover ✅

**Implementação do overlay com gradiente e animação fade (Fase 3)**

#### Arquivos Modificados:

1. **`frontend/src/components/ComicCard/ComicCard.css`**

   - Overlay com posição absolute no bottom da imagem
   - Gradiente linear vertical: `linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)`
   - Opacity 0 por padrão, aparece no hover com `transition: opacity 0.3s ease`
   - Altura de 14.5px conforme Figma
   - Padding: 0px 2px 2px
   - Ícone de calendário SVG (6x6px) + data em branco
   - Removido botão invisível que bloqueava o hover

2. **`frontend/src/components/ComicCard/index.jsx`**

   - Ícone CalendarIcon já implementado (linhas 42-49)
   - Overlay renderizado condicionalmente quando há `formattedDate`
   - Formatação de data com `toLocaleDateString('pt-BR')`
   - Card transformado em botão clicável com `role="button"` e `tabIndex={0}`
   - Removido elemento `<button>` interno que interferia no hover

3. **`frontend/src/App.jsx`**

   - **TEMPORÁRIO**: Adicionadas datas aos itens para teste do overlay
   - Código em linha 59-64 adiciona `purchaseDate` aos itens mockados
   - Deve ser removido quando o backend incluir campos de data

#### Resultado:

- ✅ **Overlay com gradiente** - Efeito visual conforme design Figma
- ✅ **Animação fade suave** - Transição de 300ms em opacity
- ✅ **Ícone de calendário** - SVG 6x6px em branco
- ✅ **Data formatada** - Formato pt-BR (dd/mm/aaaa)
- ✅ **Posicionamento correto** - Bottom da imagem, altura 14.5px
- ✅ **Hover funcionando** - Aparece ao passar o mouse sobre o card
- ✅ **Acessibilidade** - Card é focável e acionável por teclado
- ✅ **Gradiente perfeito** - De preto 80% opaco para transparente

#### Especificações Técnicas:

**CSS:**

- Background: `linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)`
- Opacity: 0 → 1 no hover
- Transition: `opacity 0.3s ease`
- Height: 14.5px
- Padding: 0px 2px 2px

**Tipografia:**

- Font-family: Arimo
- Font-size: 7px
- Font-weight: 400
- Line-height: 1.5
- Color: #FFFFFF

**Estrutura HTML:**

```jsx
<div className="comic-card__overlay">
  <div className="comic-card__date">
    <CalendarIcon />
    <span>{formattedDate}</span>
  </div>
</div>
```

#### Próximos Passos (Fase 3):

- Ajustar badges de status conforme cores e ícones do Figma
- Reproduzir componente de rating com estrelas SVG cheias/parciais
- Adicionar campos `purchaseDate` e `addedDate` no backend (modelo Item)

---

### 24 de Outubro de 2025 - Componente ComicCard Modular ✅

**Criação de componente ComicCard com subcomponentes reutilizáveis (Fase 2)**

#### Arquivos Criados:

1. **`frontend/src/constants/comicStatus.js`**

   - Constantes para status de HQs (OWNED, READING, WISHLIST, COMPLETED)
   - Mapeamento de cores baseado no Figma (#4C6EF5, #FFD43B, #51CF66, #E03131)
   - Helper functions: `getStatusConfig()`, `getStatusLabel()`, `getStatusColor()`, `getStatusClassName()`

2. **`frontend/src/components/ComicCard/CardBadge/`**

   - Componente de badge com ícone de coleção SVG
   - Cores e estilos conforme Figma
   - Props: `status` (string)
   - Border-radius 8px, height 22px

3. **`frontend/src/components/ComicCard/CardRating/`**

   - Componente de rating com 5 estrelas SVG
   - Estrelas preenchidas em amarelo (#FFD43B)
   - Estrelas vazias com stroke cinza (rgba(113, 113, 130, 0.3))
   - Valor numérico ao lado das estrelas
   - Props: `rating` (number 0-5)

4. **`frontend/src/components/ComicCard/CardTags/`**

   - Componente de lista de tags
   - Background #ECEEF2, texto #030213
   - Border-radius 8px, height 12px
   - Props: `tags` (array), `maxTags` (number, default 3)

5. **`frontend/src/components/ComicCard/index.jsx` e `ComicCard.css`**
   - Componente principal do card (202x332px)
   - Sistema de imagem com fallback e skeleton loading
   - Overlay com data (visível no hover)
   - Integração com todos os subcomponentes
   - Props: `item` (object), `onSelect` (function)
   - Dimensões exatas do Figma
   - Responsivo com aspect-ratio em mobile

#### Arquivos Modificados:

1. **`frontend/src/components/ItemList/index.jsx`**

   - Refatorado para usar o novo componente ComicCard
   - Removido código duplicado de renderização de cards
   - Simplificado para apenas mapear items → ComicCard
   - Mantido sistema de placeholders (loading, error, empty)

2. **`frontend/src/components/ItemList/ItemList.css`**
   - Removidos estilos antigos dos cards (movidos para ComicCard.css)
   - Mantido apenas grid layout e placeholders
   - Grid de 6 colunas responsivo preservado

#### Resultado:

- ✅ **Componentização completa** - Card dividido em 4 componentes reutilizáveis
- ✅ **Separação de responsabilidades** - Cada subcomponente com função específica
- ✅ **Constantes centralizadas** - Status mapeados em arquivo único
- ✅ **Estilos do Figma** - Cores, dimensões e tipografia exatas
- ✅ **Rating com estrelas SVG** - Sistema visual de avaliação implementado
- ✅ **Overlay com data** - Aparece no hover com calendário e gradiente
- ✅ **Props controladas** - Todos os componentes totalmente controlados por props
- ✅ **Código limpo** - ItemList simplificado, sem lógica duplicada
- ✅ **Reusabilidade** - Subcomponentes podem ser usados em outros contextos

#### Estrutura de Componentes:

```
ComicCard/
├── index.jsx (principal)
├── ComicCard.css
├── CardBadge/
│   ├── index.jsx
│   └── CardBadge.css
├── CardRating/
│   ├── index.jsx
│   └── CardRating.css
└── CardTags/
    ├── index.jsx
    └── CardTags.css
```

#### Próximos Passos (Fase 3):

- Implementar microinterações e animações refinadas
- Ajustar overlay para mostrar mais informações
- Testes unitários para cada subcomponente
- Histórias do Storybook (se aplicável)

---

### 24 de Outubro de 2025 - Validação e Otimização de Dimensões dos Cards ✅

**Validação completa das dimensões dos cards em todas as resoluções (Fase 2)**

#### Arquivos Modificados:

1. **`frontend/src/components/ItemList/ItemList.css`**

   - **Desktop (≥700px):** Mantém dimensões fixas de 202×332px
   - **Mobile (480-699px):** Implementado `aspect-ratio: 202 / 332` para manter proporção
   - **Mobile pequeno (<480px):** Grid fluido com `aspect-ratio` preservado
   - Container de imagem usando `padding-bottom: 72.28%` para proporção correta
   - Imagem com `position: absolute` para preencher container responsivo

2. **`temp/card-dimensions-validation-report.md`**

   - Relatório completo de validação
   - Tabelas com resultados por resolução
   - Documentação técnica das melhorias
   - Guia de testes e validação

3. **`temp/test-responsive-cards.html`**
   - Arquivo HTML para teste visual de todas as resoluções
   - Iframes mostrando 7 breakpoints diferentes
   - Overlay com medições automáticas

#### Resultado:

- ✅ **Desktop:** Cards mantêm exatamente 202×332px em todas as resoluções ≥700px
- ✅ **Proporção validada:** Ratio 1.64 (332/202) preservado em todos os tamanhos
- ✅ **Grid responsivo:** 6→5→4→3→2→1 colunas funcionando perfeitamente
- ✅ **Mobile otimizado:** Cards adaptam largura mas mantêm proporção correta
- ✅ **Imagens responsivas:** Container com padding-bottom mantém proporção 72.28%
- ✅ **Sem distorções:** `object-fit: cover` preserva qualidade visual
- ✅ **CSS nativo:** `aspect-ratio` sem necessidade de JavaScript
- ✅ **Testado:** Desktop 1920/1400/1300/1000/800px, Mobile 600/375px

#### Especificações Técnicas:

**Desktop (≥700px):**

- Largura: 202px (fixo)
- Altura: 332px (fixo)
- Imagem: 202×240px
- Conteúdo: 92px

**Mobile (<700px):**

- Largura: 100% do container (min 160-180px, max 202px)
- Altura: Calculada via `aspect-ratio: 202 / 332`
- Ratio: 1.64 mantido
- Imagem: 72.28% da altura via `padding-bottom`

#### Próximos Passos (Fase 3):

- Implementar overlay com data no hover
- Ajustar badges de status conforme cores do Figma
- Componente de rating com estrelas SVG

---

### 24 de Outubro de 2025 - Grid de 6 Colunas Responsivo ✅

**Implementação do sistema de grid com 6 colunas conforme Figma (Fase 2)**

#### Arquivos Modificados:

1. **`frontend/src/components/ItemList/ItemList.css`**
   - Alterado `grid-template-columns: repeat(auto-fill, 202px)` → `repeat(6, 202px)`
   - Implementado sistema responsivo com breakpoints estratégicos:
     - **Desktop grande (≥1400px)**: 6 colunas de 202px
     - **Desktop médio (1200-1399px)**: 5 colunas de 202px
     - **Tablet grande (900-1199px)**: 4 colunas de 202px
     - **Tablet (700-899px)**: 3 colunas de 202px
     - **Mobile grande (480-699px)**: 2 colunas adaptativas
     - **Mobile pequeno (<480px)**: 1-2 colunas fluidas
   - Max-width de 1528px no desktop para alinhar com Figma
   - Gap consistente de 24px no desktop, reduzindo proporcionalmente em telas menores
   - Padding ajustado por breakpoint para otimizar o espaço disponível

#### Resultado:

- ✅ Grid de 6 colunas implementado conforme design Figma
- ✅ Sistema completamente responsivo para todos os tamanhos de tela
- ✅ Cards mantêm dimensões fixas de 202x332px
- ✅ Espaçamento consistente entre cards (24px no desktop)
- ✅ Centralização automática do grid
- ✅ Adaptação inteligente para dispositivos móveis
- ✅ Max-width de 1528px alinhado ao protótipo Figma

#### Próximos Passos (Fase 3):

- Implementar overlay com data no hover
- Ajustar badges de status conforme cores do Figma
- Componente de rating com estrelas SVG

### 24 de Outubro de 2025 - Exibição de Imagens com Fallback Padronizado ✅

**Implementação de sistema robusto de carregamento e fallback de imagens (Fase 2)**

#### Arquivos Modificados:

1. **`frontend/src/components/ItemList/index.jsx`**

   - Adicionado componente `ImagePlaceholderIcon` com ícone SVG elegante
   - Implementado estado `imageErrorStates` para rastrear erros de carregamento
   - Implementado estado `imageLoadStates` para rastrear imagens carregadas
   - Melhorado tratamento de erro com fallback visual
   - Adicionado skeleton loading durante carregamento
   - Removido Intersection Observer (usando lazy loading nativo do navegador)
   - Mensagens contextuais: "Sem imagem disponível" vs "Erro ao carregar imagem"

2. **`frontend/src/components/ItemList/ItemList.css`**
   - Criado `.comic-card__image-skeleton` com animação de loading
   - Melhorado `.comic-card__image-fallback` com layout em coluna
   - Adicionado `.image-placeholder-icon` com opacidade 0.6
   - Adicionado `.comic-card__image-fallback-text` estilizado
   - Estados `.loading` e `.loaded` para transições suaves
   - Animação `skeleton-loading` com gradiente deslizante
   - Background consistente com Figma (#F3F4F6)

#### Resultado:

- ✅ Ícone SVG elegante para fallback (88x88px)
- ✅ Skeleton loading animado durante carregamento
- ✅ Transições suaves entre estados (loading → loaded)
- ✅ Tratamento robusto de erros de imagem
- ✅ Mensagens contextuais claras
- ✅ Design consistente com Figma
- ✅ Performance otimizada (lazy loading nativo)
- ✅ Estados visuais claros para o usuário

### 24 de Outubro de 2025 - Sistema de Abas Horizontal ✅

**Implementação do Sistema de Abas Horizontal Critical (Fase 2)**

#### Arquivos Modificados:

1. **`frontend/src/components/CategoryFilter/CategoryFilter.css`**

   - Alterado `width: fit-content` → `width: 100%` (ocupa toda largura)
   - Alterado `gap: 8px` → `gap: 0` (botões contíguos)
   - Alterado `padding: 8px` → `padding: 0 4px`
   - Alterado `min-height: 48px` → `min-height: 30px`
   - Ícones reduzidos de `28px` → `16px`
   - Altura dos botões de `min-height: 40px` → `height: 30px`
   - Adicionado `flex: 1` aos botões (distribuição igual)
   - Adicionado `border: 1px solid transparent`
   - Gap entre ícone e texto de `10px` → `8px`

2. **`frontend/src/styles/App.css`** (linha 334)
   - Comentado `display: grid` conflitante que sobrescrevia o `display: flex` correto
   - Isso permitiu que o layout Header → Abas → Grid funcionasse corretamente

#### Resultado:

- ✅ Sistema de abas horizontal ocupando toda largura
- ✅ 5 abas distribuídas igualmente (Todas, Coleção, Wishlist, Lendo, Completos)
- ✅ Ícones 16px conforme design Figma
- ✅ Layout correto: Header → Abas → Contador/Botão → Grid de Cards
- ✅ Estados hover e active implementados
- ✅ Contadores de itens funcionando

#### Próximos Passos:

---

> **Dica de execução**: Tratar cada fase como uma PR dedicada. Assim é possível revisar incrementalmente, validar UI com screenshots e manter o histórico limpo.
