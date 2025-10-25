import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import searchIcon from '../../assets/figma/search-container-icon.svg';
import './SearchBar.css';

function SearchBar({ filters, onChange, isLoading }) {
  // Handler memoizado para evitar re-criação em cada render
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    onChange({ [name]: value });
  }, [onChange]);

  // Valor do termo de busca derivado e memoizado
  const searchTerm = useMemo(() => filters.term || '', [filters.term]);

  // Status de loading memoizado
  const loadingText = useMemo(() => (
    isLoading ? 'Atualizando...' : null
  ), [isLoading]);

  return (
    <div className="search-bar">
      <div className="search-bar__input-container">
        <img
          src={searchIcon}
          alt=""
          className="search-bar__icon"
          width="16"
          height="16"
          aria-hidden="true"
        />
        <input
          id="search-term"
          name="term"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Buscar HQs, séries, editoras..."
          aria-label="Buscar HQ"
          className="search-bar__input"
        />
      </div>
      {loadingText && (
        <span className="search-bar__status" role="status" aria-live="polite">
          {loadingText}
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
