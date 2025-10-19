import PropTypes from 'prop-types';
import './SearchBar.css';

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'OWNED', label: 'Na coleção' },
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'ORDERED', label: 'Encomendado' },
  { value: 'LENT', label: 'Emprestado' },
];

function SearchBar({ filters, publishers, seriesOptions, onChange, isLoading }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ [name]: value });
  };

  return (
    <div className="search-bar">
      <div className="search-bar__field">
        <label htmlFor="search-term">Buscar</label>
        <input
          id="search-term"
          name="term"
          value={filters.term}
          onChange={handleChange}
          placeholder="Busque por título, série, editora ou localização"
          aria-label="Buscar HQ"
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="search-publisher">Editora</label>
        <select id="search-publisher" name="publisher" value={filters.publisher} onChange={handleChange}>
          {publishers.map((publisher) => (
            <option key={publisher} value={publisher}>
              {publisher === 'todos' ? 'Todas as editoras' : publisher}
            </option>
          ))}
        </select>
      </div>
      <div className="search-bar__field">
        <label htmlFor="search-series">Série</label>
        <select id="search-series" name="series" value={filters.series} onChange={handleChange}>
          {seriesOptions.map((series) => (
            <option key={series} value={series}>
              {series === 'todas' ? 'Todas as séries' : series}
            </option>
          ))}
        </select>
      </div>
      <div className="search-bar__field">
        <label htmlFor="search-status">Status</label>
        <select id="search-status" name="status" value={filters.status} onChange={handleChange}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="search-bar__field">
        <label htmlFor="search-tags">Tags</label>
        <input
          id="search-tags"
          name="tags"
          value={filters.tags}
          onChange={handleChange}
          placeholder="Ex.: marvel, capa dura"
        />
      </div>
      {isLoading && (
        <span className="search-bar__status" role="status" aria-live="polite">
          Atualizando...
        </span>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  filters: PropTypes.shape({
    term: PropTypes.string,
    publisher: PropTypes.string,
    series: PropTypes.string,
    status: PropTypes.string,
    tags: PropTypes.string,
  }).isRequired,
  publishers: PropTypes.arrayOf(PropTypes.string),
  seriesOptions: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

SearchBar.defaultProps = {
  publishers: ['todos'],
  seriesOptions: ['todas'],
  isLoading: false,
};

export default SearchBar;
