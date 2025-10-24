/**
 * Constantes para status de HQs
 * Mapeamento baseado no design do Figma
 */

export const COMIC_STATUS = {
  OWNED: "OWNED",
  READING: "READING",
  WISHLIST: "WISHLIST",
  COMPLETED: "COMPLETED",
};

export const STATUS_CONFIG = {
  [COMIC_STATUS.OWNED]: {
    label: "Na Coleção",
    color: "#4C6EF5",
    backgroundColor: "#4C6EF5",
    textColor: "#FFFFFF",
    className: "owned",
  },
  [COMIC_STATUS.READING]: {
    label: "Lendo",
    color: "#FFD43B",
    backgroundColor: "#FFD43B",
    textColor: "#212529",
    className: "reading",
  },
  [COMIC_STATUS.WISHLIST]: {
    label: "Wishlist",
    color: "#E03131",
    backgroundColor: "#E03131",
    textColor: "#FFFFFF",
    className: "wishlist",
  },
  [COMIC_STATUS.COMPLETED]: {
    label: "Completo",
    color: "#51CF66",
    backgroundColor: "#51CF66",
    textColor: "#FFFFFF",
    className: "completed",
  },
};

/**
 * Retorna a configuração de um status
 * @param {string} status - Status da HQ
 * @returns {object} Configuração do status
 */
export function getStatusConfig(status) {
  const normalizedStatus = status?.toUpperCase();
  return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG[COMIC_STATUS.OWNED];
}

/**
 * Retorna o label amigável de um status
 * @param {string} status - Status da HQ
 * @returns {string} Label do status
 */
export function getStatusLabel(status) {
  return getStatusConfig(status).label;
}

/**
 * Retorna a cor de um status
 * @param {string} status - Status da HQ
 * @returns {string} Cor hexadecimal do status
 */
export function getStatusColor(status) {
  return getStatusConfig(status).color;
}

/**
 * Retorna a classe CSS de um status
 * @param {string} status - Status da HQ
 * @returns {string} Nome da classe CSS
 */
export function getStatusClassName(status) {
  return getStatusConfig(status).className;
}
