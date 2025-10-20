import PropTypes from 'prop-types';
import './styles.css';

function SearchBar({ filters, onChange, isLoading }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ [name]: value });
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-container">
        <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.33"/>
          <path d="m11 11 2.5 2.5" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
        </svg>
        <input
          id="search-term"
          name="term"
          value={filters.term}
          onChange={handleChange}
          placeholder="Buscar HQs, séries, editoras..."
          aria-label="Buscar HQ"
          className="search-bar__input"
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
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

SearchBar.defaultProps = {
  isLoading: false,
};

export default SearchBar;
