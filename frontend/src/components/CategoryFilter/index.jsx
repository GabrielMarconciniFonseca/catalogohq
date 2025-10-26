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
    <div className="category-filter">
      {categoriesToDisplay.map((category) => {
        const IconComponent = iconMap[category.id] || MdGridView;
        
        return (
          <button
            key={category.id}
            className={`filter-button ${activeFilter === category.id ? 'active' : ''}`}
            onClick={() => onFilterChange(category.id)}
            aria-label={`Filtrar por ${category.label}`}
          >
            <IconComponent className="icon" aria-hidden="true" />
            <span className="text">{category.label} ({category.count})</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;