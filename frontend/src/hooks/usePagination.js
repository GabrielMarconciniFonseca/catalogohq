import { useState, useMemo, useCallback } from "react";

/**
 * Hook customizado para gerenciar paginação de forma otimizada
 * Usa estados derivados memoizados para evitar re-renders desnecessários
 *
 * @param {Array} items - Array de items para paginar
 * @param {number} itemsPerPage - Número de items por página (padrão: 24)
 * @returns {Object} Objeto com items paginados e controles de navegação
 */
export function usePagination(items = [], itemsPerPage = 24) {
  const [currentPage, setCurrentPage] = useState(1);

  // Total de páginas memoizado
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Items da página atual memoizados
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Informações de paginação memoizadas
  const pageInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    return {
      currentPage,
      totalPages,
      totalItems: items.length,
      startIndex: startIndex + 1, // 1-indexed para exibição
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages || totalPages === 0,
    };
  }, [currentPage, totalPages, items.length, itemsPerPage]);

  // Handlers memoizados
  const goToPage = useCallback(
    (page) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (pageInfo.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pageInfo.hasNextPage]);

  const previousPage = useCallback(() => {
    if (pageInfo.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pageInfo.hasPreviousPage]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Range de páginas para exibição (útil para navegação numérica)
  const pageRange = useMemo(() => {
    const delta = 2; // Quantas páginas mostrar de cada lado da atual
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return {
    // Dados paginados
    paginatedItems,
    pageInfo,
    pageRange,

    // Controles de navegação
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    resetPage,

    // Estado atual
    currentPage,
    totalPages,
  };
}
