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
          placeholder="Busque por nome ou descrição"
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="search-category">Categoria</label>
        <select id="search-category" name="category" value={filters.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'todos' ? 'Todas as categorias' : category}
            </option>
          ))}
        </select>
      </div>
      {isLoading && <span className="search-bar__status">Atualizando...</span>}
    </div>
  );
}

SearchBar.propTypes = {
  filters: PropTypes.shape({
    term: PropTypes.string,
    category: PropTypes.string,
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
