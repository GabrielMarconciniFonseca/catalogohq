import PropTypes from 'prop-types';
import './styles.css';

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
      {items.map((item) => (
        <div key={item.id} className="comic-card">
          <div className="comic-card__image-container">
            <div className="comic-card__image">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={`Capa de ${item.title}`} loading="lazy" />
              ) : (
                <div className="comic-card__image-fallback">
                  <span>Sem imagem</span>
                </div>
              )}
            </div>
            
            <div className={`comic-card__badge comic-card__badge--${item.status?.toLowerCase() || 'owned'}`}>
              <span>{item.status || 'OWNED'}</span>
            </div>
          </div>

          <div className="comic-card__content">
            <div className="comic-card__header">
              <h3 className="comic-card__title">{item.title}</h3>
              <p className="comic-card__subtitle">
                {item.series ? `${item.series} • #${item.issue || '1'}` : `#${item.issue || '1'}`}
              </p>
            </div>

            <div className="comic-card__info">
              <div className="comic-card__publisher-year">
                <span>{item.publisher || 'Editora desconhecida'}</span>
                <span>{item.year || new Date().getFullYear()}</span>
              </div>

              <div className="comic-card__rating">
                <span className="comic-card__rating-value">{item.rating || '4.5'}</span>
              </div>

              <div className="comic-card__tags">
                {(item.tags || []).slice(0, 3).map((tag, index) => (
                  <span key={index} className="comic-card__tag">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="comic-card__button"
            onClick={() => onSelectItem(item.id)}
            aria-label={`Ver detalhes de ${item.title}`}
          />
        </div>
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
  isLoading: false,
  error: null,
};

export default ItemList;