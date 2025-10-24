import { useState, useMemo, useCallback } from "react";
import { ensureArray, SAFE_INITIAL_STATES } from "../utils/arrayHelpers.js";

/**
 * Hook customizado para gerenciar filtros de categoria e itens filtrados
 * Encapsula toda a lógica de filtragem, contagem e categorização
 *
 * @param {Array} items - Array de items para filtrar
 * @returns {Object} Objeto com filteredItems, categories, publishers, etc.
 */
export function useCategoryFilters(items = []) {
  // Estado dos filtros
  const [filters, setFilters] = useState(SAFE_INITIAL_STATES.filters);

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Garantir que items seja sempre um array
  const safeItems = useMemo(
    () => ensureArray(items, "useCategoryFilters"),
    [items]
  );

  // Calcular editoras únicas
  const publishers = useMemo(() => {
    const uniquePublishers = new Set(
      safeItems.map((item) => item.publisher ?? "Outros")
    );
    return ["todos", ...Array.from(uniquePublishers)];
  }, [safeItems]);

  // Calcular séries únicas
  const seriesOptions = useMemo(() => {
    const uniqueSeries = new Set(
      safeItems.map((item) => item.series ?? "Outras séries")
    );
    return ["todas", ...Array.from(uniqueSeries)];
  }, [safeItems]);

  // Processar tags ativas do filtro
  const activeFilterTags = useMemo(() => {
    if (!filters.tags.trim()) {
      return [];
    }
    return filters.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }, [filters.tags]);

  // Aplicar todos os filtros aos items
  const filteredItems = useMemo(() => {
    const term = filters.term.trim().toLowerCase();

    return safeItems.filter((item) => {
      // Filtro por termo de busca
      const matchesTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        (item.series ?? "").toLowerCase().includes(term) ||
        (item.publisher ?? "").toLowerCase().includes(term) ||
        (item.location ?? "").toLowerCase().includes(term) ||
        (item.description ?? "").toLowerCase().includes(term) ||
        (item.tags ?? []).some((tag) => tag.toLowerCase().includes(term));

      // Filtro por editora
      const publisherLabel = item.publisher ?? "Outros";
      const matchesPublisher =
        filters.publisher === "todos" || publisherLabel === filters.publisher;

      // Filtro por série
      const seriesLabel = item.series ?? "Outras séries";
      const matchesSeries =
        filters.series === "todas" || seriesLabel === filters.series;

      // Filtro por status
      const matchesStatus =
        filters.status === "todos" || item.status === filters.status;

      // Filtro por tags
      const matchesTags =
        !activeFilterTags.length ||
        activeFilterTags.every((tag) =>
          (item.tags ?? []).some((itemTag) =>
            itemTag.toLowerCase().includes(tag)
          )
        );

      return (
        matchesTerm &&
        matchesPublisher &&
        matchesSeries &&
        matchesStatus &&
        matchesTags
      );
    });
  }, [safeItems, filters, activeFilterTags]);

  // Calcular categorias com contagens
  const categories = useMemo(
    () => [
      {
        id: "todos",
        label: "Todas",
        count: safeItems.length,
      },
      {
        id: "OWNED",
        label: "Coleção",
        count: safeItems.filter((item) => item.status === "OWNED").length,
      },
      {
        id: "WISHLIST",
        label: "Wishlist",
        count: safeItems.filter((item) => item.status === "WISHLIST").length,
      },
      {
        id: "READING",
        label: "Lendo",
        count: safeItems.filter((item) => item.status === "READING").length,
      },
      {
        id: "COMPLETED",
        label: "Completos",
        count: safeItems.filter((item) => item.status === "COMPLETED").length,
      },
    ],
    [safeItems]
  );

  // Função helper para atualizar filtro específico
  const updateFilter = useCallback(
    (key, value) => {
      updateFilters({ [key]: value });
    },
    [updateFilters]
  );

  // Função para resetar filtros
  const resetFilters = useCallback(() => {
    setFilters(SAFE_INITIAL_STATES.filters);
  }, []);

  return {
    // Estados
    filters,
    filteredItems,
    categories,
    publishers,
    seriesOptions,
    activeFilterTags,

    // Ações
    updateFilters,
    updateFilter,
    resetFilters,

    // Stats
    totalItems: safeItems.length,
    filteredCount: filteredItems.length,
  };
}
