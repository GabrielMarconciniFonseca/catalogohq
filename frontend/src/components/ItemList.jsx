import PropTypes from 'prop-types';
import './ItemList.css';

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
              <h3>{item.title}</h3>
              <p className="item-list__meta">
                <span>{item.author}</span>
                <span aria-hidden="true">•</span>
                <span>{item.publisher ?? 'Editora não informada'}</span>
              </p>
              <p className="item-list__description">{item.description ?? 'Sem descrição cadastrada.'}</p>
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
      author: PropTypes.string.isRequired,
      publisher: PropTypes.string,
      description: PropTypes.string,
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
