import React from 'react';
import './CategoryFilter.css';
import { 
  MdGridView, 
  MdCollections, 
  MdFavoriteBorder, 
  MdMenuBook, 
  MdCheckCircle 
} from 'react-icons/md';

const CategoryFilter = ({ 
  activeFilter = 'todos', 
  categories = [],
  onFilterChange = () => {} 
}) => {
  // Mapa de ícones por ID de categoria usando React Icons
  const iconMap = {
    'todos': MdGridView,
    'OWNED': MdCollections,
    'WISHLIST': MdFavoriteBorder,
    'READING': MdMenuBook,
    'COMPLETED': MdCheckCircle,
  };

  const defaultCategories = [
    { id: 'todos', label: 'Todas', count: 0 },
    { id: 'OWNED', label: 'Coleção', count: 0 },
    { id: 'WISHLIST', label: 'Wishlist', count: 0 },
    { id: 'READING', label: 'Lendo', count: 0 },
    { id: 'COMPLETED', label: 'Completos', count: 0 },
  ];

  const categoriesToDisplay = categories.length > 0 ? categories : defaultCategories;

  return (
    <nav className="category-filter" aria-label="Filtros de categoria">
      {categoriesToDisplay.map((category) => {
        const IconComponent = iconMap[category.id] || MdGridView;
        const isActive = activeFilter === category.id;
        
        return (
          <button
            key={category.id}
            className={`filter-button ${isActive ? 'active' : ''}`}
            onClick={() => onFilterChange(category.id)}
            aria-label={`Filtrar por ${category.label}, ${category.count} ${category.count === 1 ? 'item' : 'itens'}`}
            aria-pressed={isActive}
            type="button"
          >
            <IconComponent className="icon" aria-hidden="true" />
            <span className="text">{category.label} ({category.count})</span>
          </button>
        );
      })}
    </nav>
  );
};

export default CategoryFilter;