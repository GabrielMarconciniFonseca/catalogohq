import React from 'react';
import './CategoryFilter.css';
import todasIcon from '../../assets/figma/todas.svg';
import colecaoIcon from '../../assets/figma/colecao.svg';
import wishlistIcon from '../../assets/figma/wishlist.svg';
import lendoIcon from '../../assets/figma/lendo.svg';
import completosIcon from '../../assets/figma/completos.svg';

const CategoryFilter = ({ 
  activeFilter = 'todos', 
  categories = [],
  onFilterChange = () => {} 
}) => {
  const defaultCategories = [
    { id: 'todos', label: 'Todas', count: 0, icon: todasIcon },
    { id: 'OWNED', label: 'Coleção', count: 0, icon: colecaoIcon },
    { id: 'WISHLIST', label: 'Wishlist', count: 0, icon: wishlistIcon },
    { id: 'READING', label: 'Lendo', count: 0, icon: lendoIcon },
    { id: 'COMPLETED', label: 'Completos', count: 0, icon: completosIcon },
  ];

  const categoriesToDisplay = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="category-filter">
      {categoriesToDisplay.map((category) => (
        <button
          key={category.id}
          className={`filter-button ${activeFilter === category.id ? 'active' : ''}`}
          onClick={() => onFilterChange(category.id)}
        >
          <img src={category.icon} alt={category.label} className="icon" />
          <span className="text">{category.label} ({category.count})</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;