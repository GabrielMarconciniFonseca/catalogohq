import PropTypes from 'prop-types';
import './ItemList.css';

const STATUS_LABELS = {
  OWNED: 'Na coleção',
  WISHLIST: 'Wishlist',
  ORDERED: 'Encomendado',
  LENT: 'Emprestado',
};

function ItemList({ items, onSelectItem, isLoading, error }) {
  if (isLoading) {
    return <p className="item-list__placeholder">Carregando listagem...</p>;
  }

  if (error) {
    return (
      <p className="item-list__placeholder item-list__placeholder--error" role="alert">
        Ocorreu um erro ao carregar os itens.
      </p>
    );
  }

  if (!items.length) {
    return <p className="item-list__placeholder">Nenhum item encontrado.</p>;
  }

  return (
    <ul className="item-list" aria-live="polite">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="item-list__button"
            onClick={() => onSelectItem(item.id)}
            aria-label={`Ver detalhes de ${item.title}`}
          >
            <div className="item-list__thumb" aria-hidden={!item.imageUrl}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={`Capa de ${item.title}`} loading="lazy" />
              ) : (
                <span className="item-list__thumb-fallback" aria-hidden="true">
                  {item.title.charAt(0)}
                </span>
              )}
            </div>
            <div className="item-list__content">
              <div className="item-list__header">
                <h3>{item.title}</h3>
                <span className={`item-list__badge item-list__badge--${item.status ? item.status.toLowerCase() : 'owned'}`}>
                  {STATUS_LABELS[item.status] ?? 'Na coleção'}
                </span>
              </div>
              <p className="item-list__meta">
                {item.series ? `${item.series} · ` : ''}Edição #{item.issueNumber}
              </p>
              <p className="item-list__description">
                {item.publisher ?? 'Editora não informada'} • {item.language ?? 'Idioma não informado'}
              </p>
              {item.tags?.length ? (
                <ul className="item-list__tags" aria-label="Tags da edição">
                  {item.tags.map((tag) => (
                    <li key={tag}>#{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      series: PropTypes.string,
      issueNumber: PropTypes.string,
      publisher: PropTypes.string,
      language: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      status: PropTypes.string,
      imageUrl: PropTypes.string,
    }),
  ).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
};

ItemList.defaultProps = {
  isLoading: false,
  error: null,
};

export default ItemList;
