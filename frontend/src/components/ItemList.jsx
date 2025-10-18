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
          <button type="button" className="item-list__button" onClick={() => onSelectItem(item.id)}>
            <div>
              <h3>{item.name}</h3>
              {item.category && <span className="item-list__tag">{item.category}</span>}
            </div>
            <p>{item.description}</p>
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
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
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
