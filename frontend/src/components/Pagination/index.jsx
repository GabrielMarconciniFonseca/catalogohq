import PropTypes from 'prop-types';
import './Pagination.css';

/**
 * Componente de paginação otimizado com estados derivados
 * Renderiza controles de navegação entre páginas
 */
function Pagination({ pageInfo, pageRange, onPageChange }) {
  const {
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
  } = pageInfo;

  // Não renderizar se houver apenas 1 página
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination" role="navigation" aria-label="Navegação de páginas">
      {/* Informações da página atual */}
      <div className="pagination__info" aria-live="polite">
        Mostrando <strong>{startIndex}-{endIndex}</strong> de <strong>{totalItems}</strong> itens
      </div>

      {/* Controles de navegação */}
      <div className="pagination__controls">
        {/* Primeira página */}
        <button
          type="button"
          className="pagination__button pagination__button--first"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="Primeira página"
          title="Primeira página"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4L7 8L11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 4L3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Página anterior */}
        <button
          type="button"
          className="pagination__button pagination__button--prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          aria-label="Página anterior"
          title="Página anterior"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Números de página */}
        <div className="pagination__pages">
          {pageRange.map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="pagination__dots" aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Página ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Próxima página */}
        <button
          type="button"
          className="pagination__button pagination__button--next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Próxima página"
          title="Próxima página"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Última página */}
        <button
          type="button"
          className="pagination__button pagination__button--last"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Última página"
          title="Última página"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4L9 8L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  pageInfo: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    startIndex: PropTypes.number.isRequired,
    endIndex: PropTypes.number.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    hasPreviousPage: PropTypes.bool.isRequired,
    isFirstPage: PropTypes.bool.isRequired,
    isLastPage: PropTypes.bool.isRequired,
  }).isRequired,
  pageRange: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
