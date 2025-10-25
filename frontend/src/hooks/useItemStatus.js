import { useState, useCallback } from "react";
import { updateItemStatus as updateItemStatusApi } from "../services/api";
import { getStatusLabel } from "../constants/comicStatus";

/**
 * Hook para orquestrar atualização de status de items e feedback ao usuário
 *
 * @returns {Object} Objeto contendo:
 *   - updateStatus: função assíncrona para atualizar status de um item
 *   - feedback: objeto com state ('idle' | 'loading' | 'success' | 'error') e message
 *   - clearFeedback: função para limpar o feedback
 *   - isLoading: boolean indicando se há uma operação em andamento
 *
 * @example
 * ```jsx
 * const { updateStatus, feedback, clearFeedback, isLoading } = useItemStatus();
 *
 * const handleStatusChange = async (itemId, newStatus) => {
 *   const success = await updateStatus(itemId, newStatus);
 *   if (success) {
 *     // Atualizar UI ou refetch de dados
 *   }
 * };
 * ```
 */
export function useItemStatus() {
  const [feedback, setFeedback] = useState({
    state: "idle",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Atualiza o status de um item
   * @param {number|string} itemId - ID do item a ser atualizado
   * @param {string} newStatus - Novo status (OWNED, READING, WISHLIST, COMPLETED)
   * @returns {Promise<boolean>} true se sucesso, false se erro
   */
  const updateStatus = useCallback(async (itemId, newStatus) => {
    if (!itemId) {
      setFeedback({
        state: "error",
        message: "ID do item é obrigatório.",
      });
      return false;
    }

    if (!newStatus) {
      setFeedback({
        state: "error",
        message: "Status é obrigatório.",
      });
      return false;
    }

    setIsLoading(true);
    setFeedback({
      state: "loading",
      message: "Atualizando status...",
    });

    try {
      await updateItemStatusApi(itemId, newStatus);
      const statusLabel = getStatusLabel(newStatus);
      setFeedback({
        state: "success",
        message: `Status atualizado para "${statusLabel}" com sucesso!`,
      });

      // Auto-limpar feedback de sucesso após 3 segundos
      setTimeout(() => {
        setFeedback({ state: "idle", message: "" });
      }, 3000);

      return true;
    } catch (error) {
      setFeedback({
        state: "error",
        message: error.message || "Erro ao atualizar status. Tente novamente.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpa o feedback atual
   */
  const clearFeedback = useCallback(() => {
    setFeedback({ state: "idle", message: "" });
  }, []);

  return {
    updateStatus,
    feedback,
    clearFeedback,
    isLoading,
  };
}
