import PropTypes from 'prop-types';
import './ItemDetail.css';

const STATUS_OPTIONS = [
  { value: 'OWNED', label: 'Na coleção' },
  { value: 'WISHLIST', label: 'Na wishlist' },
  { value: 'ORDERED', label: 'Encomendado' },
  { value: 'LENT', label: 'Emprestado' },
];

function ItemDetail({ item, isLoading, onUpdateStatus }) {
  if (isLoading && !item) {
    return <p className="item-detail__placeholder">Carregando detalhes...</p>;
  }

  if (!item) {
    return <p className="item-detail__placeholder">Selecione um item para visualizar os detalhes.</p>;
  }

  const handleStatusChange = (event) => {
    if (!onUpdateStatus) {
      return;
    }
    onUpdateStatus(item.id, event.target.value);
  };

  return (
    <article className="item-detail">
      <header>
        <h2>{item.title}</h2>
        <p className="item-detail__subtitle">
          {item.series ? `${item.series} · ` : ''}Edição #{item.issueNumber}
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
        <div>
          <dt>Editora</dt>
          <dd>{item.publisher ?? 'Não informada'}</dd>
        </div>
        <div>
          <dt>Idioma</dt>
          <dd>{item.language ?? 'Não informado'}</dd>
        </div>
        <div>
          <dt>Condição</dt>
          <dd>{item.condition ?? 'Não informado'}</dd>
        </div>
        <div>
          <dt>Localização</dt>
          <dd>{item.location ?? 'Não informada'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            {onUpdateStatus ? (
              <select value={item.status} onChange={handleStatusChange} className="item-detail__status">
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              item.status
            )}
          </dd>
        </div>
      </dl>
      {item.tags?.length ? (
        <ul className="item-detail__tags" aria-label="Tags da edição selecionada">
          {item.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

ItemDetail.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    series: PropTypes.string,
    issueNumber: PropTypes.string,
    publisher: PropTypes.string,
    language: PropTypes.string,
    condition: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    imageUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  isLoading: PropTypes.bool,
  onUpdateStatus: PropTypes.func,
};

ItemDetail.defaultProps = {
  item: null,
  isLoading: false,
  onUpdateStatus: null,
};

export default ItemDetail;
