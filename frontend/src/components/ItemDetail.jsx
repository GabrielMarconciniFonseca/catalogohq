import PropTypes from 'prop-types';
import './ItemDetail.css';

function ItemDetail({ item, isLoading }) {
  if (isLoading && !item) {
    return <p className="item-detail__placeholder">Carregando detalhes...</p>;
  }

  if (!item) {
    return <p className="item-detail__placeholder">Selecione um item para visualizar os detalhes.</p>;
  }

  return (
    <article className="item-detail">
      <header>
        <h2>{item.name}</h2>
        {item.category && <span className="item-detail__category">{item.category}</span>}
      </header>
      <p className="item-detail__description">{item.description ?? 'Sem descrição disponível.'}</p>
      <dl className="item-detail__meta">
        {item.price != null && (
          <div>
            <dt>Preço</dt>
            <dd>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(item.price)}
            </dd>
          </div>
        )}
        {item.stock != null && (
          <div>
            <dt>Estoque</dt>
            <dd>{item.stock} unidades</dd>
          </div>
        )}
        {item.sku && (
          <div>
            <dt>SKU</dt>
            <dd>{item.sku}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

ItemDetail.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    sku: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

ItemDetail.defaultProps = {
  item: null,
  isLoading: false,
};

export default ItemDetail;
