import PropTypes from 'prop-types';
import ComicCard from '../ComicCard';
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
    <div className="item-list">
      {Array.isArray(items) && items.map((item) => (
        <ComicCard 
          key={item.id} 
          item={item} 
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      series: PropTypes.string,
      issue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      publisher: PropTypes.string,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
      imageUrl: PropTypes.string,
      rating: PropTypes.number,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

ItemList.defaultProps = {
  items: [], // Valor padrão como array vazio para evitar erro .map
  isLoading: false,
  error: null,
};

export default ItemList;