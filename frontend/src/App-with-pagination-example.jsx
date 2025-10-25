/**
 * EXEMPLO DE INTEGRAÇÃO: usePagination no App.jsx
 * 
 * Este arquivo demonstra como integrar o hook usePagination
 * no componente principal App.jsx
 * 
 * Para ativar a paginação:
 * 1. Descomentar o import do usePagination
 * 2. Descomentar o hook usePagination no componente
 * 3. Trocar filteredItems por paginatedItems no ItemList
 * 4. Adicionar o componente Pagination após o ItemList
 * 5. Adicionar useEffect para resetar página ao filtrar
 */

// ==================== IMPORTS ====================
import { useEffect, useState, useMemo, useCallback } from 'react';
// ... outros imports existentes
import { useCategoryFilters } from './hooks/useCategoryFilters.js';
// import { usePagination } from './hooks/usePagination.js'; // 1. Descomentar
// import Pagination from './components/Pagination'; // 1. Descomentar

function App() {
  // ... estados existentes
  const [items, setItems] = useState(SAFE_INITIAL_STATES.items);
  
  // Hook de filtros (já existente)
  const {
    filters,
    filteredItems,
    categories,
    updateFilters,
    filteredCount,
  } = useCategoryFilters(items);

  // ==================== PAGINAÇÃO ====================
  // 2. Descomentar para ativar paginação
  /*
  const { 
    paginatedItems,     // Items da página atual
    pageInfo,           // Info completa da paginação
    pageRange,          // Range de páginas [1, 2, '...', 10]
    goToPage,           // Função para ir para página específica
    resetPage,          // Função para voltar à página 1
  } = usePagination(filteredItems, 24); // 24 items por página
  
  // 5. Resetar página quando filtros mudarem
  useEffect(() => {
    resetPage();
  }, [filters.status, filters.term, filters.publisher, filters.series, resetPage]);
  */

  // ... resto do código existente (handlers, etc.)

  return (
    <Layout>
      <div className="app">
        {isAuthenticated ? (
          <>
            <main className="app-main" id="conteudo-principal">
              <div className="app-filters">
                <CategoryFilter 
                  activeFilter={filters.status}
                  categories={categories}
                  onFilterChange={(filterId) => handleFilterChange({ status: filterId })}
                />
              </div>
              <div className="app-content">
                <div className="app-content__header">
                  <p className="results-count">
                    {filteredCount} HQs encontradas
                    {/* Com paginação ativa, pode adicionar info da página:
                    {pageInfo && ` (${pageInfo.startIndex}-${pageInfo.endIndex})`}
                    */}
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary btn--add-hq"
                    onClick={handleFormOpen}
                  >
                    Adicionar HQ
                  </button>
                </div>

                {/* 3. TROCAR filteredItems por paginatedItems */}
                <ItemList
                  items={filteredItems} // Trocar por: paginatedItems
                  onSelectItem={handleSelectItem}
                  isLoading={status.state === 'loading' && !selectedItem}
                  error={error}
                />

                {/* 4. ADICIONAR componente de paginação */}
                {/* 
                <Pagination 
                  pageInfo={pageInfo}
                  pageRange={pageRange}
                  onPageChange={goToPage}
                />
                */}
              </div>
            </main>
          </>
        ) : (
          <div className="app-login">
            {/* Conteúdo para usuários não autenticados */}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;

/**
 * BENEFÍCIOS DA PAGINAÇÃO:
 * 
 * 1. Performance:
 *    - Renderiza apenas 24 cards por vez (vs. todos)
 *    - Scroll mais leve
 *    - Menos memória usada
 * 
 * 2. UX:
 *    - Navegação clara entre páginas
 *    - Info de "Mostrando X-Y de Z"
 *    - Controles intuitivos (←, →, números)
 * 
 * 3. Escalabilidade:
 *    - Suporta milhares de items
 *    - Performance consistente
 *    - Backend-friendly (preparado para paginação server-side)
 * 
 * CUSTOMIZAÇÃO:
 * 
 * - Alterar items por página:
 *   usePagination(filteredItems, 48) // 48 items
 * 
 * - Esconder paginação para poucos items:
 *   {filteredCount > 24 && <Pagination ... />}
 * 
 * - Adicionar seletor de items por página:
 *   const [itemsPerPage, setItemsPerPage] = useState(24);
 *   usePagination(filteredItems, itemsPerPage)
 */
