import PropTypes from 'prop-types';
import './CardRating.css';

/**
 * Calcula a porcentagem de preenchimento de uma estrela específica
 * @param {number} rating - Rating total (0-5)
 * @param {number} starIndex - Índice da estrela (1-5)
 * @returns {number} Porcentagem de preenchimento (0-100)
 */
const getStarFillPercentage = (rating, starIndex) => {
  const starPosition = starIndex - 1; // Converte para índice 0-based
  
  if (rating >= starIndex) {
    // Estrela completamente cheia
    return 100;
  } else if (rating > starPosition && rating < starIndex) {
    // Estrela parcialmente cheia
    return (rating - starPosition) * 100;
  } else {
    // Estrela vazia
    return 0;
  }
};

/**
 * Ícone de estrela com suporte a preenchimento parcial
 * @param {number} fillPercentage - Porcentagem de preenchimento (0-100)
 * @param {number} index - Índice da estrela para ID único
 */
const StarIcon = ({ fillPercentage, index }) => {
  const gradientId = `star-gradient-${index}`;
  const isFilled = fillPercentage > 0;
  
  return (
    <svg 
      width="6" 
      height="6" 
      viewBox="0 0 6 6" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="card-rating__star"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercentage}%`} stopColor="#FFD43B" />
          <stop offset={`${fillPercentage}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M3 0.5L3.67376 2.17376L5.5 2.5L4 3.82624L4.5 5.5L3 4.5L1.5 5.5L2 3.82624L0.5 2.5L2.32624 2.17376L3 0.5Z"
        fill={`url(#${gradientId})`}
        stroke={isFilled ? '#FFD43B' : 'rgba(113, 113, 130, 0.3)'}
        strokeWidth="0.5"
      />
    </svg>
  );
};

StarIcon.propTypes = {
  fillPercentage: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * CardRating - Componente de rating com estrelas cheias/parciais
 * @param {number} rating - Nota de 0 a 5
 */
function CardRating({ rating = 0 }) {
  const normalizedRating = Math.min(Math.max(rating, 0), 5);
  
  return (
    <div className="card-rating">
      <div className="card-rating__stars">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = getStarFillPercentage(normalizedRating, starIndex);
          return (
            <StarIcon 
              key={starIndex} 
              fillPercentage={fillPercentage}
              index={starIndex}
            />
          );
        })}
      </div>
      <span className="card-rating__value">{normalizedRating.toFixed(1)}</span>
    </div>
  );
}

CardRating.propTypes = {
  rating: PropTypes.number,
};

CardRating.defaultProps = {
  rating: 0,
};

export default CardRating;
