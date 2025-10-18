import PropTypes from 'prop-types';
import './SearchBar.css';

function SearchBar({ filters, categories, onChange, isLoading }) {
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
          placeholder="Busque por título, autor ou descrição"
          aria-label="Buscar HQ por título, autor ou descrição"
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="search-publisher">Editora</label>
        <select id="search-publisher" name="publisher" value={filters.publisher} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'todos' ? 'Todas as editoras' : category}
            </option>
          ))}
        </select>
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
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

SearchBar.defaultProps = {
  categories: ['todos'],
  isLoading: false,
};

export default SearchBar;
