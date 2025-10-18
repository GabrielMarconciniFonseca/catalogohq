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
        <h2>{item.title}</h2>
        <p className="item-detail__subtitle">
          {item.author} · {item.publisher ?? 'Editora não informada'}
        </p>
      </header>
      {item.imageUrl && (
        <figure className="item-detail__figure">
          <img src={item.imageUrl} alt={`Capa da HQ ${item.title}`} loading="lazy" />
          <figcaption>Capa enviada para a HQ selecionada</figcaption>
        </figure>
      )}
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
        {item.stockQuantity != null && (
          <div>
            <dt>Estoque</dt>
            <dd>{item.stockQuantity} unidades</dd>
          </div>
        )}
        {item.releaseDate && (
          <div>
            <dt>Data de lançamento</dt>
            <dd>
              {new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(item.releaseDate))}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}

ItemDetail.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    author: PropTypes.string,
    publisher: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    stockQuantity: PropTypes.number,
    releaseDate: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

ItemDetail.defaultProps = {
  item: null,
  isLoading: false,
};

export default ItemDetail;
